export const CardStatus = {
  new: "new",
  learning: "learning",
  review: "review",
  relearning: "relearning"
} as const

export const CardStatusLabels: Record<TCardStatus, string> = {
  new: "Новая",
  learning: "Изучается",
  review: "На повторении",
  relearning: "Переучивание"
} as const

export type TCardStatus = (typeof CardStatus)[keyof typeof CardStatus]

export interface ICard {
  id: string
  deckId: string
  front: string
  back: string
  tagIds: string[]
  isPinned?: boolean

  status?: TCardStatus
  learningStepsCompleted?: number
  interval?: number
  easeFactor?: number
  repetitions?: number
  lapses?: number
  dueAt: string

  createdAt: string
  updatedAt?: string
}

export type TCardCreateDTO = Omit<ICard, "id" | "dueAt" | "createdAt" | "updatedAt">

export type TCardUpdateDTO = Partial<TCardCreateDTO>
