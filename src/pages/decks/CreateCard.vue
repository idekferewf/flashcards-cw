<script setup lang="ts"></script>

<template>
  <div class="relative mx-auto h-full w-full px-3.5">
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

    <USeparator class="-mx-20 w-auto py-4 sm:py-6" />

    <p class="text-default block text-base font-medium">
      <UIcon name="i-lucide-settings-2" class="mr-1 inline-block size-5" />
      Дополнительно
    </p>

    <UFormField
      orientation="horizontal"
      label="Теги"
      required
      description="..."
      help="Please enter a valid email address."
      class="mt-2 w-full gap-x-10 [&>div]:w-full"
      :ui="{ wrapper: 'max-w-30', description: 'whitespace-nowrap', label: 'after:text-muted' }"
    >
      <div class="mt-3.5 flex flex-wrap items-center gap-2">
        <!-- Tags -->
        <span class="text-muted text-sm">Теги не добавлены</span>
        <!-- /Tags -->

        <!-- Select Tag -->
        <USelectMenu
          multiple
          size="sm"
          :search-input="{ placeholder: 'Искать...', icon: 'i-lucide-search' }"
          icon="i-lucide-tag"
          variant="outline"
          :ui="{ value: 'hidden' }"
          class="bg-muted/90"
        >
          <template #empty>Ничего не найдено</template>
          <span class="text-dimmed">Выбрать теги</span>
        </USelectMenu>
        <!-- Select Tag -->

        <!-- Create Tag -->
        <TagCreateModal
          description="Тег будет добавлен в колоду после создания."
          exist-description="Вы можете выбрать его в форме создания колоды."
        >
          <UButton label="Добавить тег" icon="i-lucide-plus" variant="soft" color="neutral" size="sm" />
        </TagCreateModal>
        <!-- /Create Tag -->
      </div>
    </UFormField>

    <UFormField
      orientation="horizontal"
      label="Закрепить?"
      description="..."
      required
      help="Please enter a valid email address."
      class="mt-8 w-full gap-x-10 [&>div]:w-full"
      :ui="{ wrapper: 'max-w-30', description: 'whitespace-nowrap', label: 'after:text-muted' }"
    >
      <USwitch checked-icon="i-lucide-check" description="Будет закреплена после создания." />
    </UFormField>
  </div>

  <div
    class="border-t-default bg-default absolute bottom-0 left-0 flex w-full items-center justify-end border-t px-[30px] py-4 sm:px-[38px]"
  >
    <UButton size="lg" label="Создать" color="neutral" />
  </div>
</template>
