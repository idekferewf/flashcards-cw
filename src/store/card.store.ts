import { CardsTD } from "@/store/temp-data.ts"
import { CardStatus, type ICard } from "@/types"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useCardStore = defineStore("cards", () => {
  CardsTD.forEach(card => {
    card.status = CardStatus.new
    card.dueAt = card.createdAt
    card.isPinned = Math.random() > 0.5
  })

  const cards = ref<ICard[]>(CardsTD)

  function addCard(newCard: ICard) {
    cards.value.push(newCard)
  }

  function removeCard(id: string) {
    cards.value = cards.value.filter(c => c.id !== id)
  }

  function removeCards(ids: string[]) {
    cards.value = cards.value.filter(c => !ids.includes(c.id))
  }

  function togglePin(cardId: string) {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.isPinned = !card.isPinned
    }
  }

  function getCardsByDeckId(deckId: string) {
    return cards.value.filter(c => c.deckId === deckId)
  }

  return {
    cards,
    addCard,
    removeCard,
    removeCards,
    togglePin,
    getCardsByDeckId,
    saveToIndexedDb: true
  }
})
