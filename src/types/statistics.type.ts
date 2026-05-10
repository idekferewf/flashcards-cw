export const PERIODS = {
  daily: "daily",
  weekly: "weekly",
  monthly: "monthly"
} as const

export type TPeriod = keyof typeof PERIODS

export interface IRange {
  start: Date
  end: Date
}
