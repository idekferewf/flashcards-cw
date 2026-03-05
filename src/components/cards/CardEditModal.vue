<script setup lang="ts">
import { useCardStore } from "@/store/card.store"
import { useTagStore } from "@/store/tag.store"
import type { ICard, ITag, TCardUpdateDTO } from "@/types"
import { useRegle } from "@regle/core"
import { boolean, required, withMessage } from "@regle/rules"
import { computed, watch } from "vue"

const card = defineModel<ICard | null>("card")

const cardStore = useCardStore()
const tagStore = useTagStore()

const open = computed({
  get: () => card.value !== null,
  set: (value: boolean) => {
    if (!value) {
      card.value = null
    }
  }
})

const { r$ } = useRegle(
  {
    front: card.value?.front,
    back: card.value?.back,
    tags: card.value ? tagStore.getTagsByDeckOrCard(card.value) : [],
    pin: card.value?.isPinned
  },
  {
    front: {
      required: withMessage(required, "Данное поле обязательно для заполнения.")
    },
    back: {
      required: withMessage(required, "Данное поле обязательно для заполнения.")
    },
    pin: { boolean }
  }
)

const hasChanges = computed<boolean>(() => {
  return (
    r$.$value.front !== card.value?.front ||
    r$.$value.back !== card.value?.back ||
    r$.$value.pin !== card.value?.isPinned ||
    r$.$value.tags.map(t => t.id).length !== card.value?.tagIds.length ||
    !r$.$value.tags.map(t => t.id).every((value, index) => value === card.value?.tagIds[index])
  )
})

const onSubmit = async () => {
  const { valid, data } = await r$.$validate()
  if (!valid) return

  const cardUpdateDTO: TCardUpdateDTO = {
    front: data.front,
    back: data.back,
    isPinned: data.pin ?? false,
    tagIds: (data.tags as ITag[]).map(t => t.id)
  }
  cardStore.updateDeck(card.value?.id as string, cardUpdateDTO)

  close()
}

const close = () => {
  card.value = null
}

watch(
  () => [card.value, open.value] as const,
  ([card, open]) => {
    if (!open || !card) return
    r$.$value.front = card?.front
    r$.$value.back = card?.back
    r$.$value.tags = tagStore.getTagsByDeckOrCard(card)
    r$.$value.pin = card?.isPinned ?? false
    r$.$reset()
  }
)
</script>

<template>
  <USlideover
    v-model:open="open"
    side="left"
    title="Редактирование карточки"
    description="Измените необходимые поля ниже и сохраните карточку."
    :ui="{ content: 'max-w-xl', footer: 'justify-end' }"
  >
    <!-- Trigger -->
    <slot />
    <!-- /Trigger -->

    <template #body>
      <UForm :schema="r$" :state="r$.$value" class="space-y-5" @submit="onSubmit">
        <!-- Front -->
        <UFormField hint="*" name="front" help="Формулировка вопроса или задания." :ui="{ hint: 'text-error' }">
          <template #label>
            <div class="inline-flex items-center gap-1.5">
              <UIcon name="i-lucide-circle-question-mark" class="size-4 -translate-y-px" />
              Вопрос
            </div>
          </template>

          <UTextarea
            v-model.trim="r$.$value.front"
            autofocus
            :rows="3"
            placeholder="Введите вопрос..."
            class="w-full"
            :ui="{ base: 'max-h-24 min-h-8' }"
          />
        </UFormField>
        <!-- /Front -->

        <!-- Back -->
        <UFormField
          name="back"
          hint="*"
          help="Правильный ответ или объяснение."
          class="mt-6 w-full gap-x-10 [&>div]:w-full"
          :ui="{ hint: 'text-error' }"
        >
          <template #label>
            <div class="inline-flex items-center gap-1.5">
              <UIcon name="i-lucide-message-circle-more" class="size-4" />
              Ответ
            </div>
          </template>

          <UTextarea
            v-model.trim="r$.$value.back"
            :rows="4"
            placeholder="Напишите ответ..."
            class="w-full"
            :ui="{ base: 'max-h-32 min-h-8' }"
          />
        </UFormField>
        <!-- /Back -->

        <USeparator />
        <p class="text-default block text-[15px] font-medium">Дополнительно</p>

        <!-- Tags -->
        <CreateTagForm v-model:tags="r$.$value.tags" />
        <!-- /Tags -->

        <!-- Pin -->
        <USwitch
          v-model="r$.$value.pin"
          checked-icon="i-lucide-check"
          label="Закрепить?"
          description="Подходит для важных или сложных карточек."
          class="mt-6"
        />
        <!-- /Pin -->
      </UForm>
    </template>

    <template #footer>
      <UButton size="lg" label="Отмена" variant="outline" color="neutral" @click="close" />
      <UButton size="lg" label="Сохранить" color="neutral" :disabled="!hasChanges || !r$.$correct" @click="onSubmit" />
    </template>
  </USlideover>
</template>
