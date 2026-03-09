import type { ICard } from "./card.interface"

export const Rating = {
  again: "again",
  hard: "hard",
  good: "good",
  easy: "easy"
} as const

export type TRating = (typeof Rating)[keyof typeof Rating]

export type TRepetitionResult = Pick<
  ICard,
  "status" | "learningStepsCompleted" | "interval" | "easeFactor" | "repetitions" | "lapses" | "dueAt"
>
