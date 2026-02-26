<script setup lang="ts">
import { useTagStore } from "@/store/tag.store.ts"
import type { IDeck, ITag } from "@/types"
import { format, isToday } from "date-fns"
import { ru } from "date-fns/locale"
import { computed } from "vue"

const props = defineProps<{
  deck: IDeck
  isSelected: boolean
}>()

const tagStore = useTagStore()

const tags = computed<ITag[]>(() => tagStore.getTagsByDeck(props.deck))
</script>

<template>
  <div
    class="group text-default cursor-pointer border-l-2 p-4 text-sm hover:transition-colors sm:px-6"
    :class="[isSelected ? 'border-primary bg-accented/40' : 'border-bg hover:border-primary hover:bg-accented/25']"
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
    <TagList v-if="tags.length" :tags="tags" class="mt-2" />
    <!-- /Tags -->
  </div>
</template>
