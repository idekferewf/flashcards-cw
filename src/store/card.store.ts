import { CardsTD } from "@/store/temp-data.ts"
import { CardStatus, type ICard } from "@/types"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useCardStore = defineStore("cards", () => {
  CardsTD.forEach(card => {
    card.status = CardStatus.new
    card.dueAt = card.createdAt
  })

  const cards = ref<ICard[]>(CardsTD)

  function addCard(newCard: ICard) {
    cards.value.push(newCard)
  }

  function removeCard(id: string) {
    cards.value = cards.value.filter(c => c.id !== id)
  }

  function getCardsByDeckId(deckId: string) {
    return cards.value.filter(c => c.deckId === deckId)
  }

  return {
    cards,
    addCard,
    removeCard,
    getCardsByDeckId,
    saveToIndexedDb: true
  }
})
