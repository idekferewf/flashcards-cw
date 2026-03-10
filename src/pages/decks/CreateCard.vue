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
    isPinned: data.pin ?? false,
    tagIds: (data.tags as ITag[]).map(t => t.id)
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
  <UForm :schema="r$" :state="r$.$value" class="relative mx-auto h-full w-full px-3.5" @submit="onSubmit">
    <p class="text-default block text-base font-medium">
      <UIcon name="i-lucide-notebook-text" class="mr-1 inline-block size-5" />
      Основное
    </p>
    <USeparator class="-mx-20 w-auto py-4 sm:py-6" />

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

    <USeparator class="-mx-20 w-auto py-4 sm:py-6" />
    <p class="text-default block text-base font-medium">
      <UIcon name="i-lucide-settings-2" class="mr-1 inline-block size-5" />
      Дополнительно
    </p>
    <USeparator class="-mx-20 w-auto py-4 sm:py-6" />

    <!-- Tags -->
    <CreateTagForm
      v-model:tags="r$.$value.tags"
      orientation="horizontal"
      label="Теги"
      description="Тематические метки"
      help="Помогают группировать и находить карточки."
      class="mt-7 w-full gap-x-10 [&>div]:w-full"
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
  <div
    class="border-t-default bg-default absolute bottom-0 left-0 flex w-full items-center justify-end gap-x-2.5 border-t px-[30px] py-4 sm:px-[38px]"
  >
    <UButton size="lg" label="Закрыть" color="neutral" variant="outline" @click="close" />
    <UButton size="lg" label="Создать" color="neutral" :disabled="!r$.$correct" @click="onSubmit" />
  </div>
  <!-- /Footer -->

  <LeaveConfirmModal :open="isOpen" @confirm="onConfirm" @cancel="onCancel" />
</template>
