<script setup lang="ts">
import { useCardRepetition } from "@/composables/use-card-repetition.composable"
import { useLeaveConfirm } from "@/composables/use-leave-confirm.composable"
import { useCardStore } from "@/store/card.store"
import { CardStatus, Rating, type ICard, type IDeck, type TRating, type TRatingPreview } from "@/types"
import { computed, ref } from "vue"

const props = defineProps<{
  deck: IDeck
  cards: ICard[]
}>()

const open = defineModel<boolean>("open", { default: false })

const cardRepetition = useCardRepetition(props.deck.config)
const cardStore = useCardStore()
const { isOpen: isConfirmOpen, onConfirm, onCancel, confirm } = useLeaveConfirm(() => open.value)

const queue = ref<ICard[]>([...props.cards])
const currentIndex = ref<number>(0)
const isFlipped = ref<boolean>(false)
const sessionStats = ref({ again: 0, hard: 0, good: 0, easy: 0 })

const card = computed<ICard | undefined>(() => queue.value[currentIndex.value])
const ratingPreview = computed<TRatingPreview | null>(() => (card.value ? cardRepetition.preview(card.value) : null))
const isFinished = computed<boolean>(() => currentIndex.value >= queue.value.length)

const flip = () => {
  isFlipped.value = true
}

const answer = (rating: TRating) => {
  if (!card.value) return

  const result = cardRepetition.calculate(card.value, rating)
  cardStore.updateDeck(card.value.id, result)

  queue.value[currentIndex.value] = { ...card.value, ...result }
  sessionStats.value[rating]++

  if (result.status === CardStatus.learning || result.status === CardStatus.relearning) {
    queue.value.push({ ...card.value, ...result })
  }

  currentIndex.value++
  isFlipped.value = false
}

const remainingCounts = computed(() => {
  const seen = new Set<string>()
  let newCount = 0
  let learningCount = 0
  let reviewCount = 0

  for (let i = currentIndex.value; i < queue.value.length; i++) {
    const c = queue.value[i] as ICard
    if (seen.has(c.id)) continue
    seen.add(c.id)

    if (c.status === CardStatus.new) newCount++
    else if (c.status === CardStatus.learning || c.status === CardStatus.relearning) learningCount++
    else if (c.status === CardStatus.review) reviewCount++
  }

  return { new: newCount, learning: learningCount, review: reviewCount }
})

const onUpdateOpen = (value: boolean) => {
  if (!value) {
    close()
    return
  }
  open.value = value
}

const close = async () => {
  if (isFinished.value) {
    open.value = false
    return
  }

  const confirmed = await confirm()
  if (confirmed) {
    open.value = false
  }
}
</script>

