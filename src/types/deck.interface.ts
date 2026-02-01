import type { ITag } from "@/types"

export interface IDeck {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string

  isArchived: boolean
  isFavorite: boolean
  tags: ITag[]
}
