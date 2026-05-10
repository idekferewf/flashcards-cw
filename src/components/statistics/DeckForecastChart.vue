<script setup lang="ts">
import { useCardStore } from "@/store/card.store"
import { type IDeck, type IRange, PERIODS, type TPeriod } from "@/types"
import { pluralize } from "@/utils"
import { VisArea, VisAxis, VisCrosshair, VisLine, VisTooltip, VisXYContainer } from "@unovis/vue"
import { useElementSize } from "@vueuse/core"
import { addDays, eachDayOfInterval, eachMonthOfInterval, eachWeekOfInterval, format, startOfDay } from "date-fns"
import { ru } from "date-fns/locale"
import { capitalize, computed, useTemplateRef } from "vue"

const props = defineProps<{
  deck: IDeck
  range: IRange
  period: TPeriod
  showOverdue: boolean
}>()

type DataRecord = {
  date: Date
  count: number
  overdue: number | undefined
}

const cardRef = useTemplateRef<HTMLElement | null>("cardRef")
const { width: cardWidth } = useElementSize(cardRef)

const overdueCards = computed(() => {
  const today = startOfDay(new Date())
  return cardStore.getCardsByDeckId(props.deck.id).filter(c => startOfDay(new Date(c.dueAt)) < today)
})

const cardStore = useCardStore()

const data = computed<DataRecord[]>(() => {
  const allCards = cardStore.getCardsByDeckId(props.deck.id)
  const interval = { start: startOfDay(props.range.start), end: startOfDay(props.range.end) }

  let dates
  switch (props.period) {
    case PERIODS.daily:
      dates = eachDayOfInterval(interval)
      break
    case PERIODS.weekly:
      dates = eachWeekOfInterval(interval, { locale: ru })
      break
    default:
      dates = eachMonthOfInterval(interval)
  }

  return dates.map((date, i) => {
    const periodStart = date
    const periodEnd = startOfDay(dates[i + 1] ?? addDays(props.range.end, 1))

    const count = allCards.filter(c => {
      const due = startOfDay(new Date(c.dueAt))
      return due >= periodStart && due < periodEnd
    }).length

    const overdue = !props.showOverdue ? undefined : i === 0 ? overdueCards.value.length : undefined
    return { date, count, overdue }
  })
})

const total = computed(() => data.value.reduce((acc, { count }) => acc + count, 0))
const totalLabel = computed(() => `${total.value} ${pluralize(total.value, "карточка", "карточки", "карточек")}`)

const formatDate = (date: Date) => {
  switch (props.period) {
    case PERIODS.daily:
      return format(date, "d MMM", { locale: ru })
    case PERIODS.weekly:
      return format(date, "d MMM", { locale: ru })
    default:
      return format(date, "MMM yyyy", { locale: ru })
  }
}

const formatDateTooltip = (date: Date) => {
  switch (props.period) {
    case PERIODS.daily:
      return format(date, "d MMMM", { locale: ru })
    case PERIODS.weekly:
      return format(date, "d MMMM", { locale: ru })
    default:
      return capitalize(format(date, "LLLL", { locale: ru }))
  }
}

const x = (_: DataRecord, i: number) => i
const y = (d: DataRecord) => d.count

const xTicks = (i: number) => {
  if (i === 0 || i === data.value.length - 1 || !data.value[i]) return ""
  return formatDate(data.value[i].date)
}
const yTicks = (v: number) => (Number.isInteger(v) ? String(v) : "")
const yOverdue = (d: DataRecord) => d.overdue

const template = (d: DataRecord) => {
  const base = `${formatDateTooltip(d.date)}: ${d.count} ${pluralize(d.count, "карточка", "карточки", "карточек")}`
  if (d.overdue) return `${base}<br> Отставание: ${d.overdue} ${pluralize(d.overdue, "карточка", "карточки", "карточек")}`
  return base
}
</script>

<template>
  <UCard ref="cardRef" class="mt-3" :ui="{ root: 'overflow-visible', body: '!px-0 !pl-2 !pt-0 !pb-3' }">
    <!-- Header -->
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-muted mb-1.5 text-xs uppercase">Предстоящие повторения</p>
          <p class="text-highlighted text-3xl font-semibold">{{ totalLabel }}</p>
        </div>
      </div>
    </template>
    <!-- /Header -->

    <VisXYContainer :data="data" :padding="{ top: 40 }" class="h-96" :width="cardWidth - 8">
      <VisLine :x="x" :y="y" color="var(--ui-primary)" />
      <VisArea :x="x" :y="y" color="var(--ui-primary)" :opacity="0.1" />
      <VisArea v-if="showOverdue && overdueCards.length > 0" :x="x" :y="yOverdue" color="var(--ui-error)" :opacity="0.1" />
      <VisAxis type="x" :x="x" :tick-format="xTicks" />
      <VisAxis type="y" :tick-format="yTicks" />
      <VisCrosshair color="var(--ui-primary)" :template="template" />
      <VisTooltip />
    </VisXYContainer>
  </UCard>
</template>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);
  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);
  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
