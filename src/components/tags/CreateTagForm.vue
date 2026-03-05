<script setup lang="ts">
import { useTagStore } from "@/store/tag.store"
import type { ITag, ITagView } from "@/types"
import type { FormFieldProps } from "@nuxt/ui"

const props = defineProps<FormFieldProps>()

const tags = defineModel<ITag[]>("tags", { required: true })

const toast = useToast()
const tagStore = useTagStore()

const onSubmit = (tag: ITag) => {
  tags.value.push(tag)
  toast.add({
    title: "Тег успешно добавлен",
    description: "Созданный тег отображён в списке.",
    icon: "i-lucide-circle-check",
    color: "success"
  })
}
</script>

<template>
  <UFormField v-bind="props">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <template v-else #label>
      <div class="inline-flex items-center gap-1.5">
        <UIcon name="i-lucide-tags" class="size-4" />
        Теги
      </div>
    </template>

    <div class="flex flex-wrap items-center gap-2">
      <!-- Tags -->
      <span v-if="!tags.length" class="text-muted text-sm">Теги не добавлены</span>
      <div v-else class="flex flex-wrap items-center gap-1.5 text-xs">
        <Tag v-for="tag in tags" :key="tag.id" :tag="tag" class="pr-1">
          <button
            tabindex="-1"
            type="button"
            class="text-dimmed hover:text-muted hover:bg-primary/10 ml-0.5 inline-flex size-4 translate-y-0.5 items-center justify-center rounded-sm p-0"
            @click="tags = tags.filter((t: ITag) => t.id !== tag.id)"
          >
            <UIcon name="i-lucide-trash-2" />
          </button>
        </Tag>
      </div>
      <!-- /Tags -->

      <!-- Select -->
      <USelectMenu
        v-model="tags as ITagView[]"
        :items="tagStore.tagViews"
        multiple
        size="sm"
        :search-input="{ placeholder: 'Искать...', icon: 'i-lucide-search' }"
        icon="i-lucide-tag"
        variant="outline"
        :ui="{ value: 'hidden' }"
        class="bg-muted/90"
      >
        <template #empty>Ничего не найдено</template>
        <span class="text-dimmed">Выбрать теги</span>
      </USelectMenu>
      <!-- Select -->

      <!-- Create -->
      <TagCreateModal
        description="Тег будет добавлен в колоду после создания."
        exist-description="Вы можете выбрать его в форме создания колоды."
        @submit="onSubmit"
      >
        <UButton label="Добавить тег" icon="i-lucide-plus" variant="soft" color="neutral" size="sm" />
      </TagCreateModal>
      <!-- /Create -->
    </div>
  </UFormField>
</template>
