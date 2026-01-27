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
    component: () => import("@/pages/Decks.vue")
  }
]

// initialize router
const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export default router
