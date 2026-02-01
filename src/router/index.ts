import { ROUTES } from "@/constants"
import { createRouter, createWebHistory } from "vue-router"

// initialize routes
const routes = [
  {
    name: ROUTES.INDEX.name,
    path: ROUTES.INDEX.path,
    component: () => import("@/pages/Index.vue")
  },
  {
    name: ROUTES.DECKS.name,
    path: ROUTES.DECKS.path,
    component: () => import("@/pages/Decks.vue"),
    props: true,
    children: [
      {
        name: ROUTES.DECKS.children.index.name,
        path: ROUTES.DECKS.children.index.path,
        component: () => import("@/pages/decks/Cards.vue")
      },
      {
        name: ROUTES.DECKS.children.statistics.name,
        path: ROUTES.DECKS.children.statistics.path,
        component: () => import("@/pages/decks/Statistics.vue")
      },
      {
        name: ROUTES.DECKS.children.settings.name,
        path: ROUTES.DECKS.children.settings.path,
        component: () => import("@/pages/decks/Settings.vue")
      }
    ]
  }
]

// initialize router
const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export default router
