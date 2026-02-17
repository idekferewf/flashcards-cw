import type { IDeck } from "@/types"
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { DecksTD } from "./temp-data.ts"

export const useDeckStore = defineStore("decks", () => {
  const decks = ref<IDeck[]>(DecksTD)

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
    decks,
    activeDecks,
    archivedDecks,
    addDeck,
    removeDeck,
    getDeckById,
    toggleDeckFlag,
    saveToIndexedDb: true
  }
})
