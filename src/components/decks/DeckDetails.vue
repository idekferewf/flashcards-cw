<script setup lang="ts">
import { ROUTES } from "@/constants"
import { useDeckStore } from "@/store/deck.store"
import { useTagStore } from "@/store/tag.store.ts"
import type { IDeck, ITag } from "@/types"
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui"
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const props = defineProps<{
  deck: IDeck
}>()

const emit = defineEmits(["close"])

const toast = useToast()
const router = useRouter()
const route = useRoute()
const deckStore = useDeckStore()
const tagStore = useTagStore()

const isEditModalOpen = ref<boolean>(false)
const deckToDelete = ref<IDeck | null>(null)

const tags = computed<ITag[]>(() => tagStore.getTagsByDeckOrCard(props.deck))

const toggleFavorite = () => {
  const wasFavorite = props.deck.isFavorite
  deckStore.toggleDeckFlag(props.deck.id, "isFavorite")

  toast.add({
    title: wasFavorite ? "Колода удалена из избранного" : "Колода добавлена в избранное",
    icon: wasFavorite ? "i-lucide-star-off" : "i-lucide-star",
    color: wasFavorite ? "neutral" : "warning",
    duration: 2000
  })
}

const toggleArchived = () => {
  const wasArchived = props.deck.isArchived
  deckStore.toggleDeckFlag(props.deck.id, "isArchived")

  toast.add({
    title: wasArchived ? "Колода убрана из архива" : "Колода помещена в архив",
    icon: wasArchived ? "i-lucide-archive-x" : "i-lucide-archive-restore",
    duration: 2000
  })
}

const openDeleteModal = () => {
  deckToDelete.value = props.deck
}

const dropdownItems: DropdownMenuItem[] = [
  {
    label: "Удалить",
    icon: "i-lucide-trash",
    color: "error",
    kbds: ["del"],
    onSelect: () => {
      openDeleteModal()
    }
  }
]

const toolbarLinks = computed<NavigationMenuItem[]>(() => [
  {
    label: "Список карточек",
    icon: "i-lucide-book-a",
    to: ROUTES.DECKS.children.index.fullPath(props.deck?.id ?? "")
  },
  {
    label: "Статистика",
    icon: "i-lucide-chart-no-axes-combined",
    to: ROUTES.DECKS.children.statistics.fullPath(props.deck?.id ?? ""),
    disabled: true
  },
  {
    label: "Настройки",
    icon: "i-lucide-settings",
    to: ROUTES.DECKS.children.settings.fullPath(props.deck?.id ?? "")
  },
  ...(route.name === ROUTES.DECKS.children.createCard.name
    ? [
        {
          label: "Создание карточки",
          icon: "i-lucide-square-plus",
          to: ROUTES.DECKS.children.createCard.fullPath(props.deck?.id ?? ""),
          ui: { item: "ml-auto" }
        }
      ]
    : [])
])

defineShortcuts({
  ctrl_escape: () => emit("close"),
  ctrl_e: {
    handler: () => (isEditModalOpen.value = !isEditModalOpen.value),
    usingInput: true
  },
  delete: () => openDeleteModal(),
  alt_n: {
    handler: () => router.push({ name: ROUTES.DECKS.children.createCard.name }),
    usingInput: true
  }
})
</script>

<template>
  <UDashboardPanel :ui="{ body: 'overflow-x-hidden scrollbar-4px' }">
    <template #header>
      <UDashboardNavbar :toggle="false">
        <!-- Name -->
        <template #leading>
          <UTooltip text="Закрыть колоду" :kbds="['ctrl', 'escape']">
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" class="-ms-1.5" @click="emit('close')" />
          </UTooltip>
        </template>
        <template #title>
          <h1>{{ deck.name }}</h1>
          <TagList v-if="tags.length" :tags="tags.slice(0, 4)" class="ml-1.5 !flex-nowrap !gap-1.5 truncate text-[11px]" />
          <span v-if="tags.length > 4" class="text-toned ml-0.5">...</span>
        </template>
        <!-- /Name -->

        <!-- Right actions -->
        <template #right>
          <DeckEditModal v-model:open="isEditModalOpen" :deck>
            <UButton icon="i-lucide-square-pen" color="neutral" variant="ghost">
              Редактировать
              <UKbd>ctrl + e</UKbd>
            </UButton>
          </DeckEditModal>

          <!-- Archive -->
          <UTooltip text="Архивировать">
            <UButton
              square
              icon="i-lucide-archive"
              color="neutral"
              :variant="deck.isArchived ? 'subtle' : 'ghost'"
              @click="toggleArchived"
            />
          </UTooltip>
          <!-- /Archive -->

          <!-- Favorite -->
          <UTooltip text="Добавить в избранное">
            <UButton
              icon="i-lucide-star"
              color="neutral"
              :variant="deck.isFavorite ? 'subtle' : 'ghost'"
              @click="toggleFavorite"
            />
          </UTooltip>
          <!-- /Favorite -->

          <UDropdownMenu :modal="false" arrow :content="{ align: 'end', sideOffset: 4 }" :items="dropdownItems">
            <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" />
          </UDropdownMenu>

          <USeparator orientation="vertical" class="h-4 px-2" />

          <!-- Create Card -->
          <UTooltip text="Добавить карточку" :kbds="['alt', 'n']">
            <UButton
              :to="{ name: ROUTES.DECKS.children.createCard.name }"
              color="neutral"
              square
              icon="i-lucide-plus"
              class="rounded-full"
            />
          </UTooltip>
          <!-- /Create Card -->
        </template>
        <!-- /Right actions -->
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UNavigationMenu :items="toolbarLinks" highlight class="w-full [&>div]:w-full" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <RouterView v-slot="{ Component }">
        <component :is="Component" :deck="deck" />
      </RouterView>

      <!-- Delete modal -->
      <DeckDeleteModal v-model:deck="deckToDelete" />
      <!-- /Delete modal -->
    </template>
  </UDashboardPanel>
</template>
