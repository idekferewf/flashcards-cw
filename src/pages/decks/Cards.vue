<script setup lang="ts">
import { useCardStore } from "@/store/card.store.ts"
import { type CardStatus, CardStatusLabels, type ICard, type IDeck } from "@/types"
import type { TableColumn } from "@nuxt/ui"
import { useToast } from "@nuxt/ui/composables"
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

const props = defineProps<{
  deck: IDeck
}>()

const TagList = resolveComponent("TagList")
const UButton = resolveComponent("UButton")
const UBadge = resolveComponent("UBadge")
const UDropdownMenu = resolveComponent("UDropdownMenu")
const UCheckbox = resolveComponent("UCheckbox")

const { copy } = useClipboard()
const toast = useToast()
const store = useCardStore()

const table = useTemplateRef("table")

const sortingState = ref<SortingState>([{ id: "dueAt", desc: false }])
const columnVisibilityState = ref<VisibilityState>()
const rowSelectionState = ref<RowSelectionState>()
const paginationState = ref<PaginationState>({ pageIndex: 0, pageSize: 20 })

const cards = computed(() => {
  return store.getCardsByDeckId(props.deck.id)
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
      label: "Редактировать",
      icon: "i-lucide-file-pen"
    },
    {
      label: "Закрепить",
      icon: "i-lucide-pin"
    },
    {
      label: "Копировать ID",
      icon: "i-lucide-copy",
      onSelect() {
        copy(row.original.id)
        toast.add({
          title: "Скопировано в буфер обмена",
          description: "Идентификатор карточки скопирован в буфер обмена."
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
        toast.add({
          title: "Карточка удалена",
          description: "Все данные о карточке были удалены."
        })
      }
    }
  ]
}

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
      return h("div", { class: "flex items-center gap-3" }, [
        h("div", undefined, [
          h("p", { class: "font-medium text-highlighted" }, row.original.front),
          row.original.tags ? h(TagList, { class: "mt-2 text-[10px] max-w-[400px]", tags: row.original.tags }) : null
        ])
      ])
    }
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ row }) => {
      const color = {
        new: "info" as const,
        learning: "warning" as const,
        review: "neutral" as const,
        relearning: "warning" as const
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
        class: "-mx-2.5",
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
            content: {
              align: "end"
            },
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
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-1.5">
    <UInput
      v-model="front"
      class="w-full max-w-sm"
      icon="i-lucide-search"
      placeholder="Поиск по названию..."
      :ui="{ base: 'py-2' }"
    />

    <div class="flex flex-wrap items-center gap-1.5">
      <!-- Delete -->
      <!--      <DecksDeleteModal :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length">-->
      <!--        <UButton-->
      <!--          v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length != 0"-->
      <!--          label="Удалить"-->
      <!--          color="error"-->
      <!--          variant="subtle"-->
      <!--          icon="i-lucide-trash"-->
      <!--        >-->
      <!--          <template #trailing>-->
      <!--            <UKbd>-->
      <!--              {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}-->
      <!--            </UKbd>-->
      <!--          </template>-->
      <!--        </UButton>-->
      <!--      </DecksDeleteModal>-->
      <!-- /Delete -->

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
    </div>
  </div>

  <!-- Table -->
  <UTable
    ref="table"
    v-model:sorting="sortingState"
    v-model:column-visibility="columnVisibilityState"
    v-model:row-selection="rowSelectionState"
    v-model:pagination="paginationState"
    :pagination-options="{ getPaginationRowModel: cards.length ? getPaginationRowModel() : null }"
    :data="cards"
    :columns="columns"
    class="cards-scrollbar shrink-0"
    :ui="{
      base: 'table-fixed border-separate border-spacing-0',
      thead: '[&>tr]:bg-elevated dark:[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
      tbody:
        '[&>tr]:last:[&>td]:border-b-0 [&>tr]:hover:bg-elevated/80 [&>tr]:focus-visible:bg-elevated/80 dark:[&>tr]:hover:bg-elevated/25 dark:[&>tr]:focus-visible:bg-elevated/25',
      tr: 'cursor-pointer outline-none transition-colors duration-150 light:data-[selected=true]:bg-accented/35 light:data-[selected=true]:hover:bg-accented/35 dark:data-[selected=true]:hover:bg-elevated/50',
      th: 'py-4 first:rounded-tl-lg last:rounded-tr-lg border-y border-default first:border-l last:border-r',
      td: 'border-b border-default',
      separator: 'h-0'
    }"
  >
    <template #empty>
      <div class="flex w-full flex-col items-center justify-center gap-3.5">
        <span>Не найдено ни одной карточки.</span>
        <UButton icon="i-lucide-plus" label="Добавить карточку" size="sm" color="neutral" />
      </div>
    </template>
  </UTable>
  <!-- /Table -->

  <!-- Pagination -->
  <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
    <div class="text-muted text-sm">
      Выбрано {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} из
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} строк.
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
</template>
