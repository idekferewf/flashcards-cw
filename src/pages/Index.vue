<script setup lang="ts">
import { ROUTES } from "@/constants"
import { useRouter } from "vue-router"

const router = useRouter()
router.push({ name: ROUTES.DECKS.name })
</script>

<template>
  <div>Главная</div>
</template>
