<script setup lang="ts">
defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <UModal
    :open="open"
    :close="false"
    title="Покинуть страницу?"
    description="Заполненные данные не будут сохранены."
    :dismissible="false"
    :ui="{ footer: 'justify-end pt-0', content: 'max-w-[450px] divide-none' }"
  >
    <template #footer>
      <UButton
        autofocus
        label="Остаться"
        color="neutral"
        variant="outline"
        class="focus:ring-inverted focus:ring-2"
        @click="emit('cancel')"
      />
      <UButton label="Покинуть" color="error" variant="solid" @click="emit('confirm')" />
    </template>
  </UModal>
</template>
