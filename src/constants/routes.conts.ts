const DECKS_BASE_PATH = "/decks"

export const ROUTES = {
  INDEX: {
    name: "index",
    path: "/"
  },
  DECKS: {
    name: "decks",
    path: DECKS_BASE_PATH,
    children: {
      index: {
        name: "decks-index",
        path: ":deckId",
        fullPath: (id: string) => `${DECKS_BASE_PATH}/${id}`
      },
      statistics: {
        name: "decks-statistics",
        path: ":deckId/statistics",
        fullPath: (id: string) => `${DECKS_BASE_PATH}/${id}/statistics`
      },
      settings: {
        name: "decks-settings",
        path: ":deckId/settings",
        fullPath: (id: string) => `${DECKS_BASE_PATH}/${id}/settings`
      }
    }
  }
} as const
