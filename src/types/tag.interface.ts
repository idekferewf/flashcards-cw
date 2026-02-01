export type TTagColor = "info" | "success" | "warning" | "error" | "neutral"

export interface ITag {
  id: number
  label: string
  color: TTagColor
}
