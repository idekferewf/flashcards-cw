<script setup lang="ts">
import { useColorMode } from "@vueuse/core"
import { computed } from "vue"

defineProps<{
  collapsed?: boolean
}>()

const colorMode = useColorMode()

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
</script>

<template>
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
