<script setup lang="ts">
import { type IDeck, type IRange, PERIODS, type TPeriod } from "@/types"
import { addDays } from "date-fns"
import { ref, shallowRef } from "vue"

defineProps<{
  deck: IDeck
}>()

const forecastShowOverdue = ref<boolean>(true)
const forecastPeriod = ref<TPeriod>(PERIODS.daily)
const forecastRange = shallowRef<IRange>({
  start: new Date(),
  end: addDays(new Date(), 30)
})
</script>

<template>
  <DeckTopMetrics :deck />
  <div class="w-full">
    <div class="flex items-center justify-end gap-1.5">
      <UCheckbox v-model="forecastShowOverdue" label="Отставание" class="flex-1" />
      <DateRangePicker v-model="forecastRange" />
      <PeriodSelect v-model="forecastPeriod" :range="forecastRange" />
    </div>
    <DeckForecastChart :deck :range="forecastRange" :period="forecastPeriod" :show-overdue="forecastShowOverdue" />
  </div>
  <DeckProbmlemCards class="mt-2.5" :deck />
</template>
