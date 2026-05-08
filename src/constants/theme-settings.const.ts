export const THEME_NEUTRAL_DEFAULT = "default"
export const THEME_RADIUS_DEFAULT = "0.25rem"
export const THEME_FONT_DEFAULT = "Lora, serif"

export const DEFAULT_NEUTRAL_THEME = {
  light: {
    50: "oklch(98.5% 0 0)",
    100: "oklch(97% 0 0)",
    200: "oklch(94% 0 0)",
    300: "oklch(87% 0 0)",
    400: "oklch(70.8% 0 0)",
    500: "oklch(55.6% 0 0)",
    600: "oklch(43.9% 0 0)",
    700: "oklch(37.1% 0 0)",
    800: "oklch(26.9% 0 0)",
    900: "oklch(20.5% 0 0)",
    950: "oklch(14.5% 0 0)"
  },
  dark: {
    50: "#f4f5f6",
    100: "#e6e7e9",
    200: "#cbcdd1",
    300: "#a1a4aa",
    400: "#7a7e85",
    500: "#5a5e66",
    600: "#3f4248",
    700: "#2a2d32",
    800: "#15171a",
    900: "#070707",
    950: "#030303"
  }
} as const

export const THEME_COLOR_MODE = {
  dark: "dark",
  light: "light"
} as const
