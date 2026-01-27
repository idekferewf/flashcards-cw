export type TTagColor = "info" | "success" | "warning" | "error" | "neutral"

export interface ITag {
  id: number
  label: string
  color: TTagColor
}

export interface IDeck {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string

  isArchived: boolean
  isFavorite: boolean
  tags: ITag[]
}
