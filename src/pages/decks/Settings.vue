<script setup lang="ts">
import { ROUTES } from "@/constants"
import { useDeckStore } from "@/store/deck.store"
import type { IDeck, TDeckUpdateDTO } from "@/types"
import type { TabsItem } from "@nuxt/ui"
import { useRegle, type Maybe } from "@regle/core"
import { integer, maxValue, minValue, required, withMessage } from "@regle/rules"
import { computed } from "vue"

const props = defineProps<{
  deck: IDeck
}>()

const toast = useToast()
const deckStore = useDeckStore()

const validSteps = (value: Maybe<number[]>) => {
  if (!Array.isArray(value) || !value.length) return false
  return value.every(s => {
    const n = Number(s)
    return Number.isInteger(n) && n >= 1
  })
}

const { r$ } = useRegle(
  {
    learningSteps: [...props.deck.config.learningSteps],
    relearningSteps: [...props.deck.config.relearningSteps],
    graduatingInterval: props.deck.config.graduatingInterval,
    easyInterval: props.deck.config.easyInterval,
    startingEase: props.deck.config.startingEase,
    easyBonus: props.deck.config.easyBonus,
    hardInterval: props.deck.config.hardInterval,
    intervalModifier: props.deck.config.intervalModifier,
    newInterval: props.deck.config.newInterval,
    minimumInterval: props.deck.config.minimumInterval,
    maximumInterval: props.deck.config.maximumInterval
  },
  {
    learningSteps: {
      required: withMessage(required, "Добавьте хотя бы один шаг обучения."),
      validSteps: withMessage(validSteps, "Шаги должны быть целыми числами (например: 1, 10).")
    },
    relearningSteps: {
      required: withMessage(required, "Укажите хотя бы один шаг переобучения."),
      validSteps: withMessage(validSteps, "Шаги должны быть целыми числами (например: 10, 20).")
    },
    graduatingInterval: {
      required: withMessage(required, "Данное поле обязательно для заполнения."),
      integer: withMessage(integer, "Интервал должен быть целым числом."),
      minValue: withMessage(minValue(1), "Минимальное значение – 1."),
      maxGraduating: withMessage(
        (value: Maybe<number>): boolean => (value ?? 0) < r$.$value.easyInterval,
        "Интервал выпуска не может быть больше или равен интервалу «Легко»."
      )
    },
    easyInterval: {
      required: withMessage(required, "Данное поле обязательно для заполнения."),
      integer: withMessage(integer, "Интервал должен быть целым числом."),
      minValue: withMessage(minValue(1), "Минимальное значение – 1."),
      minEasy: withMessage(
        (value: Maybe<number>): boolean => (value ?? 0) >= r$.$value.graduatingInterval,
        "Интервал не может быть меньше интервала выпуска."
      )
    },
    startingEase: {
      required: withMessage(required, "Данное поле обязательно для заполнения."),
      integer: withMessage(integer, "Значение должно быть целым числом."),
      minValue: withMessage(minValue(130), "Минимальное значение – 130%."),
      maxValue: withMessage(maxValue(450), "Максимальное значение – 450%.")
    },
    easyBonus: {
      required: withMessage(required, "Данное поле обязательно для заполнения."),
      minValue: withMessage(minValue(1), "Минимальное значение – 1,0."),
      maxValue: withMessage(maxValue(5), "Максимальное значение – 5,0.")
    },
    hardInterval: {
      required: withMessage(required, "Данное поле обязательно для заполнения."),
      minValue: withMessage(minValue(1), "Минимальное значение – 1,0."),
      maxValue: withMessage(maxValue(1.5), "Максимальное значение – 1,5.")
    },
    intervalModifier: {
      required: withMessage(required, "Данное поле обязательно для заполнения."),
      minValue: withMessage(minValue(0.1), "Минимальное значение – 0,1."),
      maxValue: withMessage(maxValue(5), "Максимальное значение – 5,0.")
    },
    newInterval: {
      required: withMessage(required, "Данное поле обязательно для заполнения."),
      minValue: withMessage(minValue(0), "Минимальное значение – 0,0 (полный сброс)."),
      maxValue: withMessage(maxValue(1), "Максимальное значение – 1,0. (без изменений).")
    },
    minimumInterval: {
      required: withMessage(required, "Данное поле обязательно для заполнения."),
      integer: withMessage(integer, "Интервал должен быть целым числом."),
      minValue: withMessage(minValue(1), "Минимальное значение – 1."),
      maxMin: withMessage(
        (value: Maybe<number>): boolean => (value ?? 0) < r$.$value.maximumInterval,
        "Интервал не может быть больше максимального."
      )
    },
    maximumInterval: {
      required: withMessage(required, "Данное поле обязательно для заполнения."),
      integer: withMessage(integer, "Интервал должен быть целым числом."),
      minValue: withMessage(minValue(1), "Минимальное значение – 1."),
      minMax: withMessage(
        (value: Maybe<number>): boolean => (value ?? 0) >= r$.$value.minimumInterval,
        "Интервал не может быть меньше минимального."
      )
    }
  }
)

