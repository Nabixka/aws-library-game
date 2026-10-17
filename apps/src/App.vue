<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import CharacterView from './views/CharacterView.vue'
import GameView from './views/GameView.vue'
import HomeView from './views/HomeView.vue'
import AuthView from './views/AuthView.vue'
import { games } from './data/games.js'

const currentPath = ref(window.location.pathname)
const isAuthenticated = ref(false)

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

function onAuthenticated() {
  isAuthenticated.value = true
  navigate('/')
}

onMounted(() => window.addEventListener('popstate', syncPath))
onUnmounted(() => window.removeEventListener('popstate', syncPath))
</script>

<template>
  <AuthView v-if="!isAuthenticated" @authenticated="onAuthenticated" />
  <template v-else>
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
    <main v-else class="grid min-h-screen place-items-center px-5">
      <section class="max-w-lg rounded-xl border border-line bg-panel p-8 text-center sm:p-12">
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-mint">404 · Page not found</p>
        <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-copy">Sepertinya kamu tersesat.</h1>
        <p class="mt-3 text-sm leading-6 text-muted">Halaman yang kamu cari tidak tersedia di database.</p>
        <button class="mt-7 rounded-lg bg-mint px-4 py-2.5 text-xs font-bold text-ink transition hover:brightness-110" type="button" @click="navigate('/')">
          ← Kembali ke library
        </button>
      </section>
    </main>
  </template>
</template>