<template>
  <UModal :open="open" :close="false" fullscreen :ui="{ content: 'divide-none' }" @update:open="onUpdateOpen">
    <slot />

    <template #content>
      <UButton square icon="i-lucide-x" class="absolute top-4 right-4" variant="ghost" @click="close" />

      <!-- Counts -->
      <div class="absolute top-10 left-1/2 flex -translate-x-1/2 items-center gap-3.5">
        <UTooltip text="Новые">
          <UBadge color="info" variant="subtle" class="cursor-default px-2.5">
            <code class="translate-y-px text-sm">{{ remainingCounts.new }}</code>
          </UBadge>
        </UTooltip>
        <UTooltip text="Изучаются / Переучиваются">
          <UBadge color="error" variant="subtle" class="cursor-default px-2.5">
            <code class="translate-y-px text-sm">{{ remainingCounts.learning }}</code>
          </UBadge>
        </UTooltip>
        <UTooltip text="На повторении">
          <UBadge color="neutral" variant="subtle" class="cursor-default px-2.5">
            <code class="translate-y-px text-sm">{{ remainingCounts.review }}</code>
          </UBadge>
        </UTooltip>
      </div>
      <!-- /Counts -->

      <!-- Result -->
      <div v-if="isFinished" class="flex h-full w-full flex-col items-center justify-center">
        <UIcon name="i-lucide-party-popper" class="size-44" />
        <p class="text-default mt-8 text-2xl font-medium">Повторение завершено!</p>
        <div class="border-default mt-8 grid grid-cols-4 grid-rows-2 overflow-hidden rounded-xl border text-sm">
          <div class="border-default border-r border-b px-4 py-3 text-center">Снова</div>
          <div class="border-default border-r border-b px-4 py-3 text-center">Трудно</div>
          <div class="border-default border-r border-b px-4 py-3 text-center">Хорошо</div>
          <div class="border-default border-b px-4 py-3 text-center">Легко</div>
          <div class="border-default border-r px-4 py-3 text-center">{{ sessionStats.again }}</div>
          <div class="border-default border-r px-4 py-3 text-center">{{ sessionStats.hard }}</div>
          <div class="border-default border-r px-4 py-3 text-center">{{ sessionStats.good }}</div>
          <div class="px-4 py-3 text-center">{{ sessionStats.easy }}</div>
        </div>
        <p class="text-muted mt-5 text-sm">Результаты сеанса повторения</p>
        <UButton size="lg" color="neutral" icon="i-lucide-arrow-left" variant="outline" class="mt-10" @click="close">
          Закрыть
        </UButton>
      </div>
      <!-- /Result -->

      <div v-else-if="card" class="flex h-full w-full flex-col items-center justify-center">
        <!-- Question -->
        <p class="text-default max-w-[80%] text-center text-3xl">{{ card.front }}</p>
        <!-- /Question -->

        <USeparator class="my-14 w-60" :ui="{ border: 'border-accented' }" />

        <!-- Answer -->
        <p v-if="isFlipped" class="text-muted dark:text-toned max-w-[80%] text-center text-[22px]">{{ card.back }}</p>
        <!-- /Answer -->

        <!-- Show -->
        <UButton
          v-if="!isFlipped"
          icon="i-lucide-eye"
          size="lg"
          color="neutral"
          variant="outline"
          class="rounded-lg px-4 py-3 font-medium"
          @click="flip"
        >
          Показать ответ
        </UButton>
        <!-- /Show -->

        <!-- Answer buttons -->
        <div v-if="isFlipped" class="mt-[88px] grid grid-cols-2 gap-3">
          <UButton
            size="xl"
            color="error"
            variant="subtle"
            class="w-52 justify-center rounded-2xl px-4 py-5 font-medium"
            @click="answer(Rating.again)"
          >
            Снова
            <UKbd color="error" variant="subtle" class="px-1.5 text-xs lowercase">{{ ratingPreview?.again }}</UKbd>
          </UButton>
          <UButton
            size="xl"
            color="neutral"
            variant="subtle"
            class="w-52 justify-center rounded-2xl px-4 py-5 font-medium"
            @click="answer(Rating.hard)"
          >
            Трудно
            <UKbd color="neutral" variant="subtle" class="bg-accented/90 px-1.5 text-xs lowercase">{{
              ratingPreview?.hard
            }}</UKbd>
          </UButton>
          <UButton
            size="xl"
            color="success"
            variant="subtle"
            class="w-52 justify-center rounded-2xl px-4 py-5 font-medium"
            @click="answer(Rating.good)"
          >
            Хорошо
            <UKbd color="success" variant="subtle" class="px-1.5 text-xs lowercase">{{ ratingPreview?.good }}</UKbd>
          </UButton>
          <UButton
            size="xl"
            color="info"
            variant="subtle"
            class="w-52 justify-center rounded-2xl px-4 py-5 font-medium"
            @click="answer(Rating.easy)"
          >
            Легко
            <UKbd color="info" variant="subtle" class="px-1.5 text-xs lowercase">{{ ratingPreview?.easy }}</UKbd>
          </UButton>
        </div>
        <!-- /Answer buttons -->
      </div>

      <LeaveConfirmModal
        :open="isConfirmOpen"
        title="Завершить повторение?"
        description="Прогресс повторённых карточек будет сохранён."
        cancel-label="Продолжить"
        confirm-label="Завершить"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </template>
  </UModal>
</template>
