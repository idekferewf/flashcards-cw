<script setup lang="ts">
import type { IDeck } from "@/types"
import { ref } from "vue"

defineProps<{
  decks: IDeck[]
  selectedId?: string | number
}>()

const emit = defineEmits<{
  select: [deck: IDeck]
}>()

const deckRefs = ref<Record<string, Element>>({})

defineExpose({
  getDeckEl(id: string) {
    return deckRefs.value[id]
  }
})
</script>

<template>
  <div class="divide-default divide-y">
    <div v-for="deck in decks" :key="deck.id" :ref="el => (deckRefs[deck.id] = el as Element)">
      <DeckListItem :deck="deck" :is-selected="selectedId === deck.id" @click="emit('select', deck)" />
    </div>
  </div>
</template>
