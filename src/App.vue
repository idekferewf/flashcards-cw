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
      ui: menuItemUI
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
    },
    {
      label: "Настройки",
      icon: "i-lucide-settings",
      ui: menuItemUI,
      children: [
        {
          label: "Основные",
          ui: menuItemUI
        }
      ]
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
        placeholder="Выполните поиск..."
        :ui="{ input: '[&>input]:placeholder:text-[15px]' }"
      >
        <template #empty>Ничего не найдено</template>
        <template #footer>
          <div class="flex items-center justify-end gap-1">
            <UButton color="neutral" variant="ghost" label="Выполнить команду" class="text-dimmed" size="xs">
              <template #trailing>
                <UKbd value="enter" />
              </template>
            </UButton>
            <USeparator orientation="vertical" class="h-4" />
            <UButton color="neutral" variant="ghost" label="Действия" class="text-dimmed" size="xs">
              <template #trailing>
                <UKbd value="meta" />
                <UKbd value="k" />
              </template>
            </UButton>
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
