export interface IRepetitionConfig {
  learningSteps: number[] // минуты, default: [1, 10]
  relearningSteps: number[] // минуты, default: [10]
  graduatingInterval: number // дни, default: 1
  easyInterval: number // дни, default: 4
  startingEase: number // проценты (250 = 2.5x), default: 250
  easyBonus: number // default: 1.3
  hardInterval: number // default: 1.2
  intervalModifier: number // default: 1.0
  newInterval: number // множитель интервала после провала, default: 0.0
  minimumInterval: number // дни, default: 1
  maximumInterval: number // дни, default: 36500
}
