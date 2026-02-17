<script setup lang="ts">
import { useDeckStore } from "@/store/deck.store"
import type { IDeck } from "@/types"
import { computed, h, ref, watch } from "vue"

const deck = defineModel<IDeck | null>("deck")

const toast = useToast()
const deckStore = useDeckStore()

const deckName = ref<string>()

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
  deck.value = null

  toast.add({
    title: "Колода удалена",
    description: h("span", undefined, [
      "Колода ",
      h("span", { class: "underline" }, [deckName.value]),
      " и её содержимое было удалено."
    ]),
    icon: "i-lucide-trash"
  })
}

watch(deck, value => {
  if (value) deckName.value = value.name
})
</script>

<template>
  <UModal
    v-model:open="open"
    title="Удаление колоды"
    :ui="{ description: 'mt-2', content: 'divide-none', body: '!pt-0 sm:pb-5' }"
  >
    <!-- Trigger -->
    <slot />
    <!-- /Trigger -->

    <template #description>
      Вы точно уверены? Колода <span class="underline">{{ deckName }}</span> будет удалена без возможности восстановления.
    </template>
    <!-- TODO: СДЕЛАТЬ ОТОБРАЖЕНИЕ КОЛИЧЕСТВО КАРТОЧЕК ДЛЯ УДАЛЕНИЯ -->

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton label="Отмена" color="neutral" variant="subtle" class="px-4" @click="open = false" />
        <UButton label="Удалить" color="error" variant="solid" class="px-4" @click="onSubmit" />
      </div>
    </template>
  </UModal>
</template>
