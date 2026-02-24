<script setup lang="ts">
import { useCardStore } from "@/store/card.store.ts"
import type { ICard } from "@/types"
import { pluralize } from "@/utils"
import { useResizeObserver } from "@vueuse/core"
import { computed, ref, useTemplateRef, watch } from "vue"

const props = defineProps<{
  cards: ICard[]
}>()

const toast = useToast()
const cardStore = useCardStore()

const cardsToDeleteRef = useTemplateRef<HTMLDivElement>("cardsToDelete")

const open = ref<boolean>(false)
const cardsToBack = ref<Set<string>>(new Set())
const hasScroll = ref<boolean>(false)

const cardsToDelete = computed<ICard[]>(() => props.cards.filter(c => !cardsToBack.value.has(c.id)))
const title = computed<string>(
  () => `Удаление ${cardsToDelete.value.length} ${pluralize(cardsToDelete.value.length, "карточки", "карточек", "карточек")}`
)

const onSubmit = () => {
  cardStore.removeCards(cardsToDelete.value.map(c => c.id))
  open.value = false

  toast.add({
    title: "Карточки удалены",
    description: "Выбранные карточки безвозвратно удалены.",
    icon: "i-lucide-trash"
  })
}

watch(
  () => cardsToBack.value.size,
  size => {
    if (size == props.cards.length) {
      open.value = false
    }
  }
)

watch(open, value => {
  if (value) {
    cardsToBack.value = new Set()
  }
})

useResizeObserver(cardsToDeleteRef, () => {
  const el = cardsToDeleteRef.value
  if (!el) return

  hasScroll.value = el.scrollHeight > el.clientHeight
})
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title"
    :description="`Вы точно уверены? Карточки ниже будут безвозвратно удалены.`"
    :ui="{ body: 'pt-0.5 sm:pt-1.5' }"
  >
    <!-- Trigger -->
    <slot />
    <!-- /Trigger -->

    <template #body>
      <!-- Cards -->
      <div ref="cardsToDelete" class="max-h-72 overflow-y-auto">
        <div v-for="card in cardsToDelete" :key="card.id" class="group border-default relative border-t py-3.5 first:border-0">
          <span class="text-sm">{{ card.front }}</span>
          <TagList v-if="card.tags" :tags="card.tags" class="mt-1 text-[10px]" />
          <UButton
            size="xs"
            label="Вернуть"
            trailing-icon="i-lucide-corner-down-left"
            color="neutral"
            variant="outline"
            class="invisible absolute top-1/2 right-0 -translate-y-1/2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100"
            :class="{ 'right-2': hasScroll }"
            @click="cardsToBack.add(card.id)"
          />
        </div>
      </div>
      <!-- /Cards -->

      <!-- Footer -->
      <div class="mt-3.5 flex justify-end gap-2">
        <UButton label="Отмена" color="neutral" variant="subtle" class="px-4" @click="open = false" />
        <UButton label="Удалить" color="error" variant="solid" loading-auto class="px-4" @click="onSubmit" />
      </div>
      <!-- /Footer -->
    </template>
  </UModal>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 2px;
}

::-webkit-scrollbar-thumb {
  background: var(--ui-color-neutral-300);
  border-radius: 4px;
}
</style>
