<script setup lang="ts">
import { useCardStore } from "@/store/card.store.ts"
import type { ICard } from "@/types"
import { computed, ref, watch } from "vue"

const card = defineModel<ICard | null>("card")

const toast = useToast()
const cardStore = useCardStore()

const cardName = ref<string>()

const open = computed({
  get: () => card.value !== null,
  set: (value: boolean) => {
    if (!value) {
      card.value = null
    }
  }
})

const onSubmit = () => {
  if (!card.value) return

  cardStore.removeCard(card.value.id)
  card.value = null

  toast.add({
    title: "Карточка удалена",
    description: "Выбранная карточка была удалена.",
    icon: "i-lucide-trash"
  })
}

watch(card, value => {
  if (value) cardName.value = value.front
})
</script>

<template>
  <UModal
    v-model:open="open"
    title="Удаление карточки"
    :ui="{ description: 'mt-2', content: 'divide-none', body: '!pt-0 sm:pb-5' }"
  >
    <!-- Trigger -->
    <slot />
    <!-- /Trigger -->

    <template #description>
      Вы точно уверены? Карточка <span class="underline">{{ cardName }}</span> будет удалена без возможности восстановления.
    </template>

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton label="Отмена" color="neutral" variant="subtle" class="px-4" @click="open = false" />
        <UButton label="Удалить" color="error" variant="solid" class="px-4" @click="onSubmit" />
      </div>
    </template>
  </UModal>
</template>
