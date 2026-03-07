<script setup lang="ts">
import { useLeaveConfirm } from "@/composables/use-leave-confirm.composable"

const open = defineModel<boolean>("open", { default: false })

const { isOpen: isConfirmOpen, onConfirm, onCancel, confirm } = useLeaveConfirm(() => true)

const onUpdateOpen = (value: boolean) => {
  if (!value) {
    close()
    return
  }
  open.value = value
}

const close = async () => {
  const confirmed = await confirm()
  if (confirmed) {
    open.value = false
  }
}
</script>

<template>
  <UModal :open="open" :close="false" fullscreen @update:open="onUpdateOpen">
    <slot />

    <template #content>
      <UButton square icon="i-lucide-x" class="absolute top-4 right-4" variant="ghost" @click="close" />
      Content

      <LeaveConfirmModal
        :open="isConfirmOpen"
        title="Завершить повторение?"
        description="Прогресс повторённых карточек будет сохранён."
        cancel-label="Продолжить"
        confirm-label="Завершить"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </template>
  </UModal>
</template>
