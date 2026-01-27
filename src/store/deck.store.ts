import type { IDeck } from "@/types"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useDeckStore = defineStore("deck", () => {
  const decks = ref<IDeck[]>([])

  function loadFromLocalStorage() {
    const raw = localStorage.getItem("decks")
    if (raw) decks.value = JSON.parse(raw)
  }

  function saveToLocalStorage() {
    localStorage.setItem("decks", JSON.stringify(decks.value))
  }

  function addDeck(name: string, description?: string) {
    const newDeck: IDeck = {
      id: crypto.randomUUID(),
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    decks.value.push(newDeck)
    saveToLocalStorage()
  }

  function removeDeck(id: string) {
    decks.value = decks.value.filter(d => d.id !== id)
    saveToLocalStorage()
  }

  const getDeckById = (id: string) => decks.value.find(d => d.id === id)

  const totalDecks = computed(() => decks.value.length)

  loadFromLocalStorage()

  return { decks, addDeck, removeDeck, getDeckById, totalDecks }
})
