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
    class="text-highlighted font-logo inline-flex items-center gap-2.5 text-lg font-semibold"
  >
    <img src="/favicon-light.png" type="image/png" alt="flashcards" class="light:hidden w-7" />
    <img src="/favicon-dark.png" type="image/png" alt="flashcards" class="w-7 dark:hidden" />
    <span>Learnly</span>
  </RouterLink>
</template>
