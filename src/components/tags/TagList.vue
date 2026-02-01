<script setup lang="ts">
import type { ITag } from "@/types"

defineProps<{
  tags: ITag[]
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 text-xs">
    <Tag v-for="tag in tags" :key="tag.id" :tag="tag" />
  </div>
</template>
