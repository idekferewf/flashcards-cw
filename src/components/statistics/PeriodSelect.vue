<script setup lang="ts">
import { type IRange, PERIODS, type TPeriod } from "@/types"
import { eachDayOfInterval } from "date-fns"
import { computed, watch } from "vue"

const selectedPeriod = defineModel<TPeriod>({ required: true })

const props = defineProps<{
  range: IRange
}>()

const PERIOD_LABELS = {
  daily: "День",
  weekly: "Неделя",
  monthly: "Месяц"
} as const

const days = computed(() => eachDayOfInterval(props.range))

const periods = computed(() => {
  const daysCount = days.value.length

  let availablePeriods: TPeriod[]

  if (daysCount <= 8) {
    availablePeriods = [PERIODS.daily]
  } else if (daysCount <= 31) {
    availablePeriods = [PERIODS.daily, PERIODS.weekly]
  } else {
    availablePeriods = [PERIODS.weekly, PERIODS.monthly]
  }

  return availablePeriods.map(value => ({
    value,
    label: PERIOD_LABELS[value]
  }))
})

watch(periods, newPeriods => {
  const isCurrentAvailable = newPeriods.some(p => p.value === selectedPeriod.value)
  if (!isCurrentAvailable && newPeriods[0]) {
    selectedPeriod.value = newPeriods[0].value
  }
})
</script>

<template>
  <USelect
    v-model="selectedPeriod"
    :items="periods"
    variant="ghost"
    class="data-[state=open]:bg-elevated"
    :ui="{
      value: 'capitalize',
      itemLabel: 'capitalize',
      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
    }"
  />
</template>
