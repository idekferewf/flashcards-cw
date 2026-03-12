import { CardsTD } from "@/store/temp-data.ts"
import { CardStatus, type ICard, type TCardCreateDTO, type TCardUpdateDTO } from "@/types"
import { useStorageAsync, type StorageLikeAsync } from "@vueuse/core"
import localforage from "localforage"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useCardStore = defineStore("cards", () => {
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
      interval: 0,
      repetitions: 0,
      lapses: 0,
      dueAt: now,
      createdAt: now,
      updatedAt: now
    }
    cards.value = [...cards.value, newDeck]
    return newDeck
  }

  function updateDeck(id: string, data: TCardUpdateDTO): ICard {
    const card = cards.value.find(d => d.id === id)
    if (!card) throw new Error(`Card with id "${id}" not found`)

    const updatedCard: ICard = {
      ...card,
      ...data,
      updatedAt: new Date().toISOString()
    }
    cards.value = cards.value.map(d => (d.id === id ? updatedCard : d))
    return updatedCard
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

  function getDueCardsByDeckId(deckId: string): ICard[] {
    const now = new Date()
    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)

    const AHEAD_MINUTES = 20
    const aheadTime = new Date(now.getTime() + AHEAD_MINUTES * 60 * 1000)

    return cards.value.filter(c => {
      if (c.deckId !== deckId) return false

      const due = new Date(c.dueAt)
      const status = c.status ?? CardStatus.new

      switch (status) {
        case CardStatus.new:
          return true

        case CardStatus.learning:
        case CardStatus.relearning:
          return due <= aheadTime

        case CardStatus.review:
          return due <= startOfToday
      }
    })
  }

  return {
    isLoading,
    cards,
    addCard,
    updateDeck,
    removeCard,
    removeCards,
    togglePin,
    getCardsByDeckId,
    getDueCardsByDeckId
  }
})
