<script setup lang="ts">
import { ROUTES } from "@/constants"
import router from "@/router"
import { useDeckStore } from "@/store/deck.store.ts"
import { type IDeck } from "@/types"
import type { TabsItem } from "@nuxt/ui"
import { breakpointsTailwind, useBreakpoints, useElementBounding } from "@vueuse/core"
import { computed, ref, useTemplateRef, watch } from "vue"

const props = defineProps<{
  deckId?: string
}>()

const TabItem = {
  all: "all",
  favorite: "favorite"
} as const

type TTabItem = (typeof TabItem)[keyof typeof TabItem]

const tabItems: TabsItem[] = [
  {
    label: "Все",
    value: TabItem.all
  },
  {
    label: "Избранное",
    value: TabItem.favorite
  }
]

const store = useDeckStore()

const toolbarRef = useTemplateRef("toolbar")
const { height: toolbarHeight } = useElementBounding(toolbarRef)
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller("lg")

const isArchiveOpen = ref<boolean>(false)
const isToolbarOpen = ref<boolean>(false)
const hasArchive = ref<boolean>(false)
const search = ref<string>("")
const selectedTab = ref<TTabItem>(TabItem.all)
const selectedTags = ref<string[]>([])

const selectedDeck = computed<IDeck | null>(() => {
  if (!store.decks) return null
  return store.getDeckById(props.deckId)
})

const filteredDecks = computed<IDeck[]>(() => {
  let decks = store.activeDecks
  if (hasArchive.value) {
    decks = decks.concat(store.archivedDecks)
  }

  decks = filterFavorite(decks)

  if (!isArchiveOpen.value) {
    decks = filterByTags(decks)
    decks = filterBySearch(decks)
  }

  return sortDecksByUpdatedAt(decks)
})

const archivedDecks = computed<IDeck[]>(() => {
  let decks = filterFavorite(store.archivedDecks)

  if (isArchiveOpen.value) {
    decks = filterByTags(decks)
    decks = filterBySearch(decks)
  }

  return sortDecksByUpdatedAt(decks)
})

const tagOptions = computed(() => {
  const map = new Map()

  let decks = store.archivedDecks
  if (!isArchiveOpen.value) {
    decks = store.activeDecks
    if (hasArchive.value) {
      decks = decks.concat(archivedDecks.value)
    }
  }

  decks.forEach(deck => {
    deck.tags.forEach(tag => {
      if (!map.has(tag.label)) {
        map.set(tag.label, {
          label: tag.label,
          value: tag.label,
          chip: { color: tag.color }
        })
      }
    })
  })

  return Array.from(map.values())
})

const isDeckPanelOpen = computed({
  get() {
    return !!selectedDeck.value
  },
  set(value: boolean) {
    if (!value) {
      closeDeck()
    }
  }
})

const filterFavorite = (decks: IDeck[]) => {
  return selectedTab.value === TabItem.favorite ? decks.filter(deck => deck.isFavorite) : decks
}

const filterByTags = (decks: IDeck[]) => {
  if (selectedTags.value.length === 0) return decks

  return decks.filter(deck => selectedTags.value.every(selected => deck.tags.some(tag => tag.label === selected)))
}

const filterBySearch = (decks: IDeck[]) => {
  const searchValue = search.value?.trim().toLowerCase()

  if (!searchValue) return decks

  return decks.filter(deck => {
    const deckName = deck.name.toLowerCase()
    const deckDescription = deck.description?.toLowerCase() || ""

    return deckName.includes(searchValue) || deckDescription.includes(searchValue)
  })
}

