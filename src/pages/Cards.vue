<script setup lang="ts">
import { useCardStore } from "@/store/card.store"
import { useTagStore } from "@/store/tag.store"
import { CardStatus, CardStatusLabels, type ICard, type TCardStatus } from "@/types"
import { pluralize } from "@/utils"
import type { SelectMenuItem, TableColumn } from "@nuxt/ui"
import {
  getPaginationRowModel,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState
} from "@tanstack/table-core"
import { useClipboard } from "@vueuse/core"
import { formatRelative } from "date-fns"
import { ru } from "date-fns/locale"
import { computed, h, ref, resolveComponent, useTemplateRef } from "vue"

const TagList = resolveComponent("TagList")
const UButton = resolveComponent("UButton")
const UBadge = resolveComponent("UBadge")
const UDropdownMenu = resolveComponent("UDropdownMenu")

const { copy } = useClipboard()
const toast = useToast()
const cardStore = useCardStore()
const tagStore = useTagStore()

const table = useTemplateRef("table")

const sortingState = ref<SortingState>([
  { id: "isPinned", desc: true },
  { id: "dueAt", desc: false }
])
const columnVisibilityState = ref<VisibilityState>()
const rowSelectionState = ref<RowSelectionState>()
const paginationState = ref<PaginationState>({ pageIndex: 0, pageSize: 100 })

const front = computed({
  get: (): string => {
    return (table.value?.tableApi?.getColumn("front")?.getFilterValue() as string) || ""
  },
  set: (value: string) => {
    table.value?.tableApi?.getColumn("front")?.setFilterValue(value || undefined)
  }
})

const selectedStatuses = computed<string[]>({
  get: (): string[] => {
    return table.value?.tableApi?.getColumn("status")?.getFilterValue() as string[] | []
  },
  set: (items: string[]) => {
    table.value?.tableApi?.getColumn("status")?.setFilterValue(items.length ? items : undefined)
  }
})

const allRows = computed((): Row<ICard>[] => {
  return table.value?.tableApi?.getFilteredSelectedRowModel().rows ?? []
})

const getRowItems = (row: Row<ICard>) => {
  const cardId = row.original.id

  return [
    {
      type: "label",
      label: "Действия"
    },
    {
      label: "Просмотр",
      icon: "i-lucide-eye"
    },
    {
      label: "Копировать ID",
      icon: "i-lucide-copy",
      onSelect() {
        copy(cardId)
        toast.add({
          title: "ID карточки скопирован",
          description: "Идентификатор карточки скопирован в буфер обмена.",
          icon: "i-lucide-copy"
        })
      }
    },
    {
      type: "separator"
    },
    {
      label: "Удалить",
      icon: "i-lucide-trash",
      color: "error"
    }
  ]
}

const columnNames: Record<string, string> = {
  front: "Вопрос",
  status: "Статус",
  interval: "Текущий интервал",
  dueAt: "Дата повторения",
  actions: "Действия"
} as const

const columns: TableColumn<ICard>[] = [
  {
    accessorKey: "front",
    header: "Название",
    cell: ({ row }) => {
      const tags = tagStore.getTagsByDeckOrCard(row.original)
      return h("div", { class: "flex flex-col" }, [
        h("p", { class: "font-medium text-highlighted" }, [row.original.front]),
        tags.length ? h(TagList, { class: "mt-2 text-[11px] max-w-[400px]", tags }) : undefined
      ])
    }
  },
  {
    accessorKey: "status",
    header: "Статус",
    filterFn: (row: Row<ICard>, columnId: string, filterValue: string[]) => {
      if (!filterValue || filterValue.length === 0) return true
      const value = row.getValue<string>(columnId)
      return filterValue.includes(value)
    },
    cell: ({ row }) => {
      const color = {
        new: "info" as const,
        learning: "warning" as const,
        review: "neutral" as const,
        relearning: "error" as const
      }[row.original.status as TCardStatus]

      return h(
        UBadge,
        { class: "capitalize", variant: "subtle", color },
        () => CardStatusLabels[row.original.status as TCardStatus]
      )
    }
  },
  {
    accessorKey: "interval",
    header: "Текущий интервал",
    cell: ({ row }) => {
      return row.original.interval ?? "34"
    }
  },
  {
    accessorKey: "dueAt",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Дата повторения",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5 light:hover:bg-accented/75",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc")
      })
    },
    cell: ({ row }) => {
      return formatRelative(new Date(row.original.dueAt), new Date(), { locale: ru })
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            arrow: true,
            content: { align: "end" },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto"
            })
        )
      )
    }
  }
]

