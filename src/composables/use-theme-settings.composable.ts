import {
  DEFAULT_NEUTRAL_THEME,
  THEME_COLOR_MODE,
  THEME_FONT_DEFAULT,
  THEME_NEUTRAL_DEFAULT,
  THEME_RADIUS_DEFAULT
} from "@/constants"
import { useColorMode, useStorage } from "@vueuse/core"
import { watch } from "vue"

const shades = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const

export function useThemeSettings() {
  const appConfig = useAppConfig()
  const colorMode = useColorMode()

  const savedNeutral = useStorage<string>("theme:neutral", THEME_NEUTRAL_DEFAULT)
  const savedRadius = useStorage<string>("theme:radius", THEME_RADIUS_DEFAULT)
  const savedFont = useStorage<string>("theme:font", THEME_FONT_DEFAULT)

  const root = document.documentElement

  function applyNeutral(color: string) {
    if (color !== THEME_NEUTRAL_DEFAULT) {
      appConfig.ui.colors.neutral = color
      shades.forEach(shade => {
        root.style.removeProperty(`--ui-color-neutral-${shade}`)
      })
      return
    }

    const palette = colorMode.value === THEME_COLOR_MODE.dark ? DEFAULT_NEUTRAL_THEME.dark : DEFAULT_NEUTRAL_THEME.light
    shades.forEach(shade => {
      root.style.setProperty(`--ui-color-neutral-${shade}`, palette[shade])
    })
  }

  function applyRadius(radius: string) {
    root.style.setProperty("--ui-radius", radius)
  }

  function applyFont(font: string) {
    root.style.setProperty("--font-sans", font)
  }

  function setNeutral(color: string) {
    savedNeutral.value = color
    applyNeutral(color)
  }

  function setRadius(radius: string) {
    savedRadius.value = radius
    applyRadius(radius)
  }

  function setFont(font: string) {
    savedFont.value = font
    applyFont(font)
  }

  function applyStoredSettings() {
    applyNeutral(savedNeutral.value)
    applyRadius(savedRadius.value)
    applyFont(savedFont.value)
  }

  watch(
    () => colorMode.value,
    () => {
      if (savedNeutral.value === THEME_NEUTRAL_DEFAULT) {
        applyNeutral(THEME_NEUTRAL_DEFAULT)
      }
    }
  )

  return {
    savedNeutral,
    savedRadius,
    savedFont,
    setNeutral,
    setRadius,
    setFont,
    applyStoredSettings
  }
}
