import type { Card } from "@/types"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useCardStore = defineStore("cards", () => {
  const cards = ref<Card[]>([])

  function loadFromLocalStorage() {
    const raw = localStorage.getItem("anki.cards")
    if (raw) cards.value = JSON.parse(raw)
  }

  function saveToLocalStorage() {
    localStorage.setItem("anki.cards", JSON.stringify(cards.value))
  }

  function addCard(card: Omit<Card, "id" | "createdAt" | "updatedAt">) {
    const newCard: Card = {
      ...card,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    cards.value.push(newCard)
    saveToLocalStorage()
  }

  function removeCard(id: string) {
    cards.value = cards.value.filter(c => c.id !== id)
    saveToLocalStorage()
  }

  function getCardsByDeck(deckId: string) {
    return cards.value.filter(c => c.deckId === deckId)
  }

  const totalCards = computed(() => cards.value.length)

  loadFromLocalStorage()

  return { cards, addCard, removeCard, getCardsByDeck, totalCards }
})
