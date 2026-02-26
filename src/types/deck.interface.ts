export interface IDeck {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string

  isArchived: boolean
  isFavorite: boolean
  tagIds: string[]
}

export type TDeckCreateDTO = Omit<IDeck, "id" | "createdAt" | "updatedAt">
