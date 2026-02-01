import "@/assets/css/index.css"
import { piniaIndexedDbPlugin } from "@/plugins/pinia-indexed-db.plugin.ts"
import router from "@/router"
import ui from "@nuxt/ui/vue-plugin"
import { createPinia } from "pinia"
import { createApp } from "vue"
import App from "./App.vue"

const pinia = createPinia()
pinia.use(piniaIndexedDbPlugin)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ui)

app.mount("#app")
