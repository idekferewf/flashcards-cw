export type TTagColor = "info" | "success" | "warning" | "error" | "neutral"

export interface ITag {
  id: string
  label: string
  color: TTagColor
}

export type TTagCreate = Omit<ITag, "id">

export interface ITagView extends ITag {
  chip: { color: TTagColor }
}
