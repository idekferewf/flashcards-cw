<script setup lang="ts">
import { ROUTES, TAG_COLOR_CLASSES } from "@/constants"
import type { IDeck } from "@/types"
import type { NavigationMenuItem } from "@nuxt/ui"

defineProps<{
  deck: IDeck
}>()

const emits = defineEmits(["close"])

const links: NavigationMenuItem[] = [
  {
    label: "Список карточек",
    icon: "i-lucide-book-a",
    to: ROUTES.DECKS.path,
    exact: true
  },
  {
    label: "Настройки",
    icon: "i-lucide-settings",
    to: "/settings"
  }
]
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :toggle="false">
        <template #title>
          <h1>{{ deck.name }}</h1>
<!--          <div v-if="deck.tags" class="ml-2 flex items-center gap-x-1.5">-->
<!--            <code-->
<!--              v-for="tag in deck.tags.slice(0, 3)"-->
<!--              :key="tag.id"-->
<!--              class="inline-block rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-medium"-->
<!--              :class="[TAG_COLOR_CLASSES[tag.color]]"-->
<!--            >-->
<!--              <span class="mt-0.5 inline-block">{{ tag.label }}</span>-->
<!--            </code>-->
<!--          </div>-->
<!--          <span v-if="deck.tags.length > 3" class="text-toned ml-0.5">...</span>-->
        </template>

        <template #leading>
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" class="-ms-1.5" @click="emits('close')" />
        </template>

        <template #right>
          <!--          <UButton label="Редактировать" icon="i-lucide-square-pen" color="neutral" :variant="deck.isArchived ? 'subtle' : 'ghost'" />-->
          <!--        <UTooltip text="Архивировать">-->
          <UButton label="Архивировать" icon="i-lucide-archive" color="neutral" :variant="deck.isArchived ? 'subtle' : 'ghost'" />
          <!--        </UTooltip>-->

          <UTooltip text="Добавить в избранное">
            <UButton icon="i-lucide-star" color="neutral" :variant="deck.isFavorite ? 'subtle' : 'ghost'" />
          </UTooltip>

          <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UNavigationMenu :items="links" highlight class="flex-1" />
      </UDashboardToolbar>
    </template>
  </UDashboardPanel>
</template>
