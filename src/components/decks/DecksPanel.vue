<script setup lang="ts">
import DeckList from "@/components/decks/DeckList.vue"
import { ROUTES } from "@/constants"
import type { IDeck } from "@/types"
import { isOverlayOpen } from "@/utils"
import { useElementBounding, useResizeObserver } from "@vueuse/core"
import { computed, ref, useTemplateRef, watch } from "vue"
import { useRouter } from "vue-router"

const props = defineProps<{
  decks: IDeck[]
  archivedDecks: IDeck[]
}>()

const selectedDeck = defineModel<IDeck | null>()
const archiveOpen = defineModel<boolean>("archiveOpen", { default: false })

const router = useRouter()

const archiveRef = useTemplateRef<HTMLInputElement>("archive")
const scrollRef = useTemplateRef<HTMLInputElement>("scroll")
const { height: archiveHeight } = useElementBounding(archiveRef)

const archivedListRef = ref<InstanceType<typeof DeckList>>()
const activeListRef = ref<InstanceType<typeof DeckList>>()
const resetPullTimeout = ref<NodeJS.Timeout | null>(null)
const pullDistance = ref<number>(0)
const hasScroll = ref<boolean>(false)
const isLocked = ref<boolean>(false)

const hasArchivedDecks = computed<boolean>(() => props.archivedDecks.length != 0)

const archivedDeckNames = computed<string>(() => {
  return props.archivedDecks.map(deck => deck.name).join(", ")
})

const selectDeck = (deck: IDeck) => {
  router.replace({
    name: ROUTES.DECKS.children.index.name,
    params: { deckId: deck.id }
  })
}

const clearResetPullTimeout = () => {
  if (resetPullTimeout.value) {
    clearTimeout(resetPullTimeout.value)
    resetPullTimeout.value = null
  }
}

const resetPull = () => {
  clearResetPullTimeout()
  pullDistance.value = 0
  isLocked.value = false
}

const lockArchive = () => {
  pullDistance.value = archiveHeight.value
  isLocked.value = true
}

const unlockArchive = () => {
  clearResetPullTimeout()
  pullDistance.value = 0
  isLocked.value = false
}

const onWheel = (e: WheelEvent) => {
  if (!hasArchivedDecks.value) return
  const el = scrollRef.value
  if (!el) return

  clearResetPullTimeout()

  if (el.scrollTop <= 0 && e.deltaY < 0 && !isLocked.value) {
    const delta = Math.abs(e.deltaY) * 0.15 * (1 - Math.min(pullDistance.value / archiveHeight.value, 0.8))
    pullDistance.value += delta

    if (pullDistance.value >= archiveHeight.value) {
      lockArchive()
      return
    }

    resetPullTimeout.value = setTimeout(() => {
      if (!isLocked.value) {
        resetPull()
      }
    }, 400)

    return
  }

  if (pullDistance.value > 0 && e.deltaY > 0 && !isLocked.value) {
    e.preventDefault()
    resetPull()
    return
  }

  if (isLocked.value && e.deltaY > 0) {
    unlockArchive()
  }
}

watch(selectedDeck, () => {
  if (!selectedDeck.value) return
  const el = selectedDeck.value?.isArchived
    ? archivedListRef.value?.getDeckEl(selectedDeck.value.id)
    : activeListRef.value?.getDeckEl(selectedDeck.value.id)
  if (el) {
    el.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }
})

const moveSelection = (direction: 1 | -1) => {
  const decks = archiveOpen.value ? props.archivedDecks : props.decks
  if (!decks.length) return

  const index = decks.findIndex(d => d.id === selectedDeck.value?.id)

  let nextIndex: number

  if (index === -1) {
    nextIndex = direction === 1 ? 0 : decks.length - 1
  } else {
    nextIndex = index + direction
  }

  if (nextIndex < 0 || nextIndex >= decks.length) return

  const deck = decks[nextIndex] as IDeck
  selectDeck(deck)
}

