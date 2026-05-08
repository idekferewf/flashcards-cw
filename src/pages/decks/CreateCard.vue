<script setup lang="ts">
import { useLeaveConfirm } from "@/composables/use-leave-confirm.composable"
import { ROUTES } from "@/constants"
import { useCardStore } from "@/store/card.store"
import type { IDeck, ITag, TCardCreateDTO } from "@/types"
import { useRegle } from "@regle/core"
import { boolean, required, withMessage } from "@regle/rules"
import { useRouter } from "vue-router"

const props = defineProps<{
  deck: IDeck
}>()

const toast = useToast()
const router = useRouter()
const cardStore = useCardStore()
const { isOpen, onConfirm, onCancel } = useLeaveConfirm(() => r$.$anyEdited)

const { r$ } = useRegle(
  {
    front: "",
    back: "",
    tags: [] as ITag[],
    pin: false
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

const onSubmit = async () => {
  const { valid, data } = await r$.$validate()
  if (!valid) return

  const cardCreateDTO: TCardCreateDTO = {
    front: data.front,
    back: data.back,
    deckId: props.deck.id,
    tagIds: (data.tags as ITag[]).map(t => t.id),
    isPinned: data.pin ?? false,
    easeFactor: props.deck.config.startingEase
  }
  cardStore.addCard(cardCreateDTO)

  close()
  r$.$reset({ toInitialState: true })

  toast.add({
    title: "Карточка успешно создана",
    description: "Добавленная карточка отображена в таблице.",
    icon: "i-lucide-circle-check",
    color: "success"
  })
}

const close = () => {
  router.push({ name: ROUTES.DECKS.children.index.name })
}
</script>

<template>
  <div class="flex h-full flex-col">
    <UForm
      :schema="r$"
      :state="r$.$value"
      class="relative mx-auto h-full w-full flex-1 overflow-y-auto p-6 sm:p-8"
      @submit="onSubmit"
    >
      <!-- Front -->
      <UFormField
        orientation="horizontal"
        label="Вопрос"
        description="Лицевая сторона"
        required
        name="front"
        help="Сформулируйте вопрос коротко и понятно."
        class="w-full gap-x-10 [&>div]:w-full"
        :ui="{ wrapper: 'max-w-38', description: 'whitespace-nowrap' }"
      >
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
        orientation="horizontal"
        label="Ответ"
        description="Оборотная сторона"
        required
        name="back"
        help="Правильный ответ или объяснение."
        class="mt-6 w-full gap-x-10 [&>div]:w-full"
        :ui="{ wrapper: 'max-w-38', description: 'whitespace-nowrap' }"
      >
        <UTextarea
          v-model.trim="r$.$value.back"
          :rows="4"
          placeholder="Напишите ответ..."
          class="w-full"
          :ui="{ base: 'max-h-32 min-h-8' }"
        />
      </UFormField>
      <!-- /Back -->

      <USeparator class="-mx-8 w-auto pt-6 sm:pt-8" />
      <p class="text-default my-8 block text-base font-medium">Дополнительно:</p>

      <!-- Tags -->
      <CreateTagForm
        v-model:tags="r$.$value.tags"
        orientation="horizontal"
        label="Теги"
        description="Тематические метки"
        help="Помогают группировать и находить карточки."
        class="w-full gap-x-10 [&>div]:w-full"
        :ui="{ wrapper: 'max-w-38', description: 'whitespace-nowrap' }"
      />
      <!-- /Tags -->

      <!-- Pin -->
      <UFormField
        orientation="horizontal"
        label="Закрепить?"
        help="Подходит для важных или сложных карточек."
        class="mt-8 w-full gap-x-10 [&>div]:w-full"
        :ui="{ wrapper: 'max-w-38' }"
      >
        <USwitch v-model="r$.$value.pin" checked-icon="i-lucide-check" description="Будет закреплена после создания" />
      </UFormField>
      <!-- Pin -->
    </UForm>

    <!-- Footer -->
    <div class="border-t-default flex w-full shrink-0 items-center justify-end gap-x-2.5 border-t px-6 py-4 sm:px-8">
      <UButton size="lg" label="Закрыть" color="neutral" variant="outline" @click="close" />
      <UButton size="lg" label="Создать" color="neutral" :disabled="!r$.$correct" @click="onSubmit" />
    </div>
    <!-- /Footer -->
  </div>

  <LeaveConfirmModal :open="isOpen" @confirm="onConfirm" @cancel="onCancel" />
</template>