const hasChanges = computed<boolean>(() => {
  const c = props.deck.config
  const v = r$.$value

  const stepsChanged = (a: unknown[], b: number[]): boolean => {
    const aArr = Array.from(a).map(Number)
    const bArr = Array.from(b).map(Number)
    if (aArr.length !== bArr.length) return true
    return aArr.some((n, i) => n !== bArr[i])
  }

  return (
    stepsChanged(v.learningSteps, c.learningSteps) ||
    stepsChanged(v.relearningSteps, c.relearningSteps) ||
    v.graduatingInterval !== c.graduatingInterval ||
    v.easyInterval !== c.easyInterval ||
    v.startingEase !== c.startingEase ||
    v.easyBonus !== c.easyBonus ||
    v.hardInterval !== c.hardInterval ||
    v.intervalModifier !== c.intervalModifier ||
    v.newInterval !== c.newInterval ||
    v.minimumInterval !== c.minimumInterval ||
    v.maximumInterval !== c.maximumInterval
  )
})

const onSubmit = async () => {
  const { valid, data } = await r$.$validate()
  if (!valid) return

  const deckUpdateDTO: TDeckUpdateDTO = { config: { ...data } }
  deckStore.updateDeck(props.deck.id, deckUpdateDTO)

  toast.add({
    title: "Настройки успешно сохранены",
    icon: "i-lucide-circle-check",
    color: "success"
  })
}

const items: TabsItem[] = [
  {
    label: "Новые (изучаемые)",
    slot: "learning" as const
  },
  {
    label: "Провалы",
    slot: "lapses" as const
  },
  {
    label: "Коэффициент лёгкости",
    slot: "easeFactor" as const
  },
  {
    label: "Интервалы",
    slot: "intervals" as const
  }
]
</script>

