<script setup lang="ts">
import { useTagStore } from "@/store/tag.store.ts"
import type { ITag, TTagColor, TTagCreateDTO } from "@/types"
import { normalizeLabel } from "@/utils"
import type { RadioGroupItem } from "@nuxt/ui"
import { useToast } from "@nuxt/ui/composables"
import { useRegle } from "@regle/core"
import { minLength, required, withMessage } from "@regle/rules"
import { computed, ref } from "vue"

const props = defineProps<{
  description?: string
  existDescription?: string
}>()

const emit = defineEmits<{
  submit: [ITag]
}>()

const open = defineModel<boolean>({ default: false })

const toast = useToast()
const tagStore = useTagStore()

const { r$ } = useRegle(
  { label: "", color: "neutral" },
  {
    label: {
      required: withMessage(required, "Данное поле обязательно для заполнения."),
      minLength: withMessage(minLength(2), "Минимальная длина названия – 2 символа."),
      noSpaces: withMessage(value => !/\s/.test(value as string), "Название не должно содержать пробелов.")
    },
    color: { required }
  }
)

const indicatorClasses = computed<string>(() => {
  if (r$.$value.color === "neutral") {
    return "bg-primary"
  }
  return `bg-${r$.$value.color}`
})

const radioItemsClasses = computed<string>(() => {
  if (r$.$value.color === "neutral") {
    return "has-data-[state=checked]:border-primary/35 has-data-[state=checked]:bg-elevated"
  }
  return `has-data-[state=checked]:border-${r$.$value.color}/50 has-data-[state=checked]:bg-${r$.$value.color}/10`
})

const onSubmit = async () => {
  const { valid, data } = await r$.$validate()
  if (!valid) return

  const existingTag = tagStore.getTag(data.label, data.color)
  if (existingTag) {
    toast.add({
      title: "Данный тег уже существует",
      description: props.existDescription ?? "Измените название или цвет, чтобы исправить это.",
      icon: "i-lucide-triangle-alert",
      color: "warning"
    })
    return
  }

  const tagCreateDTO: TTagCreateDTO = {
    label: normalizeLabel(data.label),
    color: data.color as TTagColor
  }
  const newTag = tagStore.addTag(tagCreateDTO)

  emit("submit", newTag)
  close()
}

const close = () => {
  open.value = false
}

const radioItems = ref<RadioGroupItem[]>([
  {
    label: "Синий",
    value: "info"
  },
  {
    label: "Зелёный",
    value: "success"
  },
  {
    label: "Жёлтый",
    value: "warning"
  },
  {
    label: "Красный",
    value: "error"
  },
  {
    label: "Обычный",
    value: "neutral"
  }
])
</script>

<template>
  <UModal
    v-model:open="open"
    title="Создание тега"
    :description="description ?? 'Заполните поля ниже, чтобы создай новый тег.'"
    :ui="{ footer: 'justify-end', content: 'max-w-[400px]', body: '!pt-3.5 sm:!pt-[22px]' }"
  >
    <!-- Trigger -->
    <slot />
    <!-- /Trigger -->

    <template #body>
      <UForm :schema="r$" :state="r$.$value" @submit="onSubmit">
        <!-- Label -->
        <UFormField name="label" help="Придумайте краткое и понятное название." :ui="{ hint: 'text-error' }" class="mb-4">
          <template #label>
            <div class="inline-flex items-center gap-x-1.5">
              <UIcon name="i-lucide-letter-text" class="size-4" />
              <span>Название</span>
            </div>
          </template>
          <UInput v-model="r$.$value.label" autofocus placeholder="Введите название" class="w-full" />
        </UFormField>
        <!-- /Label -->

        <!-- Color -->
        <UFormField name="color" help="Выберите подходящий цвет из списка.">
          <template #label>
            <div class="inline-flex items-center gap-x-1.5">
              <UIcon name="i-lucide-paintbrush" class="size-4" />
              <span>Цвет</span>
            </div>
          </template>

          <URadioGroup
            v-model="r$.$value.color"
            indicator="end"
            color="primary"
            orientation="horizontal"
            variant="card"
            :items="radioItems"
            :ui="{ fieldset: 'flex-wrap gap-2', indicator: indicatorClasses, item: radioItemsClasses }"
            class="mb-0"
          />
        </UFormField>
        <!-- /Color -->

        <UButton type="submit" class="invisible hidden" />
      </UForm>
    </template>

    <template #footer>
      <UButton label="Отмена" color="neutral" variant="outline" @click="close" />
      <UButton label="Сохранить" color="neutral" variant="solid" :disabled="!r$.$correct" @click="onSubmit" />
    </template>
  </UModal>
</template>
