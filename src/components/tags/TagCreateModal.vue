<script setup lang="ts">
import type { RadioGroupItem } from "@nuxt/ui"
import { useRegle } from "@regle/core"
import { minLength, required, withMessage } from "@regle/rules"
import { computed, ref } from "vue"

defineProps<{
  description?: string
}>()

const { r$ } = useRegle(
  { label: "", color: "neutral" },
  {
    label: {
      required: withMessage(required, "Данное поле обязательно для заполнения."),
      minLength: withMessage(minLength(2), "Минимальная длина названия – 2 символа.")
    }
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
    title="Создание тега"
    :description="description ?? 'Заполните поля ниже, чтобы создай новый тег.'"
    :ui="{ footer: 'justify-end', content: 'max-w-[400px]' }"
  >
    <!-- Trigger -->
    <slot />
    <!-- /Trigger -->

    <template #body>
      <UForm :schema="r$" :state="r$.$value" class="space-y-4">
        <UFormField
          label="Название"
          hint="*"
          help="Придумайте краткое и понятное название."
          name="label"
          :ui="{ hint: 'text-error' }"
        >
          <UInput v-model="r$.$value.label" placeholder="Введите название" class="w-full" />
        </UFormField>

        <UFormField label="Цвет" name="color">
          <URadioGroup
            v-model="r$.$value.color"
            indicator="end"
            color="primary"
            orientation="horizontal"
            variant="card"
            :items="radioItems"
            :ui="{ fieldset: 'flex-wrap', indicator: indicatorClasses, item: radioItemsClasses }"
          >
          </URadioGroup>
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton label="Отмена" color="neutral" variant="outline" />
      <UButton label="Сохранить" color="neutral" variant="solid" />
    </template>
  </UModal>
</template>
