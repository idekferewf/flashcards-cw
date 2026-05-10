<script setup lang="ts">
import type { IRange } from "@/types"
import { CalendarDate, DateFormatter, getLocalTimeZone, today, type DateValue } from "@internationalized/date"
import { startOfDay } from "date-fns"
import { computed } from "vue"

const selectedRange = defineModel<IRange>({ required: true })

const ranges = [
  { label: "7 дней", days: 7 },
  { label: "14 дней", days: 14 },
  { label: "30 дней", days: 30 },
  { label: "3 месяца", months: 3 },
  { label: "6 месяцев", months: 6 },
  { label: "1 год", years: 1 }
]

const df = new DateFormatter("ru-RU", {
  dateStyle: "medium"
})

const calendarRange = computed({
  get: () => ({
    start: toCalendarDate(selectedRange.value.start),
    end: toCalendarDate(selectedRange.value.end)
  }),
  set: (newValue: { start: CalendarDate | undefined; end: CalendarDate | undefined }) => {
    selectedRange.value = {
      start: newValue.start ? startOfDay(newValue.start.toDate(getLocalTimeZone())) : new Date(),
      end: newValue.end ? startOfDay(newValue.end.toDate(getLocalTimeZone())) : new Date()
    }
  }
})

const toCalendarDate = (date: Date) => {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

const isRangeSelected = (range: { days?: number; months?: number; years?: number }) => {
  if (!selectedRange.value.start || !selectedRange.value.end) return false

  const currentDate = today(getLocalTimeZone())
  let endDate = currentDate.copy()

  if (range.days) {
    endDate = endDate.add({ days: range.days })
  } else if (range.months) {
    endDate = endDate.add({ months: range.months })
  } else if (range.years) {
    endDate = endDate.add({ years: range.years })
  }

  const selectedStart = toCalendarDate(selectedRange.value.start)
  const selectedEnd = toCalendarDate(selectedRange.value.end)

  return selectedStart.compare(currentDate) === 0 && selectedEnd.compare(endDate) === 0
}

const selectRange = (range: { days?: number; months?: number; years?: number }) => {
  const startDate = today(getLocalTimeZone())
  let endDate = startDate.copy()

  if (range.days) {
    endDate = endDate.add({ days: range.days })
  } else if (range.months) {
    endDate = endDate.add({ months: range.months })
  } else if (range.years) {
    endDate = endDate.add({ years: range.years })
  }

  selectedRange.value = {
    start: startOfDay(startDate.toDate(getLocalTimeZone())),
    end: startOfDay(endDate.toDate(getLocalTimeZone()))
  }
}

const isDateUnavailable = (date: DateValue) => {
  return date.compare(today(getLocalTimeZone())) < 0
}
</script>

<template>
  <UPopover :content="{ align: 'end' }" :modal="true">
    <!-- Trigger -->
    <UButton color="neutral" variant="ghost" icon="i-lucide-calendar" class="data-[state=open]:bg-elevated group">
      <span class="truncate">{{ df.format(selectedRange.start) }} - {{ df.format(selectedRange.end) }}</span>
      <template #trailing>
        <UIcon
          name="i-lucide-chevron-down"
          class="text-dimmed size-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </template>
    </UButton>
    <!-- /Trigger -->

    <template #content>
      <div class="divide-default flex items-stretch sm:divide-x">
        <!-- Ranges -->
        <div class="hidden flex-col justify-center sm:flex">
          <UButton
            v-for="(range, index) in ranges"
            :key="index"
            :label="range.label"
            color="neutral"
            variant="ghost"
            class="rounded-none px-4"
            :class="[isRangeSelected(range) ? 'bg-elevated' : 'hover:bg-elevated/50']"
            truncate
            @click="selectRange(range)"
          />
        </div>
        <!-- /Ranges -->

        <UCalendar
          v-model="calendarRange"
          locale="ru"
          class="p-2"
          :number-of-months="2"
          range
          :is-date-unavailable="isDateUnavailable"
          :ui="{ heading: 'capitalize' }"
        />
      </div>
    </template>
  </UPopover>
</template>
