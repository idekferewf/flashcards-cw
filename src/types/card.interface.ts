import type { ITag } from "@/types"

export const CardStatus = {
  new: "new",
  learning: "learning",
  review: "review",
  relearning: "relearning"
} as const

export const CardStatusLabels: Record<CardStatus, string> = {
  new: "Новая",
  learning: "Изучается",
  review: "На повторении",
  relearning: "Переучивание"
} as const

export type CardStatus = (typeof CardStatus)[keyof typeof CardStatus]

export interface ICard {
  id: string
  deckId: string
  front: string
  back: string
  tags?: ITag[]

  status?: CardStatus
  learningStepsCompleted?: number

  interval?: number
  easeFactor?: number
  repetitions?: number
  lapses?: number

  dueAt?: string
  createdAt: string
  updatedAt?: string
}
