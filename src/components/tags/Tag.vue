<script setup lang="ts">
import { TAG_COLOR_CLASSES } from "@/constants"
import type { ITag } from "@/types"

defineProps<{
  tag: ITag
}>()
</script>

<template>
  <code class="inline-block rounded-md border px-1.5 py-0.5 font-mono font-medium" :class="[TAG_COLOR_CLASSES[tag.color]]">
    <span class="mt-0.5 inline-block">{{ tag.label }}</span>
  </code>
</template>
