<script setup lang="ts">
import { useThemeSettings } from "@/composables/use-theme-settings.composable"
import { THEME_COLOR_MODE, THEME_FONT_DEFAULT, THEME_NEUTRAL_DEFAULT, THEME_RADIUS_DEFAULT } from "@/constants"
import { useColorMode } from "@vueuse/core"
import { computed } from "vue"

defineProps<{
  collapsed?: boolean
}>()

const neutralColors = [
  { label: "По умолчанию", value: THEME_NEUTRAL_DEFAULT },
  { label: "Сланцевый", value: "slate" },
  { label: "Серый", value: "gray" },
  { label: "Цинковый", value: "zinc" },
  { label: "Нейтральный", value: "old-neutral" },
  { label: "Каменный", value: "stone" },
  { label: "Тауп", value: "taupe" },
  { label: "Лиловый", value: "mauve" },
  { label: "Туман", value: "mist" },
  { label: "Оливковый", value: "olive" }
]

const radii = [
  { label: "0", value: "0" },
  { label: "0.125", value: "0.125rem" },
  { label: "0.25", value: THEME_RADIUS_DEFAULT },
  { label: "0.375", value: "0.375rem" },
  { label: "0.5", value: "0.5rem" }
]

const fonts = [
  { label: "Bitter", value: "Bitter, serif" },
  { label: "Lora", value: THEME_FONT_DEFAULT }
]

const themeSettings = useThemeSettings()
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === THEME_COLOR_MODE.dark
  },
  set(_isDark: boolean) {
    colorMode.value = _isDark ? THEME_COLOR_MODE.dark : THEME_COLOR_MODE.light
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
</script>

<template>
  <div v-if="!collapsed" class="flex w-full items-center justify-between gap-x-2">
    <span class="dark:text-dimmed inline-block flex-1 text-xs">Version v0.0.1</span>

    <!-- Appearance -->
    <UPopover arrow :content="{ align: 'start', sideOffset: 4 }">
      <UButton square icon="i-lucide-palette" variant="ghost" class="text-dimmed hover:text-primary" />

      <template #content>
        <div class="flex flex-col gap-y-4 p-4">
          <!-- Neutral -->
          <fieldset>
            <legend class="ms-2 mb-2.5 flex items-center gap-1 text-xs leading-none font-semibold select-none">
              <UIcon name="i-lucide-paint-bucket" />
              Фоновый цвет
            </legend>
            <div class="grid grid-cols-3 gap-1">
              <UButton
                v-for="item in neutralColors"
                :key="item.value"
                leading
                :label="item.label"
                variant="outline"
                :data-active="themeSettings.savedNeutral.value === item.value"
                class="ring-muted/75 data-[active=true]:bg-primary/10 w-full gap-1.5 px-2.5 py-2 text-[11px]"
                @click="themeSettings.setNeutral(item.value)"
              >
                <template #leading>
                  <UIcon v-if="item.value === THEME_NEUTRAL_DEFAULT" name="i-lucide-corner-up-left" class="size-3.5" />
                  <span
                    v-else
                    class="inline-block size-2 shrink-0 rounded-full bg-(--color-light) dark:bg-(--color-dark)"
                    :style="{
                      '--color-light': `var(--color-${item.value}-500)`,
                      '--color-dark': `var(--color-${item.value}-400)`
                    }"
                  />
                </template>
              </UButton>
            </div>
          </fieldset>
          <!-- /Neutral -->

          <!-- Radius -->
          <fieldset>
            <legend class="ms-2 mb-2.5 flex items-center gap-1 text-xs leading-none font-semibold select-none">
              <UIcon name="i-lucide-radius" />
              Радиус
            </legend>
            <div class="grid grid-cols-5 gap-1">
              <UButton
                v-for="item in radii"
                :key="item.value"
                :label="item.label"
                variant="outline"
                :data-active="themeSettings.savedRadius.value === item.value"
                class="ring-muted/75 data-[active=true]:bg-primary/10 w-full justify-center gap-1.5 px-2.5 py-2 text-xs"
                @click="themeSettings.setRadius(item.value)"
              />
            </div>
          </fieldset>
          <!-- /Radius -->

          <!-- Font -->
          <fieldset>
            <legend class="ms-2 mb-2.5 flex items-center gap-1 text-xs leading-none font-semibold select-none">
              <UIcon name="i-lucide-highlighter" />
              Шрифт
            </legend>
            <USelect
              v-model="themeSettings.savedFont.value"
              icon="i-lucide-type"
              arrow
              :items="fonts"
              class="w-full"
              @update:model-value="(item: string) => themeSettings.setFont(item)"
            />
          </fieldset>
          <!-- /Font -->
        </div>
      </template>
    </UPopover>
    <!-- /Appearance -->

    <!-- Switch -->
    <USwitch
      :model-value="isDark"
      size="xl"
      unchecked-icon="i-lucide-sun"
      checked-icon="i-lucide-moon"
      color="neutral"
      @click="startViewTransition"
    />
    <!-- /Switch -->
  </div>

  <UButton
    v-else
    :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
    variant="ghost"
    class="text-muted"
    @click="startViewTransition"
  />
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
