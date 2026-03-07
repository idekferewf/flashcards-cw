<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean
    title?: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
  }>(),
  {
    title: "Покинуть страницу?",
    description: "Заполненные данные не будут сохранены.",
    confirmLabel: "Покинуть",
    cancelLabel: "Остаться"
  }
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <UModal
    :open="open"
    :close="false"
    :title="title"
    :description="description"
    :dismissible="false"
    :ui="{ footer: 'justify-end pt-0', content: 'max-w-[450px] divide-none' }"
  >
    <template #footer>
      <UButton
        autofocus
        :label="cancelLabel"
        color="neutral"
        variant="outline"
        class="focus:ring-inverted focus:ring-2"
        @click="emit('cancel')"
      />
      <UButton :label="confirmLabel" color="error" variant="solid" @click="emit('confirm')" />
    </template>
  </UModal>
</template>