const sortDecksByUpdatedAt = (decks: IDeck[]) => {
  return decks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

const closeDeck = () => {
  router.push({ name: ROUTES.DECKS.name })
}

const clearFilters = () => {
  search.value = ""
  hasArchive.value = false
  selectedTags.value = []
}

watch(isArchiveOpen, () => {
  clearFilters()
})

watch(
  selectedDeck,
  deck => {
    if (!deck) return
    isArchiveOpen.value = deck.isArchived
  },
  { immediate: true }
)
</script>

<template>
  <UDashboardPanel id="decks" :default-size="25" :min-size="20" :max-size="30" resizable>
    <UDashboardNavbar title="Колоды" class="z-10">
      <!-- Count -->
      <template #trailing>
        <UBadge
          :label="!store.isLoading && isArchiveOpen ? archivedDecks.length : filteredDecks.length"
          variant="subtle"
          color="neutral"
        />
      </template>
      <!-- /Count -->

      <!-- Tabs -->
      <template #right>
        <UTabs v-model="selectedTab" :items="tabItems" :content="false" size="xs" />
        <UButton square variant="ghost" color="neutral" @click="isToolbarOpen = !isToolbarOpen">
          <UIcon
            name="i-lucide-chevron-up"
            class="size-5 transition-transform"
            :class="[isToolbarOpen ? 'rotate-180' : 'rotate-0']"
          />
        </UButton>
      </template>
      <!-- /Tabs -->
    </UDashboardNavbar>

    <!-- Panel Content -->
    <div class="relative flex h-full flex-col overflow-auto">
      <!-- Filters -->
      <UDashboardToolbar
        ref="toolbar"
        class="absolute top-0 left-0 z-50 w-full flex-col gap-y-0 py-3 transition-all duration-200"
        :class="isToolbarOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-full opacity-0'"
      >
        <!-- Filter Tags -->
        <div class="flex w-full items-center gap-x-2.5">
          <USelectMenu
            v-model="selectedTags"
            :items="tagOptions"
            value-key="value"
            multiple
            :search-input="{ placeholder: 'Искать...', icon: 'i-lucide-search' }"
            icon="i-lucide-tag"
            placeholder="Фильтровать по тегам..."
            class="w-full"
          >
            <template #empty>Ничего не найдено</template>
          </USelectMenu>
          <UButton square variant="subtle" color="neutral" :disabled="selectedTags.length === 0" @click="selectedTags = []">
            <UIcon name="i-lucide-trash" class="text-muted size-4" />
          </UButton>
        </div>
        <!-- /Filter Tags -->

        <div class="mt-3 flex w-full items-center" :class="isArchiveOpen ? 'gap-x-2.5' : 'gap-x-4'">
          <USwitch v-if="!isArchiveOpen" v-model="hasArchive" label="Архив?" checked-icon="i-lucide-check" />
          <UInput v-model="search" icon="i-lucide-search" placeholder="Поиск..." class="w-full" />
          <UButton
            v-if="isArchiveOpen"
            label="Очистить фильтры"
            icon="i-lucide-funnel-x"
            size="sm"
            variant="ghost"
            color="neutral"
            @click="clearFilters"
          />
        </div>

        <!-- Clear Filters -->
        <UButton
          v-if="!isArchiveOpen"
          label="Очистить фильтры"
          icon="i-lucide-funnel-x"
          size="sm"
          variant="ghost"
          color="neutral"
          class="mt-2.5 self-end"
          @click="clearFilters"
        />
        <!-- /Clear Filters -->
      </UDashboardToolbar>
      <!-- /Filters -->

      <!-- Decks -->
      <DecksPanel
        v-model:model-value="selectedDeck"
        v-model:archive-open="isArchiveOpen"
        :decks="filteredDecks"
        :archived-decks="archivedDecks"
        class="transition-[transform,margin] duration-200"
        :style="{ marginTop: isToolbarOpen ? `${toolbarHeight}px` : '0' }"
      />
      <!-- /Decks -->

      <!-- Create -->
      <DeckCreateModal>
        <UButton
          size="lg"
          variant="outline"
          color="neutral"
          class="group absolute right-4 bottom-4 z-20 size-10 items-center gap-1.5 overflow-hidden rounded-full px-[9px] transition-all duration-300 hover:w-[158px] hover:pr-3 hover:pl-3"
        >
          <UIcon name="i-lucide-plus" class="-mb-px shrink-0 text-[22px]" />
          <span class="translate-y-px whitespace-nowrap opacity-0 transition-all duration-300 group-hover:opacity-100">
            Создать колоду
          </span>
        </UButton>
      </DeckCreateModal>
      <!-- /Create -->
    </div>
    <!-- /Panel Content -->
  </UDashboardPanel>

  <DeckDetails v-if="!isMobile && selectedDeck" :deck="selectedDeck" @close="closeDeck" />
  <div v-else class="hidden flex-1 items-center justify-center lg:flex">
    <UIcon name="i-lucide-package" class="text-dimmed size-32" />
  </div>

  <USlideover v-if="isMobile" v-model:open="isDeckPanelOpen">
    <template #content>
      <DeckDetails v-if="selectedDeck" :deck="selectedDeck" @close="closeDeck" />
    </template>
  </USlideover>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 2px;
}

::-webkit-scrollbar-thumb {
  background: var(--ui-color-neutral-300);
  border-radius: 4px;
}
</style>
