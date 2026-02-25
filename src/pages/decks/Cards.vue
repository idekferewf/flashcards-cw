<script setup lang="ts">
import { useCardStore } from "@/store/card.store"
import { CardStatus, CardStatusLabels, type ICard, type IDeck } from "@/types"
import type { SelectMenuItem, TableColumn } from "@nuxt/ui"
import { useToast } from "@nuxt/ui/composables"
import {
  getPaginationRowModel,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type TableMeta,
  type VisibilityState
} from "@tanstack/table-core"
import { useClipboard } from "@vueuse/core"
import { formatRelative } from "date-fns"
import { ru } from "date-fns/locale"
import { computed, h, ref, resolveComponent, useTemplateRef } from "vue"

const props = defineProps<{
  deck: IDeck
}>()

const TagList = resolveComponent("TagList")
const UButton = resolveComponent("UButton")
const UBadge = resolveComponent("UBadge")
const UIcon = resolveComponent("UIcon")
const UDropdownMenu = resolveComponent("UDropdownMenu")
const UCheckbox = resolveComponent("UCheckbox")

const { copy } = useClipboard()
const toast = useToast()
const cardStore = useCardStore()

const table = useTemplateRef("table")

const deleteOpen = ref<boolean>(false)
const cardToDelete = ref<ICard | null>(null)

const sortingState = ref<SortingState>([
  { id: "isPinned", desc: true },
  { id: "dueAt", desc: false }
])
const columnVisibilityState = ref<VisibilityState>({ isPinned: false })
const rowSelectionState = ref<RowSelectionState>()
const paginationState = ref<PaginationState>({ pageIndex: 0, pageSize: 20 })

const cards = computed(() => {
  return cardStore.getCardsByDeckId(props.deck.id)
})

const selectedCards = computed((): ICard[] => {
  return table.value?.tableApi?.getFilteredSelectedRowModel().rows.map(r => r.original as ICard) ?? []
})

const selectedStatuses = computed<string[]>({
  get: (): string[] => {
    return table.value?.tableApi?.getColumn("status")?.getFilterValue() as string[] | []
  },
  set: (items: string[]) => {
    table.value?.tableApi?.getColumn("status")?.setFilterValue(items.length ? items : undefined)
  }
})

const front = computed({
  get: (): string => {
    return (table.value?.tableApi?.getColumn("front")?.getFilterValue() as string) || ""
  },
  set: (value: string) => {
    table.value?.tableApi?.getColumn("front")?.setFilterValue(value || undefined)
  }
})

const getRowItems = (row: Row<ICard>) => {
  const cardId = row.original.id,
    pinned = row.original.isPinned

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
      label: pinned ? "Открепить" : "Закрепить",
      icon: pinned ? "i-lucide-pin-off" : "i-lucide-pin",
      onSelect() {
        cardStore.togglePin(cardId)
      }
    },
    {
      label: "Редактировать",
      icon: "i-lucide-file-pen"
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
      color: "error",
      onSelect() {
        deleteOpen.value = true
        cardToDelete.value = row.original
      }
    }
  ]
}

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

const columnNames: Record<string, string> = {
  select: "Выбор",
  id: "ID",
  front: "Вопрос",
  status: "Статус",
  dueAt: "Дата создания",
  actions: "Действия"
} as const

const columns: TableColumn<ICard>[] = [
  {
    accessorKey: "isPinned",
    enableSorting: true,
    enableHiding: false,
    size: 0,
    header: "",
    cell: () => null
  },
  {
    id: "select",
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected() ? "indeterminate" : table.getIsAllPageRowsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Выбрать все"
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") => row.toggleSelected(!!value),
        ariaLabel: "Выбрать строку"
      })
  },
  {
    accessorKey: "front",
    header: "Название",
    cell: ({ row }) => {
      return h("div", { class: "flex flex-col" }, [
        h("p", { class: "font-medium text-highlighted" }, [
          row.original.front,
          row.original.isPinned ? h(UIcon, { name: "i-lucide-pin", class: "text-dimmed inline ml-1.5" }) : undefined
        ]),
        row.original.tags ? h(TagList, { class: "mt-2 text-[10px] max-w-[400px]", tags: row.original.tags }) : undefined
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
      }[row.original.status as CardStatus]

      return h(
        UBadge,
        { class: "capitalize", variant: "subtle", color },
        () => CardStatusLabels[row.original.status as CardStatus]
      )
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
      return formatRelative(new Date(row.original.dueAt as string), new Date(), { locale: ru })
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

const meta: TableMeta<ICard> = {
  class: {
    tr: (row: Row<ICard>) => {
      if (row.original.isPinned) {
        return "bg-elevated/20"
      }
      return ""
    }
  }
}
</script>

<template>
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
      <!-- Multi delete modal -->
      <CardsDeleteModal :cards="selectedCards">
        <UButton v-if="selectedCards.length" label="Удалить" size="lg" color="error" variant="subtle" icon="i-lucide-trash">
          <template #trailing>
            <UKbd>
              {{ selectedCards.length }}
            </UKbd>
          </template>
        </UButton>
      </CardsDeleteModal>
      <!-- /Multi delete modal -->

      <!-- Status -->
      <USelectMenu
        v-model="selectedStatuses"
        :items="statusOptions"
        value-key="value"
        multiple
        :search-input="false"
        size="lg"
        icon="i-lucide-flag"
        placeholder="Статус"
        class="w-40"
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
        <UButton label="Столбцы" size="lg" color="neutral" variant="outline" trailing-icon="i-lucide-settings-2" />
      </UDropdownMenu>
      <!-- /Column visibility -->
    </div>
  </div>

  <!-- Table -->
  <UTable
    ref="table"
    v-model:sorting="sortingState"
    v-model:column-visibility="columnVisibilityState"
    v-model:row-selection="rowSelectionState"
    v-model:pagination="paginationState"
    :pagination-options="{ getPaginationRowModel: cards.length ? getPaginationRowModel() : undefined }"
    :data="cards"
    :columns="columns"
    :meta="meta"
    class="cards-scrollbar shrink-0"
    :ui="{
      base: 'table-fixed border-separate border-spacing-0',
      thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
      tbody:
        'mt-10 [&>tr]:last:[&>td]:border-b-0 [&>tr:not(:has(td[data-slot=empty]))]:hover:bg-elevated/35 [&>tr:not(:has(td[data-slot=empty]))]:focus-visible:bg-elevated/35',
      tr: 'cursor-pointer outline-none transition-colors duration-150 data-[selected=true]:hover:bg-elevated/50',
      th: 'py-4 first:rounded-tl-lg last:rounded-tr-lg border-default border-b',
      td: 'border-b border-default',
      separator: 'h-0',
      empty: 'hover:bg-transparent'
    }"
  >
    <template #empty>
      <div class="flex w-full flex-col items-center justify-center gap-2.5">
        <span>Не найдено ни одной карточки.</span>
        <UButton icon="i-lucide-plus" label="Добавить карточку" size="sm" color="neutral" />
      </div>
    </template>
  </UTable>
  <!-- /Table -->

  <!-- Pagination -->
  <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
    <div class="text-muted text-sm">
      Выбрано {{ selectedCards.length }} из {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} строк.
    </div>

    <div class="flex items-center gap-1.5">
      <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </div>
  <!-- /Pagination -->

  <!-- Single delete modal -->
  <CardDeleteModal v-model:card="cardToDelete" />
  <!-- /Single delete modal -->
</template>
