<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import { type InferInput, useRegle } from "@regle/core"
import { boolean, minLength, required, withMessage } from "@regle/rules"

const { r$ } = useRegle(
  { name: "", description: "", tags: [], archive: false, favorite: false },
  {
    name: {
      required: withMessage(required, "Данное поле обязательно для заполнения."),
      minLength: withMessage(minLength(4), "Минимальная длина названия – 4 символа.")
    },
    description: {
      minLength: withMessage(minLength(4), "Минимальная длина описания – 6 символов.")
    },
    archive: { boolean },
    favorite: { boolean }
  }
)

type Schema = InferInput<typeof r$>

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <USlideover
    title="Создание колоды"
    description="Заполните поля ниже, чтобы создать колоду."
    :ui="{
      footer: 'justify-end'
    }"
  >
    <!-- Trigger -->
    <slot />
    <!-- /Trigger -->

    <template #body>
      <UForm :schema="r$" :state="r$.$value" class="space-y-5" @submit="onSubmit">
        <!-- Name -->
        <UFormField
          name="name"
          size="lg"
          hint="*"
          label="Название"
          help="Короткое и понятное имя, по которому вы сможете быстро найти колоду."
          :ui="{ hint: 'text-error' }"
        >
          <template #label>
            <div class="inline-flex items-center gap-1.5">
              <UIcon name="i-lucide-pencil-line" />
              Название
            </div>
          </template>
          <UInput v-model="r$.$value.name" placeholder="Введите название" class="w-full" />
        </UFormField>
        <!-- /Name -->

        <!-- Description -->
        <UFormField name="description" hint="*" help="Кратко опишите, что именно содержится в колоде.">
          <template #label>
            <div class="inline-flex items-center gap-1.5">
              <UIcon name="i-lucide-letter-text" class="size-4" />
              Описание
            </div>
          </template>
          <UInput v-model="r$.$value.description" size="lg" placeholder="Укажите описание" class="w-full" />
        </UFormField>
        <!-- /Description -->

        <!-- Tags -->
        <UFormField hint="*">
          <template #label>
            <div class="inline-flex items-center gap-1.5">
              <UIcon name="i-lucide-tags" class="size-4" />
              Теги
            </div>
          </template>
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-muted text-sm">Теги не добавлены</span>
            <UButton icon="i-lucide-plus" variant="soft" color="neutral" size="sm">Добавить тег</UButton>
          </div>
        </UFormField>
        <!-- /Tags -->

        <USeparator />

        <UFormField label="Дополнительно" hint="*">
          <!-- Favorite -->
          <USwitch
            v-model="r$.$value.favorite"
            checked-icon="i-lucide-check"
            size="lg"
            label="Добавить в избранное?"
            description="Колода будет добавлена в избранное."
            class="mt-5"
          />
          <!-- /Favorite -->

          <!-- Archive -->
          <USwitch
            v-model="r$.$value.archive"
            checked-icon="i-lucide-check"
            size="lg"
            label="Добавить в архив?"
            description="Будет архивирована после создания."
            class="mt-5"
          />
          <!-- /Archive -->
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton size="lg" label="Отмена" variant="outline" color="neutral" />
      <UButton size="lg" label="Сохранить" color="neutral" />
    </template>
  </USlideover>
</template>
