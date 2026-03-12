import {
  CardStatus,
  type ICard,
  type IRepetitionConfig,
  Rating,
  type TRating,
  type TRatingPreview,
  type TRepetitionResult
} from "@/types"
import { addDays, addMinutes, calculateOverdueBonus, clampInterval, formatDelay, getStep } from "@/utils/repetition.util"

function graduate(card: ICard, isEasy: boolean, config: IRepetitionConfig, now: Date): TRepetitionResult {
  const interval = isEasy ? config.easyInterval : config.graduatingInterval

  return {
    status: CardStatus.review,
    learningStepsCompleted: 0,
    interval,
    easeFactor: card.easeFactor,
    repetitions: card.repetitions + 1,
    lapses: card.lapses,
    dueAt: addDays(now, interval).toISOString()
  }
}

function scheduleLearning(card: ICard, rating: TRating, config: IRepetitionConfig, now: Date): TRepetitionResult {
  const steps = config.learningSteps
  if (!steps.length) {
    return graduate(card, false, config, now)
  }

  const currentStep = card.learningStepsCompleted
  const easeFactor = card.easeFactor
  const repetitions = card.repetitions
  const lapses = card.lapses

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

function scheduleReview(card: ICard, rating: TRating, config: IRepetitionConfig, now: Date): TRepetitionResult {
  const interval = card.interval
  const easeFactor = card.easeFactor
  const repetitions = card.repetitions
  const lapses = card.lapses
  const overdue = calculateOverdueBonus(card, now)

  switch (rating) {
    case Rating.again: {
      const newEase = Math.max(130, easeFactor - 20)
      const newInterval = Math.max(config.minimumInterval, Math.round(interval * config.newInterval))
      const steps = config.relearningSteps

      return {
        status: CardStatus.relearning,
        learningStepsCompleted: 0,
        interval: newInterval,
        easeFactor: newEase,
        repetitions,
        lapses: lapses + 1,
        dueAt:
          steps.length > 0 ? addMinutes(now, getStep(steps, 0)).toISOString() : addDays(now, config.minimumInterval).toISOString()
      }
    }

    case Rating.hard: {
      const newEase = Math.max(130, easeFactor - 15)
      const newInterval = clampInterval(
        Math.round((interval + overdue / 4) * config.hardInterval * config.intervalModifier),
        interval,
        config.maximumInterval
      )

      return {
        status: CardStatus.review,
        learningStepsCompleted: 0,
        interval: newInterval,
        easeFactor: newEase,
        repetitions,
        lapses,
        dueAt: addDays(now, newInterval).toISOString()
      }
    }

    case Rating.good: {
      const newInterval = clampInterval(
        Math.round((interval + overdue / 2) * (easeFactor / 100) * config.intervalModifier),
        interval,
        config.maximumInterval
      )

      return {
        status: CardStatus.review,
        learningStepsCompleted: 0,
        interval: newInterval,
        easeFactor,
        repetitions,
        lapses,
        dueAt: addDays(now, newInterval).toISOString()
      }
    }

    case Rating.easy: {
      const newEase = easeFactor + 15
      const newInterval = clampInterval(
        Math.round((interval + overdue) * (easeFactor / 100) * config.easyBonus * config.intervalModifier),
        interval,
        config.maximumInterval
      )

      return {
        status: CardStatus.review,
        learningStepsCompleted: 0,
        interval: newInterval,
        easeFactor: newEase,
        repetitions,
        lapses,
        dueAt: addDays(now, newInterval).toISOString()
      }
    }
  }
}

function scheduleRelearning(card: ICard, rating: TRating, config: IRepetitionConfig, now: Date): TRepetitionResult {
  const steps = config.relearningSteps
  const currentStep = card.learningStepsCompleted
  const easeFactor = card.easeFactor
  const repetitions = card.repetitions
  const lapses = card.lapses
  const savedInterval = card.interval

  switch (rating) {
    case Rating.again: {
      return {
        status: CardStatus.relearning,
        learningStepsCompleted: 0,
        interval: savedInterval,
        easeFactor,
        repetitions,
        lapses,
        dueAt:
          steps.length > 0 ? addMinutes(now, getStep(steps, 0)).toISOString() : addDays(now, config.minimumInterval).toISOString()
      }
    }

    case Rating.hard: {
      const delayMinutes = getStep(steps, currentStep)

      return {
        status: CardStatus.relearning,
        learningStepsCompleted: currentStep,
        interval: savedInterval,
        easeFactor,
        repetitions,
        lapses,
        dueAt: addMinutes(now, delayMinutes).toISOString()
      }
    }

    case Rating.good: {
      const nextStep = currentStep + 1
      if (nextStep >= steps.length) {
        const newInterval = Math.max(config.minimumInterval, savedInterval)
        return {
          status: CardStatus.review,
          learningStepsCompleted: 0,
          interval: newInterval,
          easeFactor,
          repetitions: repetitions + 1,
          lapses,
          dueAt: addDays(now, newInterval).toISOString()
        }
      }

      return {
        status: CardStatus.relearning,
        learningStepsCompleted: nextStep,
        interval: savedInterval,
        easeFactor,
        repetitions,
        lapses,
        dueAt: addMinutes(now, getStep(steps, nextStep)).toISOString()
      }
    }

    case Rating.easy: {
      const newInterval = Math.max(config.minimumInterval, Math.round(savedInterval * config.easyBonus))
      return {
        status: CardStatus.review,
        learningStepsCompleted: 0,
        interval: newInterval,
        easeFactor,
        repetitions: repetitions + 1,
        lapses,
        dueAt: addDays(now, newInterval).toISOString()
      }
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
      return scheduleRelearning(card, rating, config, now)
    }

    return scheduleReview(card, rating, config, now)
  }

  function preview(card: ICard, now: Date = new Date()): TRatingPreview {
    const ratings: TRating[] = [Rating.again, Rating.hard, Rating.good, Rating.easy]

    return Object.fromEntries(
      ratings.map(rating => {
        const result = calculate(card, rating, now)
        const diffMinutes = (new Date(result.dueAt).getTime() - now.getTime()) / 60000
        return [rating, formatDelay(diffMinutes)]
      })
    ) as TRatingPreview
  }

  return { calculate, preview }
}
