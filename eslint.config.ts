import js from "@eslint/js"
import prettier from "eslint-plugin-prettier/recommended"
import vue from "eslint-plugin-vue"
import { defineConfig } from "eslint/config"
import globals from "globals"
import ts from "typescript-eslint"

export default defineConfig([
  { ignores: ["dist", "build", "coverage"] },

  // =============================
  // ===== Js/Ts Recommended =====
  // =============================
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js },
    extends: ["js/recommended"]
  },
  ts.configs.recommended,

  // ===========================
  // ===== Browser Globals =====
  // ===========================
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    languageOptions: { globals: globals.browser }
  },

  // =============================
  // ===== ESLint Plugin Vue =====
  // =============================
  {
    files: ["**/*.{vue,ts}"],
    plugins: { vue },
    extends: [...vue.configs["flat/recommended"]],
    languageOptions: {
      parserOptions: { parser: ts.parser }
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "no-undef": "off"
    }
  },

  // ====================
  // ===== Prettier =====
  // ====================
  prettier
])
