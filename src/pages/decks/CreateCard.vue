<script setup lang="ts"></script>

<template>
  <div class="mx-auto w-full px-3.5">
    <h1 class="text-base font-medium">Создание карточки</h1>
    <p class="text-muted mt-0.5 text-[13px]">Заполните поля ниже, чтобы добавить карточку.</p>

    <USeparator class="-mx-20 w-auto py-4 sm:py-6" />

    <UFormField
      orientation="horizontal"
      label="Вопрос"
      description="Лицевая сторона"
      required
      help="Please enter a valid email address."
      class="w-full gap-x-10 [&>div]:w-full"
      :ui="{ wrapper: 'max-w-30', description: 'whitespace-nowrap' }"
    >
      <UTextarea :rows="3" placeholder="Enter your email" class="w-full" :ui="{ base: 'max-h-24 min-h-8' }" />
    </UFormField>

    <UFormField
      orientation="horizontal"
      label="Ответ"
      description="Оборотная сторона"
      required
      help="Please enter a valid email address."
      class="mt-6 w-full gap-x-10 [&>div]:w-full"
      :ui="{ wrapper: 'max-w-30', description: 'whitespace-nowrap' }"
    >
      <UTextarea :rows="4" placeholder="Enter your email" class="w-full" :ui="{ base: 'max-h-32 min-h-8' }" />
    </UFormField>
  </div>
</template>
