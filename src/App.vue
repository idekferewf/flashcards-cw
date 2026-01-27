<script setup lang="ts">
import Logo from "@/components/Logo.vue"
import { ROUTES } from "@/constants"
import type { NavigationMenuItem, ToasterProps } from "@nuxt/ui"
import { useColorMode } from "@vueuse/core"
import { computed, ref, watch } from "vue"

const colorMode = useColorMode()

const toaster: ToasterProps = { position: "bottom-center" }

const isCollapsed = ref<boolean>(false)

const menuItemUI: NavigationMenuItem["ui"] = {
  link: "py-2.5",
  linkLabel: "ml-1.5 -mb-0.5"
}

const isDark = computed({
  get() {
    return colorMode.value === "dark"
  },
  set(_isDark: boolean) {
    colorMode.value = _isDark ? "dark" : "light"
  }
})

const switchTheme = () => {
  isDark.value = !isDark.value
}

const startViewTransition = (event: MouseEvent) => {
  if (!document.startViewTransition) {
    switchTheme()
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

  const transition = document.startViewTransition(() => {
    switchTheme()
  })

  transition.ready.then(() => {
    const duration = 400
    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
      },
      {
        duration: duration,
        easing: "cubic-bezier(.76,.32,.29,.99)",
        pseudoElement: "::view-transition-new(root)"
      }
    )
  })
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
      ui: menuItemUI
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
      ui: menuItemUI
    }
  ]
]
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
        class="bg-elevfated/25"
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
            class="text-muted mt-2.5 rounded-xl py-2.5"
          />
          <UNavigationMenu :collapsed="collapsed" :items="items[0]" orientation="vertical" tooltip popover />
          <UNavigationMenu :collapsed="collapsed" :items="items[1]" orientation="vertical" tooltip class="mt-auto" />
        </template>
        <!-- /Body -->

        <!-- Footer -->
        <template #footer="{ collapsed }">
          <div v-if="!collapsed" class="flex w-full items-center justify-between">
            <span class="text-dimmed inline-block text-xs">Version v0.0.1</span>
            <USwitch
              :model-value="isDark"
              size="xl"
              unchecked-icon="i-lucide-sun"
              checked-icon="i-lucide-moon"
              color="neutral"
              @click="startViewTransition"
            />
          </div>

          <UButton
            v-else
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            variant="ghost"
            class="text-muted"
            @click="startViewTransition"
          />
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
      <UDashboardSearch placeholder="Выполните поиск..." />
      <!-- /Search modal -->

      <!-- Router view -->
      <RouterView />
      <!-- /Router view -->
    </UDashboardGroup>
  </UApp>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-new(root) {
  z-index: 9999;
}

::view-transition-old(root) {
  z-index: 1;
}
</style>
