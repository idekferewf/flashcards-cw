import type { IRepetitionConfig } from "@/types"

export const DEFAULT_REPETITION_CONFIG: IRepetitionConfig = {
  learningSteps: [1, 10],
  relearningSteps: [10],
  graduatingInterval: 1,
  easyInterval: 4,
  startingEase: 250,
  easyBonus: 1.3,
  hardInterval: 1.2,
  intervalModifier: 1.0,
  newInterval: 0.0,
  minimumInterval: 1,
  maximumInterval: 36500
}
