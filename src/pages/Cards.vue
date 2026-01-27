<script setup lang="ts">
import { decks as data } from "@/pages/repo.ts"
import type { IDeck } from "@/types"
import type { TableColumn } from "@nuxt/ui"
import { useToast } from "@nuxt/ui/composables"
import { getPaginationRowModel, type Row } from "@tanstack/table-core"
import { computed, h, ref, resolveComponent, useTemplateRef } from "vue"

const UButton = resolveComponent("UButton")
const UDropdownMenu = resolveComponent("UDropdownMenu")
const UCheckbox = resolveComponent("UCheckbox")

const toast = useToast()
const table = useTemplateRef("table")

const columnNames: Record<string, string> = {
  id: "ID",
  name: "Название",
  createdAt: "Дата создания",
  updatedAt: "Дата обновления",
  actions: "Действия",
  select: "Выбор"
} as const

const isFetching = ref<boolean>(false)

const columnVisibility = ref()
const rowSelection = ref()

const pagination = ref({
  pageIndex: 0,
  pageSize: 20
})

const name = computed({
  get: (): string => {
    return (table.value?.tableApi?.getColumn("name")?.getFilterValue() as string) || ""
  },
  set: (value: string) => {
    table.value?.tableApi?.getColumn("name")?.setFilterValue(value || undefined)
  }
})

const getRowItems = (row: Row<IDeck>) => {
  return [
    {
      type: "label",
      label: "Действия"
    },
    {
      label: "Копировать ID",
      icon: "i-lucide-copy",
      onSelect() {
        navigator.clipboard.writeText(row.original.id.toString())
        toast.add({
          title: "Скопировано в буфер обмена",
          description: "Идентификатор колоды скопирован в буфер обмена."
        })
      }
    },
    {
      type: "separator"
    },
    {
      label: "Удалить колоду",
      icon: "i-lucide-trash",
      color: "error",
      onSelect() {
        toast.add({
          title: "Колода удалена",
          description: "Все данные о колоде были удалены."
        })
      }
    }
  ]
}

const columns: TableColumn<IDeck>[] = [
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
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "name",
    header: "Название",
    cell: ({ row }) => {
      return h("div", { class: "flex items-center gap-3" }, [
        h("div", undefined, [
          h("p", { class: "font-medium text-highlighted" }, row.original.name),
          row.original.description?.length ? h("p", { class: "" }, `${row.original.description}`) : undefined
        ])
      ])
    }
  },
  {
    accessorKey: "createdAt",
    header: "Дата создания",
    cell: ({ row }) => row.original.createdAt
  },
  {
    accessorKey: "updatedAt",
    header: "Дата обновления",
    cell: ({ row }) => row.original.updatedAt
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
  <UDashboardPanel id="decks">
    <!-- Header -->
    <template #header>
      <UDashboardNavbar title="Колоды">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <DecksAddModal />
        </template>
      </UDashboardNavbar>
    </template>
    <!-- /Header -->

    <!-- Body -->
    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          v-model="name"
          class="w-full max-w-sm"
          icon="i-lucide-search"
          placeholder="Поиск по названию..."
          :ui="{
            base: 'py-2.5'
          }"
        />

        <div class="flex flex-wrap items-center gap-1.5">
          <!-- Delete -->
          <DecksDeleteModal :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length">
            <UButton
              v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length != 0"
              label="Удалить"
              color="error"
              variant="subtle"
              icon="i-lucide-trash"
            >
              <template #trailing>
                <UKbd>
                  {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
                </UKbd>
              </template>
            </UButton>
          </DecksDeleteModal>
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

      <UTable
        ref="table"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        v-model:pagination="pagination"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel()
        }"
        class="shrink-0"
        :data="data ?? []"
        :columns="columns"
        :loading="isFetching"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-4 first:rounded-tl-lg last:rounded-tr-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
          separator: 'h-0'
        }"
      />

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
    </template>
    <!-- /Body -->
  </UDashboardPanel>
</template>
