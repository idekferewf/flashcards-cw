<script setup lang="ts">
import { ROUTES } from "@/constants"
import type { IDeck } from "@/types"
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui"
import { computed } from "vue"

const props = defineProps<{
  deck: IDeck
}>()

const emits = defineEmits(["close"])

const dropdownItems: DropdownMenuItem[] = [
  {
    label: "Удалить",
    icon: "i-lucide-trash",
    color: "error",
    kbds: ["del"]
  }
]

const toolbarLinks = computed<NavigationMenuItem[]>(() => [
  {
    label: "Список карточек",
    icon: "i-lucide-book-a",
    to: ROUTES.DECKS.children.index.fullPath(props.deck?.id ?? "")
  },
  {
    label: "Статистика",
    icon: "i-lucide-chart-no-axes-combined",
    to: ROUTES.DECKS.children.statistics.fullPath(props.deck?.id ?? "")
  },
  {
    label: "Настройки",
    icon: "i-lucide-settings",
    to: ROUTES.DECKS.children.settings.fullPath(props.deck?.id ?? "")
  }
])

defineShortcuts({
  escape: () => emits("close")
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :toggle="false">
        <template #title>
          <h1>{{ deck.name }}</h1>
          <TagList v-if="deck.tags.length" :tags="deck.tags.slice(0, 4)" class="ml-1.5 gap-1.5 truncate text-[11px]" />
          <span v-if="deck.tags.length > 4" class="text-toned ml-0.5">...</span>
        </template>

        <template #leading>
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" class="-ms-1.5" @click="emits('close')" />
        </template>

        <template #right>
          <UButton icon="i-lucide-square-pen" color="neutral" variant="ghost">
            Редактировать
            <UKbd>ctrl + e</UKbd>
          </UButton>

          <UTooltip text="Архивировать">
            <UButton square icon="i-lucide-archive" color="neutral" :variant="deck.isArchived ? 'subtle' : 'ghost'" />
          </UTooltip>

          <UTooltip text="Добавить в избранное">
            <UButton icon="i-lucide-star" color="neutral" :variant="deck.isFavorite ? 'subtle' : 'ghost'" />
          </UTooltip>

          <UDropdownMenu :modal="false" arrow :content="{ align: 'end', sideOffset: 4 }" :items="dropdownItems">
            <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UNavigationMenu :items="toolbarLinks" highlight class="flex-1" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <RouterView v-slot="{ Component }">
        <component :is="Component" :deck="deck" />
      </RouterView>
    </template>
  </UDashboardPanel>
</template>
