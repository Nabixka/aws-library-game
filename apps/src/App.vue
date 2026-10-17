<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import CharacterView from './views/CharacterView.vue'
import GameView from './views/GameView.vue'
import HomeView from './views/HomeView.vue'
import { games } from './data/games.js'

const currentPath = ref(window.location.pathname)

const route = computed(() => {
  const parts = currentPath.value.split('/').filter(Boolean)
  const game = games.find((item) => item.slug === parts[0])

  if (!parts.length) return { name: 'home' }
  if (!game) return { name: 'not-found' }
  if (parts[1] === 'character' && parts[2]) {
    return { name: 'character', game, characterId: parts[2] }
  }
  if (parts.length === 1) return { name: 'game', game }
  return { name: 'not-found' }
})

function navigate(path) {
  window.history.pushState({}, '', path)
  currentPath.value = window.location.pathname
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function syncPath() {
  currentPath.value = window.location.pathname
}

onMounted(() => window.addEventListener('popstate', syncPath))
onUnmounted(() => window.removeEventListener('popstate', syncPath))
</script>

<template>
  <HomeView v-if="route.name === 'home'" :navigate="navigate" />
  <GameView
    v-else-if="route.name === 'game'"
    :game="route.game"
    :navigate="navigate"
  />
  <CharacterView
    v-else-if="route.name === 'character'"
    :game="route.game"
    :character-id="route.characterId"
    :navigate="navigate"
  />
  <main v-else class="not-found">
    <p class="eyebrow">404 · HALAMAN TIDAK DITEMUKAN</p>
    <h1>Sepertinya kamu tersesat.</h1>
    <button class="text-link" type="button" @click="navigate('/')">
      ← Kembali ke library
    </button>
  </main>
</template>
