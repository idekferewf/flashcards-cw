import localforage from "localforage"
import type { PiniaPluginContext, StateTree } from "pinia"

const STORE_NAME = "app"

const storage = localforage.createInstance({
  name: "flashcards",
  storeName: STORE_NAME
})

function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
  let timer: number | undefined

  return (...args: Parameters<T>) => {
    clearTimeout(timer)

    timer = window.setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export function piniaIndexedDbPlugin({ store }: PiniaPluginContext) {
  if (!store.saveToIndexedDb) return

  const key = `${STORE_NAME}:${store.$id}`

  ;(async () => {
    const saved = await storage.getItem<StateTree>(key)

    if (saved) {
      store.$patch(saved)
    }
  })()

  const save = debounce(async state => {
    await storage.setItem(key, state)
  }, 300)

  store.$subscribe(async () => {
    save({ ...store.$state })
  })
}
