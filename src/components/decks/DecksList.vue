<script setup lang="ts">
import type { IDeck } from "@/types"
import { useElementBounding, useResizeObserver } from "@vueuse/core"
import { computed, ref, useTemplateRef, watch } from "vue"

const props = defineProps<{
  decks: IDeck[]
  archivedDecks: IDeck[]
}>()

const selectedDeck = defineModel<IDeck | null>()
const archiveOpen = defineModel<boolean>("archiveOpen", { default: false })

const archiveRef = useTemplateRef<HTMLInputElement>("archive")
const scrollRef = useTemplateRef<HTMLInputElement>("scroll")
const { height: archiveHeight } = useElementBounding(archiveRef)

const decksRefs = ref<Element[]>([])
const resetPullTimeout = ref<NodeJS.Timeout | null>(null)
const pullDistance = ref<number>(0)
const hasScroll = ref<boolean>(false)
const isLocked = ref<boolean>(false)

const hasArchivedDecks = computed<boolean>(() => props.archivedDecks.length != 0)

const archivedDeckNames = computed<string>(() => {
  return props.archivedDecks.map(deck => deck.name).join(", ")
})

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
  const ref = decksRefs.value[selectedDeck.value.id]
  if (ref) {
    ref.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }
})

defineShortcuts({
  arrowdown: () => {
    const index = props.decks.findIndex(deck => deck.id === selectedDeck.value?.id)
    if (index === -1) {
      selectedDeck.value = props.decks[0]
    } else if (index < props.decks.length - 1) {
      selectedDeck.value = props.decks[index + 1]
    }
  },
  arrowup: () => {
    const index = props.decks.findIndex(deck => deck.id === selectedDeck.value?.id)
    if (index === -1) {
      selectedDeck.value = props.decks[props.decks.length - 1]
    } else if (index > 0) {
      selectedDeck.value = props.decks[index - 1]
    }
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
    id="decksList"
    ref="scroll"
    class="relative h-full overflow-x-hidden overflow-y-auto overscroll-none"
    :class="{ 'overflow-y-hidden pr-1.5': archiveOpen && hasScroll }"
    @wheel="onWheel"
  >
    <!-- Archived Decks -->
    <div
      class="bg-default absolute top-0 left-0 z-50 flex h-full w-full flex-col transition-transform duration-150 focus:outline-none sm:shadow-lg"
      :class="[archiveOpen ? '-translate-x-0' : '-translate-x-full']"
    >
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

      <div class="divide-default divide-y">
        <div v-for="(deck, index) in archivedDecks" :key="index" :ref="el => (decksRefs[deck.id] = el as Element)">
          <DecksListItem :deck="deck" :is-selected="selectedDeck?.id === deck.id" @click="selectedDeck = deck" />
        </div>
      </div>
    </div>
    <!-- /Archived Decks -->

    <div class="transition-transform duration-300 ease-out" :style="{ transform: `translateY(${pullDistance}px)` }">
      <!-- Archive -->
      <div
        v-if="hasArchivedDecks"
        ref="archive"
        class="bg-elevated dark:bg-muted/50 hover:bg-accented/50 dark:hover:bg-muted absolute right-0 left-0 z-10 flex cursor-pointer items-center justify-between px-5 py-3 transition-colors duration-300"
        :style="{ top: `-${archiveHeight}px` }"
        @click="archiveOpen = true"
      >
        <div class="flex items-center gap-3.5">
          <div class="bg-primary flex size-12 min-w-12 items-center justify-center rounded-full">
            <UIcon name="i-lucide-archive" class="text-inverted size-5" />
          </div>
          <div class="flex flex-col gap-y-0.5 text-sm font-semibold">
            <span>Архив</span>
            <span class="text-muted line-clamp-1 break-all">{{ archivedDeckNames }}</span>
          </div>
        </div>
        <span class="text-muted ms-3 text-xs">Открыть</span>
      </div>
      <!-- /Archive -->

      <!-- Decks -->
      <div class="divide-default divide-y">
        <div v-for="(deck, index) in decks" :key="index" :ref="el => (decksRefs[deck.id] = el as Element)">
          <DecksListItem :deck="deck" :is-selected="selectedDeck?.id === deck.id" @click="selectedDeck = deck" />
        </div>
      </div>
      <!-- /Decks -->
    </div>
  </div>
</template>
