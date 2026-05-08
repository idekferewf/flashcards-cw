<script setup lang="ts">
import { useCardStore } from "@/store/card.store.ts"
import { useDeckStore } from "@/store/deck.store"
import type { ICard, IDeck } from "@/types"
import { computed, h, nextTick, ref, watch } from "vue"

const deck = defineModel<IDeck | null>("deck")

const toast = useToast()
const deckStore = useDeckStore()
const cardStore = useCardStore()

const deckName = ref<string>()
const deckCards = ref<ICard[]>([])

const open = computed({
  get: () => deck.value !== null,
  set: (value: boolean) => {
    if (!value) {
      deck.value = null
    }
  }
})

const onSubmit = () => {
  if (!deck.value) return

  deckStore.removeDeck(deck.value.id)
  cardStore.removeCards(deckCards.value.map((card: ICard) => card.id))
  deck.value = null

  toast.add({
    title: "Колода удалена",
    description: h("span", undefined, [
      "Колода ",
      h("span", { class: "underline" }, [deckName.value]),
      " и её карточки были удалены."
    ]),
    icon: "i-lucide-trash"
  })
}

watch(deck, value => {
  if (value) {
    deckName.value = value.name
    deckCards.value = cardStore.getCardsByDeckId(value.id)

    nextTick(() => {
      const cancelButton: HTMLButtonElement | null = document.querySelector(".cancel-button")
      cancelButton?.focus()
    })
  }
})
</script>

<template>
  <UModal
    v-model:open="open"
    title="Удаление колоды"
    :ui="{ description: 'mt-2', content: 'divide-none', body: '!pt-0 sm:pb-5', header: 'pb-3' }"
  >
    <!-- Trigger -->
    <slot />
    <!-- /Trigger -->

    <template #description>
      Вы точно уверены? Колода <u>{{ deckName }}</u> будет удалена без возможности восстановления.
      <span v-if="deckCards.length">
        Все карточки (<u>{{ deckCards.length }}</u
        >) также будут удалены.
      </span>
    </template>

    <template #body>
      <div class="flex justify-end gap-2 pt-1">
        <UButton label="Отмена" color="neutral" variant="subtle" class="cancel-button px-4" @click="open = false" />
        <UButton label="Удалить" color="error" variant="solid" class="px-4" @click="onSubmit" />
      </div>
    </template>
  </UModal>
</template>
