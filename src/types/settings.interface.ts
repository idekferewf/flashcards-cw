export interface Settings {
  deckId: string
  learningSteps: number[] // в минутах, например [1, 10]
  relearningSteps: number[] // тоже в минутах
  graduatingInterval: number // дни
  easyInterval: number // дни
  intervalModifier: number // множитель интервала
  easyBonus: number // множитель при нажатии Easy
  hardIntervalFactor: number // 0.5 например
  minimumInterval: number
  startingEase: number // 2.5 по умолчанию
  maxInterval: number // 36500 например
  maxNewPerDay: number
  maxReviewsPerDay: number
}
