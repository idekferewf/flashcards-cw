import type { IRepetitionConfig } from "./repetition-config.interface"

export interface IDeck {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string

  isArchived: boolean
  isFavorite: boolean
  tagIds: string[]

  config: IRepetitionConfig
}

export type TDeckCreateDTO = Omit<IDeck, "id" | "createdAt" | "updatedAt">

export type TDeckUpdateDTO = Partial<TDeckCreateDTO>
