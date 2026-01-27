export const CardStatus = {
  new: "new",
  learning: "learning",
  review: "review",
  relearning: "relearning"
} as const

export type CardStatus = (typeof CardStatus)[keyof typeof CardStatus]

export interface Card {
  id: string
  deckId: string
  front: string
  back: string
  tags?: string[]

  status: CardStatus
  learningStepsCompleted: number

  interval: number
  easeFactor: number
  repetitions: number
  lapses: number

  dueAt: string
  createdAt: string
  updatedAt: string
}
