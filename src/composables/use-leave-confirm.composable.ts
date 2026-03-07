import { onMounted, onUnmounted, ref } from "vue"
import { onBeforeRouteLeave } from "vue-router"

export const useLeaveConfirm = (isDirty: () => boolean) => {
  const isOpen = ref(false)
  let resolve: ((value: boolean) => void) | null = null

  const confirm = () =>
    new Promise<boolean>(res => {
      resolve = res
      isOpen.value = true
    })

  const onConfirm = () => {
    isOpen.value = false
    resolve?.(true)
  }
  const onCancel = () => {
    isOpen.value = false
    resolve?.(false)
  }

  onBeforeRouteLeave(async () => {
    if (!isDirty()) return true
    return await confirm()
  })

  const onBeforeUnload = (e: BeforeUnloadEvent) => {
    if (!isDirty()) return
    e.preventDefault()
  }

  onMounted(() => window.addEventListener("beforeunload", onBeforeUnload))
  onUnmounted(() => window.removeEventListener("beforeunload", onBeforeUnload))

  return {
    isOpen,
    onConfirm,
    onCancel,
    confirm
  }
}