<template>
  <UForm :schema="r$" :state="r$.$value" @submit="onSubmit">
    <UTabs
      :items="items"
      class="w-full"
      orientation="vertical"
      :ui="{
        root: 'items-start gap-x-8',
        list: 'bg-transparent gap-1 items-start min-w-[230px]',
        trigger:
          'w-full rounded-lg py-2.5 px-3 hover:data-[state=inactive]:not-disabled:bg-muted dark:hover:data-[state=inactive]:not-disabled:bg-muted/75 hover:data-[state=inactive]:not-disabled:text-default data-[state=active]:text-default',
        indicator: 'rounded-lg bg-accented/60'
      }"
    >
      <!-- Learning -->
      <template #learning>
        <h2 class="text-default text-base font-medium">Изучение карточки</h2>
        <p class="text-muted mt-0.5 text-[13px]">Настройки показа новых карточек до перехода в обычные повторения.</p>
        <USeparator class="mt-4" />

        <UFormField
          name="learningSteps"
          label="Шаги изучения (минуты)"
          size="lg"
          help="Задержки между показами новой карточки во время изучения."
          class="mt-8"
        >
          <UInputTags
            v-model="r$.$value.learningSteps"
            duplicate
            placeholder="Добавить шаг..."
            delete-icon="i-lucide-trash"
            class="w-full"
          />
        </UFormField>

        <UFormField
          name="graduatingInterval"
          label="Интервал выпуска (дни)"
          size="lg"
          help="Первый интервал повторения после завершения изучения."
          class="mt-6"
        >
          <UInputNumber v-model="r$.$value.graduatingInterval" :min="1" :step="1" placeholder="1" class="w-full" />
        </UFormField>

        <UFormField
          name="easyInterval"
          label="Интервал «Легко» (дни)"
          size="lg"
          help="Интервал при ответе «Легко» на этапе изучения."
          class="mt-6"
        >
          <UInputNumber v-model="r$.$value.easyInterval" :min="1" :step="1" placeholder="4" class="w-full" />
        </UFormField>
      </template>
      <!-- /Learning -->

      <!-- lapses -->
      <template #lapses>
        <h2 class="text-default text-base font-medium">Провалы в ответах</h2>
        <p class="text-muted mt-0.5 text-[13px]">Параметры переобучения после ошибки.</p>
        <USeparator class="mt-4" />

        <UFormField
          name="relearningSteps"
          label="Шаги переобучения (минуты)"
          size="lg"
          help="Интервалы повторения после неправильного ответа."
          class="mt-8"
        >
          <UInputTags
            v-model="r$.$value.relearningSteps"
            duplicate
            placeholder="Добавить шаг..."
            delete-icon="i-lucide-trash"
            class="w-full"
          />
        </UFormField>

        <UFormField
          name="newInterval"
          label="Новый интервал после провала"
          size="lg"
          help="Определяет, насколько уменьшится текущий интервал после ошибки."
          class="mt-6"
        >
          <UInputNumber
            v-model="r$.$value.newInterval"
            :min="0"
            :max="1"
            :step="0.05"
            placeholder="0.0"
            class="w-full"
            :format-options="{
              minimumFractionDigits: 2,
              style: 'decimal'
            }"
          />
        </UFormField>

        <UFormField
          name="minimumInterval"
          label="Минимальный интервал (дни)"
          size="lg"
          help="Минимальный интервал после выхода из переобучения."
          class="mt-6"
        >
          <UInputNumber v-model="r$.$value.minimumInterval" :min="1" :step="1" placeholder="1" class="w-full" />
        </UFormField>
      </template>
      <!-- /Lapses -->

      <!-- Ease Factor -->
      <template #easeFactor>
        <h2 class="text-default text-base font-medium">Коэффициент лёгкости</h2>
        <p class="text-muted mt-0.5 text-[13px]">Параметры, влияющие на рост интервалов повторения.</p>
        <USeparator class="mt-4" />

        <UFormField
          name="startingEase"
          label="Начальный множитель «Легко» (%)"
          size="lg"
          help="Начальный множитель, применяемый к новым карточкам."
          class="mt-8"
        >
          <UInputNumber v-model="r$.$value.startingEase" :min="130" :max="450" :step="5" placeholder="250" class="w-full" />
        </UFormField>

        <UFormField
          name="easyBonus"
          label="Бонус «Легко»"
          size="lg"
          help="Дополнительный множитель при выборе «Легко»."
          class="mt-6"
        >
          <UInputNumber
            v-model="r$.$value.easyBonus"
            :min="1.0"
            :max="5.0"
            :step="0.1"
            placeholder="1.3"
            class="w-full"
            :format-options="{
              minimumFractionDigits: 1,
              style: 'decimal'
            }"
          />
        </UFormField>

        <UFormField
          name="hardInterval"
          label="Интервал «Трудно»"
          size="lg"
          help="Множитель интервала при выборе «Трудно»."
          class="mt-6"
        >
          <UInputNumber
            v-model="r$.$value.hardInterval"
            :min="1"
            :max="1.5"
            :step="0.05"
            placeholder="1.2"
            class="w-full"
            :format-options="{
              minimumFractionDigits: 2,
              style: 'decimal'
            }"
          />
        </UFormField>
      </template>
      <!-- /Ease Factor -->

      <!-- Intervals -->
      <template #intervals>
        <h2 class="text-default text-base font-medium">Интервалы</h2>
        <p class="text-muted mt-0.5 text-[13px]">Параметры, влияющие на итоговые интервалы повторений.</p>
        <USeparator class="mt-4" />

        <UFormField
          name="intervalModifier"
          label="Модификатор интервала"
          size="lg"
          help="Умножает все интервалы повторения."
          class="mt-8"
        >
          <UInputNumber
            v-model="r$.$value.intervalModifier"
            :min="0.1"
            :max="5"
            :step="0.1"
            placeholder="1.0"
            class="w-full"
            :format-options="{
              minimumFractionDigits: 1,
              style: 'decimal'
            }"
          />
        </UFormField>

        <UFormField
          name="maximumInterval"
          label="Максимальный интервал (дни)"
          size="lg"
          help="Ограничивает максимальную задержку между повторениями."
          class="mt-6"
        >
          <div class="flex items-center gap-5">
            <USlider
              v-model="r$.$value.maximumInterval"
              size="sm"
              :min="1"
              :max="36500"
              :step="10"
              :tooltip="{ text: `${r$.$value.maximumInterval} дн.` }"
              class="mt-3.5 mb-2.5 w-full"
            />
            <UInput
              v-model.number="r$.$value.maximumInterval"
              type="number"
              placeholder="36500"
              max="36500"
              min="1"
              step="10"
              class="w-[120px]"
              :ui="{ base: 'pe-8', trailing: 'p-0 pr-3' }"
            >
              <template #trailing>
                <span class="text-dimmed -translate-y-px text-xs">дн.</span>
              </template>
            </UInput>
          </div>
        </UFormField>
      </template>
      <!-- /Intervals -->
    </UTabs>
  </UForm>

  <!-- Footer -->
  <div
    class="border-t-default bg-default absolute bottom-0 left-0 flex w-full items-center justify-end gap-x-2.5 border-t px-[30px] py-4 sm:px-[38px]"
  >
    <UButton
      :to="{ name: ROUTES.DECKS.children.index.name }"
      size="lg"
      label="Вернуться к карточкам"
      icon="i-lucide-arrow-left"
      color="neutral"
      variant="outline"
    />
    <UButton size="lg" label="Сохранить" color="neutral" :disabled="!hasChanges || !r$.$correct" @click="onSubmit" />
  </div>
  <!-- /Footer -->
</template>
