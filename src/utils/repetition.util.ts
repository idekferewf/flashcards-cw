import type { ICard } from "@/types"

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

export function getStep(steps: number[], index: number): number {
  return steps[Math.min(index, steps.length - 1)] ?? steps[0] ?? 1
}

export function clampInterval(next: number, prev: number, max: number): number {
  return Math.min(max, Math.max(prev + 1, next))
}

export function calculateOverdueBonus(card: ICard, now: Date): number {
  if (!card.dueAt) return 0
  const overdueDays = (now.getTime() - new Date(card.dueAt).getTime()) / (1000 * 60 * 60 * 24)
  return Math.max(0, overdueDays)
}

export function formatDelay(minutes: number): string {
  if (minutes < 1) return "меньше 1 мин."
  if (minutes < 60) return `${Math.round(minutes)} мин.`
  if (minutes < 1440) return `${Math.round(minutes / 60)} час.`
  if (minutes < 43200) return `${Math.round(minutes / 1440)} дн.`
  if (minutes < 525600) return `${Math.round(minutes / 43200)} мес.`
  return `${Math.round(minutes / 525600)}г`
}
