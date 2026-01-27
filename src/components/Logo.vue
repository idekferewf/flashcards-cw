<script setup lang="ts">
import { ROUTES } from "@/constants"

defineProps<{
  collapsed: boolean | undefined
}>()
</script>

<template>
  <RouterLink
    v-if="!collapsed"
    :to="{ name: ROUTES.INDEX.name }"
    class="text-highlighted font-logo inline-flex items-center gap-2.5 text-lg font-semibold lowercase"
  >
    <img src="/favicon-light.png" type="image/png" alt="flashcards" class="light:hidden w-8" />
    <img src="/favicon-dark.png" type="image/png" alt="flashcards" class="w-8 dark:hidden" />
    <span>Flashcards</span>
  </RouterLink>
</template>
