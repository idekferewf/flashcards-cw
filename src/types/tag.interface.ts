export type TTagColor = "info" | "success" | "warning" | "error" | "neutral"

export interface ITag {
  id: string
  label: string
  color: TTagColor
}

export type TTagCreateDTO = Omit<ITag, "id">

export interface ITagView extends ITag {
  chip: { color: TTagColor }
}
