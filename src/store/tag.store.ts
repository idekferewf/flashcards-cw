import { TagsTD } from "@/store/temp-data.ts"
import type { IDeck, ITag, ITagView, TTagColor, TTagCreateDTO } from "@/types"
import { normalizeLabel } from "@/utils"
import { type StorageLikeAsync, useStorageAsync } from "@vueuse/core"
import localforage from "localforage"
import { defineStore } from "pinia"
import { computed } from "vue"

export const useTagStore = defineStore("tags", () => {
  const tags = useStorageAsync<ITag[]>("tags", [...TagsTD], localforage as StorageLikeAsync)

  const tagMap = computed<Record<string, ITag>>(() => {
    const map: Record<string, ITag> = {}
    for (const t of tags.value) {
      map[t.id] = t
    }
    return map
  })

  const tagViews = computed<ITagView[]>(() => {
    return tags.value.map(t => ({
      ...t,
      chip: { color: t.color }
    }))
  })

  function addTag(data: TTagCreateDTO): ITag {
    const newTag: ITag = { id: crypto.randomUUID(), ...data }
    tags.value = [...tags.value, newTag]
    return newTag
  }

  function getTag(label: string, color?: TTagColor | string): ITag | undefined {
    const normalized = normalizeLabel(label)
    return tags.value.find(t => {
      if (t.label !== normalized) return false
      if (color && t.color !== color) return false
      return true
    })
  }

  function getTagsByDeck(deck: IDeck): ITag[] {
    if (!deck.tagIds?.length) return []

    const result: ITag[] = []
    const map = tagMap.value

    for (const id of deck.tagIds) {
      const tag = map[id]
      if (tag) result.push(tag)
    }

    return result
  }

  function getTagsByDecks(decks: IDeck[]): ITag[] {
    if (!decks?.length) return []

    const unique = new Set<string>()

    for (const d of decks) {
      for (const id of d.tagIds ?? []) {
        unique.add(id)
      }
    }

    const result: ITag[] = []
    const map = tagMap.value

    for (const id of unique) {
      const tag = map[id]
      if (tag) result.push(tag)
    }

    return result
  }

  return {
    tags,
    tagViews,
    addTag,
    getTag,
    getTagsByDeck,
    getTagsByDecks
  }
})