watch(
  () => props.archivedDecks,
  () => {
    if (!props.archivedDecks.length) {
      unlockArchive()
    }
  }
)

defineShortcuts({
  arrowdown: () => {
    if (isOverlayOpen()) return
    moveSelection(1)
  },
  arrowup: () => {
    if (isOverlayOpen()) return
    moveSelection(-1)
  }
})

useResizeObserver(scrollRef, () => {
  const el = scrollRef.value
  if (!el) return

  hasScroll.value = el.scrollHeight > el.clientHeight
})
</script>

<template>
  <div
    ref="scroll"
    class="relative h-full overflow-x-hidden overflow-y-auto overscroll-none"
    :class="{ 'overflow-y-hidden pr-0.5': archiveOpen && hasScroll }"
    @wheel="onWheel"
  >
    <!-- Archive -->
    <div
      class="bg-default absolute top-0 left-0 z-10 flex h-full w-full flex-col transition-transform duration-150 focus:outline-none"
      :class="[archiveOpen ? 'translate-x-0' : '-translate-x-full']"
    >
      <!-- Archive Header -->
      <div class="border-b-default flex min-h-16 items-center justify-between gap-1.5 border-b p-4 sm:px-6">
        <div class="flex items-center gap-3.5 text-sm font-semibold">
          <div class="bg-primary flex size-10 min-w-10 items-center justify-center rounded-full">
            <UIcon name="i-lucide-archive" class="text-inverted size-4" />
          </div>
          <div class="flex flex-col gap-y-0.5">
            <span>Архивированные колоды</span>
            <span class="text-muted line-clamp-1 text-xs font-normal break-all">Нажмите на колоду, чтобы открыть её.</span>
          </div>
        </div>
        <UButton square variant="ghost" color="neutral" icon="i-lucide-x" @click="archiveOpen = false" />
      </div>
      <!-- /Archive Header -->

      <!-- Archive Content -->
      <DeckList ref="archivedListRef" :decks="archivedDecks" :selected-id="selectedDeck?.id" @select="deck => selectDeck(deck)" />
      <!-- /Archive Content -->
    </div>
    <!-- /Archive -->

    <div class="transition-transform duration-300 ease-out" :style="{ transform: `translateY(${pullDistance}px)` }">
      <!-- Archive Button -->
      <div
        v-if="hasArchivedDecks"
        ref="archive"
        class="bg-muted/50 hover:bg-muted absolute right-0 left-0 z-10 flex cursor-pointer items-center justify-between px-5 py-3 transition-colors duration-300"
        :style="{ top: `-${archiveHeight}px` }"
        @click="archiveOpen = true"
      >
        <div class="flex items-center gap-3.5">
          <div class="bg-primary flex size-12 min-w-12 items-center justify-center rounded-full">
            <UIcon name="i-lucide-archive" class="text-inverted size-5" />
          </div>
          <div class="flex flex-col gap-y-0.5 text-sm font-semibold">
            <span>Архив</span>
            <span class="text-muted line-clamp-1 font-normal break-all">{{ archivedDeckNames }}</span>
          </div>
        </div>
        <span class="text-muted ms-3 text-xs">Открыть</span>
      </div>
      <!-- /Archive Button -->

      <!-- Decks -->
      <DeckList
        v-if="decks.length"
        ref="activeListRef"
        :decks
        :selected-id="selectedDeck?.id"
        @select="deck => selectDeck(deck)"
      />
      <div
        v-else
        class="text-default flex w-full flex-col items-center justify-center gap-y-2.5 px-4 py-6 text-center text-sm sm:px-6"
      >
        <span>Не найдено ни одной колоды.</span>
        <UButton label="Создать колоду" icon="i-lucide-plus" size="sm" color="neutral" />
      </div>
      <!-- /Decks -->
    </div>
  </div>
</template>
