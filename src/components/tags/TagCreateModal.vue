<script setup lang="ts">
import type { RadioGroupItem } from "@nuxt/ui"
import { useRegle } from "@regle/core"
import { minLength, required, withMessage } from "@regle/rules"
import { computed, nextTick, ref, useTemplateRef, watch } from "vue"

defineProps<{
  description?: string
}>()

const open = defineModel<boolean>({ default: false })

const { r$ } = useRegle(
  { label: "", color: "neutral" },
  {
    label: {
      required: withMessage(required, "Данное поле обязательно для заполнения."),
      minLength: withMessage(minLength(2), "Минимальная длина названия – 2 символа.")
    }
  }
)

const labelRef = useTemplateRef("label")

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
  console.log(data)
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

watch(open, () => {
  if (!open.value) {
    r$.$reset({ toInitialState: true })
    return
  }
  nextTick(() => {
    labelRef.value?.inputRef?.focus()
  })
})
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
        <UFormField
          name="label"
          hint="*"
          help="Придумайте краткое и понятное название."
          :ui="{ hint: 'text-error' }"
          class="mb-4"
        >
          <template #label>
            <div class="inline-flex items-center gap-x-1.5">
              <UIcon name="i-lucide-letter-text" class="size-4" />
              <span>Название</span>
            </div>
          </template>
          <UInput ref="label" v-model="r$.$value.label" placeholder="Введите название" class="w-full" />
        </UFormField>
        <!-- /Label -->

        <!-- Color -->
        <UFormField name="color" hint="*" help="Выберите подходящий цвет из списка.">
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
            :ui="{ fieldset: 'flex-wrap', indicator: indicatorClasses, item: radioItemsClasses }"
            class="mb-0"
          />
        </UFormField>
        <!-- /Color -->
        <UButton type="submit" class="invisible hidden" />
      </UForm>
    </template>

    <template #footer>
      <UButton label="Отмена" color="neutral" variant="outline" @click="open = false" />
      <UButton label="Сохранить" color="neutral" variant="solid" :disabled="!r$.$correct" @click="onSubmit" />
    </template>
  </UModal>
</template>
