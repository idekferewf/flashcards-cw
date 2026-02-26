import { DecksTD } from "@/store/temp-data.ts"
import type { IDeck } from "@/types"
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

  function addDeck(newDeck: IDeck) {
    decks.value.push(newDeck)
  }

  function removeDeck(id: string) {
    decks.value = decks.value.filter(d => d.id !== id)
  }

  function getDeckById(id?: string): IDeck | null {
    return decks.value.find(d => d.id === id) ?? null
  }

  function toggleDeckFlag(id: string, key: "isFavorite" | "isArchived") {
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
