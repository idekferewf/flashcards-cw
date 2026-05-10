<script setup lang="ts">
import { useCardStore } from "@/store/card.store"
import { CardStatus, type IDeck } from "@/types"
import { computed } from "vue"

const props = defineProps<{
  deck: IDeck
}>()

const cardStore = useCardStore()

const allCards = computed(() => cardStore.getCardsByDeckId(props.deck.id))
const dueCards = computed(() => cardStore.getDueCardsByDeckId(props.deck.id))
const reviewCards = computed(() => allCards.value.filter(c => c.status === CardStatus.review))
const newCards = computed(() => dueCards.value.filter(c => c.status === CardStatus.new))

const reviewPercent = computed(() => {
  if (!allCards.value.length) return 0
  return Math.round((reviewCards.value.length / allCards.value.length) * 100)
})

const newPercent = computed(() => {
  if (!allCards.value.length) return 0
  return Math.round((newCards.value.length / dueCards.value.length) * 100)
})

const avgInterval = computed(() => {
  if (!reviewCards.value.length) return null
  return Math.round(reviewCards.value.reduce((sum, c) => sum + c.interval, 0) / reviewCards.value.length)
})

const maturePercent = computed(() => {
  if (!reviewCards.value.length) return 0
  const mature = reviewCards.value.filter(c => c.interval > 21)
  return Math.round((mature.length / reviewCards.value.length) * 100)
})
</script>

<template>
  <UPageGrid class="gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-px">
    <!-- Total cards -->
    <UPageCard
      icon="i-lucide-layers"
      title="Всего карточек"
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25',
        title: 'font-normal text-muted text-xs uppercase'
      }"
      class="hover:bg-elevated hover:ring-accented transition first:rounded-l-lg last:rounded-r-lg hover:z-1 lg:rounded-none"
    >
      <div class="flex items-center gap-2">
        <span class="text-highlighted text-2xl font-semibold">{{ allCards.length }}</span>
        <UTooltip text="Доля карточек, перешедших в режим повторения" :content="{ side: 'top' }">
          <UBadge color="neutral" variant="subtle" class="cursor-help text-xs"> {{ reviewPercent }}% </UBadge>
        </UTooltip>
      </div>
    </UPageCard>
    <!-- /Total cards -->

    <!-- To repeat today -->
    <UPageCard
      icon="i-lucide-clock"
      title="К повторению"
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25',
        title: 'font-normal text-muted text-xs uppercase'
      }"
      class="hover:bg-elevated hover:ring-accented transition first:rounded-l-lg last:rounded-r-lg hover:z-1 lg:rounded-none"
    >
      <div class="flex items-center gap-2">
        <span class="text-highlighted text-2xl font-semibold">{{ dueCards.length }}</span>
        <UTooltip text="Доля новых карточек" :content="{ side: 'top' }">
          <UBadge color="info" variant="subtle" class="cursor-help text-xs">{{ newPercent }}%</UBadge>
        </UTooltip>
      </div>
    </UPageCard>
    <!-- /To repeat today -->

    <!-- Average interval -->
    <UPageCard
      icon="i-lucide-trending-up"
      title="Средний интервал"
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25',
        title: 'font-normal text-muted text-xs uppercase'
      }"
      class="hover:bg-elevated hover:ring-accented transition first:rounded-l-lg last:rounded-r-lg hover:z-1 lg:rounded-none"
    >
      <div class="flex items-center gap-2">
        <span class="text-highlighted text-2xl font-semibold">
          {{ avgInterval !== null ? `${avgInterval} дн.` : "—" }}
        </span>
        <UTooltip v-if="avgInterval !== null" text="Доля карточек с интервалом больше 3 недель" :content="{ side: 'top' }">
          <UBadge color="warning" variant="subtle" class="cursor-help text-xs">{{ maturePercent }}%</UBadge>
        </UTooltip>
      </div>
    </UPageCard>
    <!-- /Average interval -->
  </UPageGrid>
</template>
