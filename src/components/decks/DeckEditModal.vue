<script setup lang="ts">
import { useDeckStore } from "@/store/deck.store.ts"
import { useTagStore } from "@/store/tag.store.ts"
import type { IDeck, ITag, TDeckUpdateDTO } from "@/types"
import { useRegle } from "@regle/core"
import { boolean, maxLength, minLength, required, withMessage } from "@regle/rules"
import { computed, useTemplateRef, watch } from "vue"

const props = defineProps<{
  deck: IDeck
}>()

const open = defineModel<boolean>("open", { default: false })

const deckStore = useDeckStore()
const tagStore = useTagStore()

const descriptionRef = useTemplateRef("description")

const { r$ } = useRegle(
  {
    name: props.deck.name,
    description: props.deck.description ?? "",
    tags: tagStore.getTagsByDeck(props.deck),
    archive: props.deck.isArchived ?? false,
    favorite: props.deck.isFavorite ?? false
  },
  {
    name: {
      required: withMessage(required, "Данное поле обязательно для заполнения."),
      minLength: withMessage(minLength(4), "Минимальная длина названия – 4 символа."),
      maxLength: withMessage(maxLength(100), "Максимальная длина названия – 100 символов.")
    },
    description: {
      minLength: withMessage(minLength(4), "Минимальная длина описания – 6 символов.")
    },
    archive: { boolean },
    favorite: { boolean }
  }
)

const hasChanges = computed<boolean>(() => {
  return (
    r$.$value.name !== props.deck.name ||
    r$.$value.description !== props.deck.description ||
    r$.$value.archive !== props.deck.isArchived ||
    r$.$value.favorite !== props.deck.isFavorite ||
    r$.$value.tags.map(t => t.id).length !== props.deck.tagIds.length ||
    !r$.$value.tags.map(t => t.id).every((value, index) => value === props.deck.tagIds[index])
  )
})

const onSubmit = async () => {
  const { valid, data } = await r$.$validate()
  if (!valid) return

  const deckUpdateDTO: TDeckUpdateDTO = {
    name: data.name,
    description: data.description,
    isFavorite: data.favorite ?? false,
    isArchived: data.archive ?? false,
    tagIds: (data.tags as ITag[]).map(t => t.id)
  }
  deckStore.updateDeck(props.deck.id, deckUpdateDTO)

  close()
}

const close = () => {
  open.value = false
}

watch(
  () => [props.deck, open.value] as const,
  ([deck, open]) => {
    if (!open) return
    r$.$value.name = deck.name
    r$.$value.description = deck.description ?? ""
    r$.$value.tags = tagStore.getTagsByDeck(deck)
    r$.$value.archive = deck.isArchived ?? false
    r$.$value.favorite = deck.isFavorite ?? false
    r$.$reset()
  }
)
</script>

<template>
  <USlideover
    v-model:open="open"
    title="Редактирование колоды"
    description="Измените необходимые поля ниже и сохраните колоду."
    :ui="{ footer: 'justify-end' }"
  >
    <!-- Trigger -->
    <slot />
    <!-- /Trigger -->

    <template #body>
      <UForm :schema="r$" :state="r$.$value" class="space-y-5" @submit="onSubmit">
        <!-- Name -->
        <UFormField
          name="name"
          size="lg"
          hint="*"
          label="Название"
          help="Короткое и понятное имя, по которому вы сможете быстро найти колоду."
          :ui="{ hint: 'text-error' }"
        >
          <template #label>
            <div class="inline-flex items-center gap-1.5">
              <UIcon name="i-lucide-pencil-line" />
              Название
            </div>
          </template>

          <UInput
            v-model.trim="r$.$value.name"
            autofocus
            placeholder="Введите название"
            class="w-full"
            :ui="{ base: r$.$value.name.length < 100 ? 'pe-16' : 'pe-18' }"
            @keydown.enter.prevent="descriptionRef?.inputRef?.focus()"
          >
            <template #trailing>
              <span class="text-dimmed text-xs">{{ r$.$value.name.length }} / 100</span>
            </template>
          </UInput>
        </UFormField>
        <!-- /Name -->

        <!-- Description -->
        <UFormField name="description" help="Кратко опишите, что именно содержится в колоде.">
          <template #label>
            <div class="inline-flex items-center gap-1.5">
              <UIcon name="i-lucide-letter-text" class="size-4" />
              Описание
            </div>
          </template>
          <UInput
            ref="description"
            v-model.trim="r$.$value.description"
            size="lg"
            placeholder="Укажите описание"
            class="w-full"
          />
        </UFormField>
        <!-- /Description -->

        <!-- Tags -->
        <CreateTagForm v-model:tags="r$.$value.tags" />
        <!-- /Tags -->

        <USeparator />

        <p class="text-default block text-sm font-medium">Дополнительно</p>

        <!-- Favorite -->
        <USwitch
          v-model="r$.$value.favorite"
          checked-icon="i-lucide-check"
          size="lg"
          label="Добавить в избранное?"
          description="Колода будет добавлена в избранное."
          class="mt-5"
        />
        <!-- /Favorite -->

        <!-- Archive -->
        <USwitch
          v-model="r$.$value.archive"
          checked-icon="i-lucide-check"
          size="lg"
          label="Добавить в архив?"
          description="Будет архивирована после сохранения."
          class="mt-5"
        />
        <!-- /Archive -->

        <UButton type="submit" class="invisible hidden" />
      </UForm>
    </template>

    <template #footer>
      <UButton size="lg" label="Отмена" variant="outline" color="neutral" @click="close" />
      <UButton size="lg" label="Сохранить" color="neutral" :disabled="!hasChanges || !r$.$correct" @click="onSubmit" />
    </template>
  </USlideover>
</template>
