import { CardStatus, type ICard, type IRepetitionConfig, Rating, type TRating, type TRepetitionResult } from "@/types"

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

function getStep(steps: number[], index: number): number {
  return steps[Math.min(index, steps.length - 1)] ?? steps[0] ?? 1
}

function graduate(card: ICard, isEasy: boolean, config: IRepetitionConfig, now: Date): TRepetitionResult {
  const interval = isEasy ? config.easyInterval : config.graduatingInterval

  return {
    status: CardStatus.review,
    learningStepsCompleted: 0,
    interval,
    easeFactor: card.easeFactor ?? config.startingEase,
    repetitions: (card.repetitions ?? 0) + 1,
    lapses: card.lapses ?? 0,
    dueAt: addDays(now, interval).toISOString()
  }
}

function scheduleLearning(card: ICard, rating: TRating, config: IRepetitionConfig, now: Date): TRepetitionResult {
  const steps = config.learningSteps
  if (!steps.length) {
    return graduate(card, false, config, now)
  }

  const currentStep = card.learningStepsCompleted ?? 0
  const easeFactor = card.easeFactor ?? config.startingEase
  const repetitions = card.repetitions ?? 0
  const lapses = card.lapses ?? 0

  switch (rating) {
    case Rating.again: {
      return {
        status: CardStatus.learning,
        learningStepsCompleted: 0,
        interval: 0,
        easeFactor,
        repetitions,
        lapses,
        dueAt: addMinutes(now, getStep(steps, 0)).toISOString()
      }
    }

    case Rating.hard: {
      let delayMinutes: number
      if (steps.length === 1) {
        delayMinutes = Math.min(getStep(steps, 0) * 1.5, getStep(steps, 0) + 1440)
      } else if (currentStep === 0) {
        delayMinutes = (getStep(steps, 0) + getStep(steps, 1)) / 2
      } else {
        delayMinutes = getStep(steps, currentStep)
      }

      return {
        status: CardStatus.learning,
        learningStepsCompleted: currentStep,
        interval: 0,
        easeFactor,
        repetitions,
        lapses,
        dueAt: addMinutes(now, delayMinutes).toISOString()
      }
    }

    case Rating.good: {
      const nextStep = currentStep + 1
      if (nextStep >= steps.length) {
        return graduate(card, false, config, now)
      }

      return {
        status: CardStatus.learning,
        learningStepsCompleted: nextStep,
        interval: 0,
        easeFactor,
        repetitions,
        lapses,
        dueAt: addMinutes(now, getStep(steps, nextStep)).toISOString()
      }
    }

    case Rating.easy: {
      return graduate(card, true, config, now)
    }
  }
}

export function useCardRepetition(config: IRepetitionConfig) {
  function calculate(card: ICard, rating: TRating, now: Date = new Date()): TRepetitionResult {
    const status = card.status

    if (status === CardStatus.new || status === CardStatus.learning) {
      return scheduleLearning(card, rating, config, now)
    }

    if (status === CardStatus.relearning) {
      // return scheduleRelearning(card, rating, config, now)
      return {} as TRepetitionResult
    }

    // return scheduleReview(card, rating, config, now)
    return {} as TRepetitionResult
  }

  return { calculate }
}
