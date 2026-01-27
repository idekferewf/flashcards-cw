<script setup lang="ts">
import { TAG_COLOR_CLASSES } from "@/constants"
import type { IDeck } from "@/types"
import { format, isToday } from "date-fns"
import { ru } from "date-fns/locale"

defineProps<{
  deck: IDeck
  isSelected: boolean
}>()
</script>

<template>
  <div
    class="group text-default cursor-pointer border-l-2 p-4 text-sm transition-colors sm:px-6"
    :class="[
      isSelected
        ? 'border-primary bg-primary/[.04] dark:bg-primary/[.08]'
        : 'border-bg hover:border-primary hover:bg-primary/[.02] dark:hover:bg-primary/5'
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between font-semibold">
      <!-- Name -->
      <div class="flex items-center gap-2">
        {{ deck.name }}
        <UIcon v-if="deck.isArchived" name="i-lucide-archive" class="text-muted -mt-[1px] size-3.5" />
        <UIcon
          v-if="deck.isFavorite"
          name="i-lucide-star"
          class="-mt-[1px] size-3.5 text-amber-400 transition-transform"
          :class="[isSelected ? '-rotate-[45deg]' : 'group-hover:-rotate-[45deg]']"
        />
      </div>
      <!-- /Name -->

      <!-- Updated At -->
      <span class="text-muted font-normal">
        {{
          isToday(new Date(deck.updatedAt))
            ? format(new Date(deck.updatedAt), "HH:mm", { locale: ru })
            : format(new Date(deck.updatedAt), "dd MMM", { locale: ru })
        }}
      </span>
      <!-- /Updated At -->
    </div>
    <!-- /Header -->

    <!-- Description -->
    <p class="text-dimmed line-clamp-1">
      {{ deck.description }}
    </p>
    <!-- /Description -->

    <!-- Tags -->
    <div v-if="deck.tags" class="mt-2 flex flex-wrap gap-2">
      <code
        v-for="tag in deck.tags"
        :key="tag.id"
        class="inline-block rounded-md border px-1.5 py-0.5 font-mono text-xs font-medium"
        :class="[TAG_COLOR_CLASSES[tag.color]]"
      >
        <span class="mt-0.5 inline-block">{{ tag.label }}</span>
      </code>
    </div>
    <!-- /Tags -->
  </div>
</template>
