<script setup lang="ts">
import Logo from "@/components/Logo.vue"
import { ROUTES } from "@/constants"
import type { CommandPaletteGroup, NavigationMenuItem, ToasterProps } from "@nuxt/ui"
import { useColorMode } from "@vueuse/core"
import { computed, ref, watch } from "vue"

const toaster: ToasterProps = { position: "bottom-center" }

const menuItemUI: NavigationMenuItem["ui"] = {
  link: "py-2.5",
  linkLabel: "ml-1.5 -mb-0.5"
}

const colorMode = useColorMode()

const isCollapsed = ref<boolean>(false)

const changeTheme = (theme: "dark" | "light") => {
  colorMode.value = theme
}

watch(isCollapsed, (newValue: boolean) => {
  menuItemUI.link = newValue ? "py-2" : "py-2.5"
})

const items: NavigationMenuItem[][] = [
  [
    {
      label: "Главная",
      icon: "i-lucide-home",
      to: ROUTES.INDEX.path,
      ui: menuItemUI,
      disabled: true
    },
    {
      label: "Колоды",
      icon: "i-lucide-package-2",
      to: ROUTES.DECKS.path,
      ui: menuItemUI
    },
    {
      label: "Карточки",
      icon: "i-lucide-book",
      ui: menuItemUI
    },
    {
      label: "Статистика",
      icon: "i-lucide-area-chart",
      ui: menuItemUI,
      disabled: true
    }
  ],
  [
    {
      label: "Документация",
      icon: "i-lucide-newspaper",
      to: "/docs",
      target: "_blank",
      ui: menuItemUI,
      disabled: true
    }
  ]
]

const groups = computed<CommandPaletteGroup[]>(() => [
  {
    id: "theme",
    label: "Тема",
    items: [
      {
        label: "Светлая",
        icon: "i-lucide-sun",
        disabled: colorMode.value === "light",
        onSelect: () => changeTheme("light")
      },
      {
        label: "Тёмная",
        icon: "i-lucide-moon",
        disabled: colorMode.value === "dark",
        onSelect: () => changeTheme("dark")
      }
    ]
  }
])
</script>

<template>
  <UApp :toaster="toaster">
    <UDashboardGroup unit="rem">
      <!-- Global sidebar -->
      <UDashboardSidebar
        v-model:collapsed="isCollapsed"
        :min-size="12"
        :max-size="20"
        resizable
        collapsible
        :ui="{ footer: 'py-4 lg:border-t lg:border-default' }"
      >
        <!-- Header -->
        <template #header="{ collapsed }">
          <div class="flex w-full items-center justify-between" :class="{ 'pl-1': !collapsed }">
            <Logo :collapsed="collapsed" />
            <UDashboardSidebarCollapse class="text-muted" icon="i-lucide-panel-left" />
          </div>
        </template>
        <!-- /Header -->

        <!-- Body -->
        <template #default="{ collapsed }">
          <UDashboardSearchButton
            :collapsed="collapsed"
            label="Искать..."
            variant="subtle"
            :class="['text-muted mt-2.5 rounded-xl', collapsed ? '' : 'py-2']"
          />
          <UNavigationMenu :collapsed="collapsed" :items="items[0]" orientation="vertical" tooltip popover />
          <UNavigationMenu :collapsed="collapsed" :items="items[1]" orientation="vertical" tooltip class="mt-auto" />
        </template>
        <!-- /Body -->

        <!-- Footer -->
        <template #footer="{ collapsed }">
          <ColorModeSidebarButton :collapsed />
        </template>
        <!-- /Footer -->

        <template #resize-handle="{ onMouseDown, onTouchStart, onDoubleClick }">
          <UDashboardResizeHandle
            class="after:absolute after:inset-y-0 after:right-0 after:w-px after:transition hover:after:bg-(--ui-border-accented)"
            @mousedown="onMouseDown"
            @touchstart="onTouchStart"
            @dblclick="onDoubleClick"
          />
        </template>
      </UDashboardSidebar>
      <!-- /Global sidebar -->

      <!-- Search modal -->
      <UDashboardSearch
        :color-mode="false"
        :groups="groups"
        placeholder="Что вы ищите?"
        :ui="{
          input: '[&>input]:placeholder:text-[15px]',
          root: 'h-full divide-none px-1 py-0.5',
          content: 'flex-1',
          empty: 'h-full'
        }"
      >
        <template #empty="{ searchTerm }">
          <div class="flex h-full flex-col items-center justify-center">
            <UIcon name="i-lucide-lightbulb-off" class="size-32" />
            <span class="text-default mt-4">Ничего не найдено</span>
            <span class="text-muted mt-2 line-clamp-2 max-w-[300px]">
              По запросу <u>{{ searchTerm }}</u> ничего не найдено
            </span>
          </div>
        </template>
        <template #footer>
          <div class="flex items-center justify-center gap-2.5 py-2.5">
            <div class="text-muted flex cursor-default items-center gap-x-1 text-xs">
              <UIcon name="i-lucide-corner-down-left" class="text-dimmed size-3.5" />
              Выбрать
            </div>
            <USeparator orientation="vertical" class="h-4" />
            <div class="text-muted flex cursor-default items-center gap-x-1 text-xs">
              <UIcon name="i-lucide-arrow-up-down" class="text-dimmed size-3.5" />
              Навигация
            </div>
            <USeparator orientation="vertical" class="h-4" />
            <div class="text-muted flex cursor-default items-center gap-x-1 text-xs">
              <code class="text-dimmed font-medium">ESC</code>
              Закрыть
            </div>
          </div>
        </template>
      </UDashboardSearch>
      <!-- /Search modal -->

      <!-- Router view -->
      <RouterView />
      <!-- /Router view -->
    </UDashboardGroup>
  </UApp>
</template>
