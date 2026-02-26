import { DecksTD } from "@/store/temp-data.ts"
import type { IDeck, TDeckCreateDTO } from "@/types"
import { type StorageLikeAsync, useStorageAsync } from "@vueuse/core"
import localforage from "localforage"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useDeckStore = defineStore("decks", () => {
  const isLoading = ref<boolean>(true)
  const decks = useStorageAsync<IDeck[]>("decks", [...DecksTD], localforage as StorageLikeAsync, {
    onReady: () => (isLoading.value = false)
  })

  const activeDecks = computed<IDeck[]>(() => decks.value.filter(d => !d.isArchived))
  const archivedDecks = computed<IDeck[]>(() => decks.value.filter(d => d.isArchived))

  function addDeck(data: TDeckCreateDTO): IDeck {
    const now = new Date().toISOString()
    const newDeck: IDeck = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    }
    decks.value = [...decks.value, newDeck]
    return newDeck
  }

  function removeDeck(id: string): void {
    decks.value = decks.value.filter(d => d.id !== id)
  }

  function getDeckById(id?: string): IDeck | null {
    return decks.value.find(d => d.id === id) ?? null
  }

  function toggleDeckFlag(id: string, key: "isFavorite" | "isArchived"): void {
    const deck = decks.value.find(d => d.id === id)
    if (deck) {
      deck[key] = !deck[key]
    }
  }

  return {
    isLoading,
    decks,
    activeDecks,
    archivedDecks,
    addDeck,
    removeDeck,
    getDeckById,
    toggleDeckFlag
  }
})
