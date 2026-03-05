import { CardsTD } from "@/store/temp-data.ts"
import { CardStatus, type ICard, type TCardCreateDTO } from "@/types"
import { type StorageLikeAsync, useStorageAsync } from "@vueuse/core"
import localforage from "localforage"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useCardStore = defineStore("cards", () => {
  CardsTD.forEach(card => {
    if (!card.status) {
      card.status = CardStatus.new
    }
    card.isPinned = Math.random() > 0.5
  })

  const isLoading = ref<boolean>(true)
  const cards = useStorageAsync<ICard[]>("cards", [...CardsTD], localforage as StorageLikeAsync, {
    onReady: () => (isLoading.value = false)
  })

  function addCard(data: TCardCreateDTO): ICard {
    const now = new Date().toISOString()
    const newDeck: ICard = {
      ...data,
      id: crypto.randomUUID(),
      status: CardStatus.new,
      learningStepsCompleted: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lapses: 0,
      dueAt: now,
      createdAt: now,
      updatedAt: now
    }
    cards.value = [...cards.value, newDeck]
    return newDeck
  }

  function removeCard(id: string): void {
    cards.value = cards.value.filter(c => c.id !== id)
  }

  function removeCards(ids: string[]): void {
    cards.value = cards.value.filter(c => !ids.includes(c.id))
  }

  function togglePin(cardId: string): void {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.isPinned = !card.isPinned
    }
  }

  function getCardsByDeckId(deckId: string): ICard[] {
    return cards.value.filter(c => c.deckId === deckId)
  }

  return {
    isLoading,
    cards,
    addCard,
    removeCard,
    removeCards,
    togglePin,
    getCardsByDeckId
  }
})