const statusOptions: SelectMenuItem[] = [
  {
    label: CardStatusLabels.new,
    value: CardStatus.new,
    chip: { color: "info" }
  },
  {
    label: CardStatusLabels.learning,
    value: CardStatus.learning,
    chip: { color: "warning" }
  },
  {
    label: CardStatusLabels.review,
    value: CardStatus.review,
    chip: { color: "neutral" }
  },
  {
    label: CardStatusLabels.relearning,
    value: CardStatus.relearning,
    chip: { color: "error" }
  }
]
</script>

<template>
  <UDashboardPanel id="cards">
    <!-- Header -->
    <template #header>
      <UDashboardNavbar title="Карточки">
        <!-- Count -->
        <template #trailing>
          <UBadge v-if="!cardStore.isLoading" :label="cardStore.cards.length" variant="subtle" color="neutral" />
        </template>
        <!-- /Count -->

        <template #right>
          <UButton color="neutral" size="lg" variant="ghost" class="gap-1.5">
            <UIcon name="i-lucide-book-plus" class="size-[18px]" />
            Создать карточку
            <UKbd size="sm" class="ml-0.5 translate-y-px">alt + n</UKbd>
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>
    <!-- /Header -->

    <!-- Body -->
    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <!-- Search -->
        <UInput
          v-model="front"
          class="w-full max-w-sm"
          icon="i-lucide-search"
          placeholder="Поиск по названию..."
          :ui="{ base: 'py-2' }"
        />
        <!-- /Search -->

        <div class="flex flex-wrap items-center gap-1.5">
          <!-- Status -->
          <USelectMenu
            v-model="selectedStatuses"
            :items="statusOptions"
            value-key="value"
            multiple
            :search-input="false"
            size="lg"
            icon="i-lucide-flag"
            placeholder="Выберите статус"
            class="w-48"
          />
          <!-- /Status -->

          <!-- Column visibility -->
          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column: any) => column.getCanHide())
                .map((column: any) => ({
                  label: columnNames[column.id],
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  }
                }))
            "
            :content="{ align: 'end' }"
          >
            <UButton label="Столбцы" size="lg" color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down" />
          </UDropdownMenu>
          <!-- /Column visibility -->
        </div>
      </div>

      <UTable
        ref="table"
        v-model:sorting="sortingState"
        v-model:column-visibility="columnVisibilityState"
        v-model:row-selection="rowSelectionState"
        v-model:pagination="paginationState"
        :pagination-options="{ getPaginationRowModel: cardStore.cards.length ? getPaginationRowModel() : undefined }"
        class="shrink-0"
        :data="cardStore.cards"
        :columns="columns"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody:
            'mt-10 [&>tr]:last:[&>td]:border-b-0 [&>tr:not(:has(td[data-slot=empty]))]:hover:bg-elevated/35 [&>tr:not(:has(td[data-slot=empty]))]:focus-visible:bg-elevated/35',
          tr: 'cursor-pointer outline-none transition-colors duration-150 data-[selected=true]:hover:bg-elevated/50',
          th: 'py-2.5 first:rounded-l-lg last:rounded-r-lg font-medium border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
          separator: 'h-0',
          empty: 'hover:bg-transparent'
        }"
      >
        <template #empty>
          <div class="mt-14 flex h-full flex-col items-center justify-center">
            <UIcon name="i-lucide-book-minus" class="size-32" />
            <span class="text-default mt-4">Карточки не найдены</span>
            <span class="text-muted mt-2 line-clamp-2 max-w-[400px]">
              По запросу <u>{{ front }}</u> ничего не найдено
            </span>
          </div>
        </template>
      </UTable>

      <!-- Pagination -->
      <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
        <div class="text-muted text-sm">
          Всего {{ allRows.length }} {{ pluralize(allRows.length, "карточка", "карточки", "карточек") }}.
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="allRows.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>
      <!-- /Pagination -->
    </template>
    <!-- /Body -->
  </UDashboardPanel>
</template>
