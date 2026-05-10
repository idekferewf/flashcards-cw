<script setup lang="ts">
import { useCardStore } from "@/store/card.store"
import type { ICard } from "@/types"
import { CardStatus, CardStatusLabels, type IDeck } from "@/types"
import type { TableColumn } from "@nuxt/ui"
import { computed, h, resolveComponent } from "vue"

const props = defineProps<{
  deck: IDeck
}>()

const UBadge = resolveComponent("UBadge")
const UKbd = resolveComponent("UKbd")

const cardStore = useCardStore()

const data = computed(() =>
  cardStore
    .getCardsByDeckId(props.deck.id)
    .filter(c => c.lapses > 0)
    .sort((a, b) => b.lapses - a.lapses)
    .slice(0, 10)
)

const statusColor = {
  [CardStatus.new]: "info",
  [CardStatus.learning]: "warning",
  [CardStatus.review]: "neutral",
  [CardStatus.relearning]: "error"
} as const

const columns: TableColumn<ICard>[] = [
  {
    accessorKey: "front",
    header: "Карточка",
    cell: ({ row }) => h("span", { class: "line-clamp-1" }, row.getValue("front"))
  },
  {
    accessorKey: "lapses",
    header: "Ошибок",
    cell: ({ row }) => h(UKbd, { color: "error", variant: "soft" }, row.getValue("lapses"))
  },
  {
    accessorKey: "easeFactor",
    header: "Лёгкость",
    cell: ({ row }) => {
      const ease = (row.getValue("easeFactor") as number) / 100
      return h("span", `${ease.toFixed(2)}x`)
    }
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof CardStatus
      return h(UBadge, { variant: "soft", color: statusColor[status] }, () => CardStatusLabels[status])
    }
  }
]
</script>

<template>
  <UTable
    :data="data"
    :columns="columns"
    class="shrink-0"
    :ui="{
      base: 'table-fixed border-separate border-spacing-0',
      thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
      tbody: '[&>tr]:last:[&>td]:border-b-0',
      th: 'first:rounded-l-lg last:rounded-r-lg border-y py-2.5 border-default first:border-l last:border-r',
      td: 'border-b border-default',
      separator: 'hidden'
    }"
    empty="Проблемные карточки отсутствуют"
  />
</template>
