<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { getCharacters } from '../api/characters.js'

const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
  navigate: {
    type: Function,
    required: true,
  },
})

const characters = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')

const filteredCharacters = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()
  if (!query) return characters.value

  return characters.value.filter((character) =>
    character.name.toLocaleLowerCase().includes(query),
  )
})

async function loadCharacters() {
  loading.value = true
  error.value = ''

  try {
    const data = await getCharacters(props.game)
    if (!Array.isArray(data)) {
      throw new Error(`Daftar karakter dari API ${props.game.shortName} bukan array.`)
    }
    characters.value = data
  } catch (requestError) {
    error.value = requestError.message || 'Karakter gagal dimuat.'
  } finally {
    loading.value = false
  }
}

onMounted(loadCharacters)
watch(() => props.game.slug, loadCharacters)
</script>

<template>
  <main class="min-h-screen" :style="{ '--game-accent': game.accent }">
    <header class="mx-auto flex h-[72px] max-w-7xl items-center justify-between border-b border-line px-5 sm:px-8">
      <button class="flex items-center gap-3 text-left" type="button" @click="navigate('/')">
        <span class="grid size-9 place-items-center rounded-lg bg-mint text-sm font-black text-ink">A</span>
        <span class="text-sm font-bold tracking-[0.12em] text-copy">ASTER<span class="ml-1 font-normal text-muted">DATABASE</span></span>
      </button>
      <button class="rounded-lg border border-line px-3 py-2 text-xs font-semibold text-muted transition hover:border-copy/40 hover:text-copy" type="button" @click="navigate('/')">
        <span aria-hidden="true">←</span><span class="ml-2">All games</span>
      </button>
    </header>

    <div class="mx-auto max-w-7xl px-5 pb-14 sm:px-8">
      <nav class="flex items-center gap-2 py-5 text-xs text-muted" aria-label="Breadcrumb">
        <button class="transition hover:text-copy" type="button" @click="navigate('/')">Library</button>
        <span aria-hidden="true">/</span>
        <span class="font-semibold" :style="{ color: game.accent }">{{ game.shortName }}</span>
        <span aria-hidden="true">/</span>
        <span>Characters</span>
      </nav>

      <section class="relative isolate overflow-hidden rounded-xl border border-line bg-panel px-5 py-8 sm:px-8 sm:py-10">
        <img class="absolute inset-0 -z-20 h-full w-full object-cover opacity-25" :src="game.image" :alt="`${game.name} world`" :style="{ objectPosition: game.imagePosition }" />
        <span class="absolute inset-0 -z-10 bg-gradient-to-r from-panel via-panel/90 to-panel/45"></span>
        <div class="max-w-2xl">
          <p class="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]" :style="{ color: game.accent }">
            <span class="size-1.5 rounded-full" :style="{ backgroundColor: game.accent }"></span>
            {{ game.universe }} <span class="text-muted">/ CHARACTER DATABASE</span>
          </p>
          <h1 class="text-3xl font-extrabold tracking-[-0.04em] text-copy sm:text-5xl">{{ game.name }}</h1>
          <p class="mt-3 text-sm text-muted">{{ game.tagline }}</p>
        </div>
        <div class="mt-8 flex flex-wrap gap-2">
          <span class="rounded-md border border-white/10 bg-ink/40 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-copy">Character archive</span>
          <span class="rounded-md border border-white/10 bg-ink/40 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted">{{ game.shortName }} database</span>
        </div>
      </section>

      <section class="mt-9" aria-labelledby="characters-title" aria-live="polite">
        <div class="mb-5 flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Browse the roster</p>
            <h2 id="characters-title" class="text-xl font-bold tracking-tight text-copy">Characters</h2>
          </div>
          <div v-if="!loading && !error && characters.length" class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label class="flex h-10 w-full items-center gap-2.5 rounded-lg border border-line bg-panel px-3 text-muted transition focus-within:border-white/30 sm:w-64">
              <svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>
              </svg>
              <span class="sr-only">Cari karakter</span>
              <input v-model="searchQuery" class="min-w-0 flex-1 bg-transparent text-xs text-copy outline-none placeholder:text-muted" type="search" placeholder="Search characters..." autocomplete="off" />
              <kbd class="hidden rounded border border-line px-1.5 py-0.5 text-[9px] sm:block">⌕</kbd>
            </label>
            <span class="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
              {{ filteredCharacters.length }} <span class="font-normal">/ {{ characters.length }} found</span>
            </span>
          </div>
        </div>

        <div v-if="loading" class="grid min-h-56 place-items-center rounded-xl border border-line bg-panel">
          <div class="text-center">
            <span class="mx-auto block size-7 animate-spin rounded-full border-2 border-line border-t-mint"></span>
            <p class="mt-4 text-sm text-muted">Memuat karakter...</p>
          </div>
        </div>
        <div v-else-if="error" class="rounded-xl border border-red-400/20 bg-red-400/[0.05] p-6 sm:p-8">
          <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">Database unavailable</p>
          <p class="mt-2 text-sm text-copy">{{ error }}</p>
          <button class="mt-5 rounded-md border border-red-300/30 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-300/10" type="button" @click="loadCharacters">Try again</button>
        </div>
        <div v-else-if="characters.length === 0" class="rounded-xl border border-line bg-panel p-8 text-center text-sm text-muted">
          Belum ada karakter di database ini.
        </div>
        <div v-else-if="filteredCharacters.length === 0" class="rounded-xl border border-line bg-panel p-8 text-center text-sm text-muted">
          Tidak ada karakter yang cocok dengan “{{ searchQuery }}”.
        </div>
        <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          <button
            v-for="character in filteredCharacters"
            :key="character.id"
            class="group overflow-hidden rounded-xl border border-line bg-panel text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-panel-raised"
            type="button"
            @click="navigate(`/${game.slug}/character/${character.id}`)"
          >
            <span class="relative block aspect-[4/4.8] overflow-hidden bg-panel-raised">
              <img
                v-if="character.image"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                :src="character.image"
                :alt="character.name"
                loading="lazy"
                decoding="async"
              />
              <span v-else class="grid h-full place-items-center text-5xl font-black text-white/10">{{ character.name?.charAt(0) }}</span>
              <span class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent"></span>
              <span class="absolute left-3 top-3 rounded border border-white/15 bg-black/35 px-2 py-1 text-[9px] font-bold tabular-nums text-white/80">#{{ character.id }}</span>
              <span class="absolute bottom-3 right-3 grid size-7 place-items-center rounded-full border border-white/30 bg-black/20 text-sm text-white opacity-0 transition group-hover:opacity-100" aria-hidden="true">↗</span>
            </span>
            <span class="block px-3 pb-3 pt-2.5">
              <span class="block truncate text-sm font-bold text-copy">{{ character.name }}</span>
              <span class="mt-1 block text-[9px] font-semibold uppercase tracking-[0.13em]" :style="{ color: game.accent }">{{ game.shortName }} · Character</span>
            </span>
          </button>
        </div>
      </section>

      <footer class="mt-14 flex flex-col gap-2 border-t border-line pt-5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>ASTER DATABASE</span>
        <span>{{ game.shortName }} · {{ game.universe }}</span>
        <button class="text-left transition hover:text-copy sm:text-right" type="button" @click="navigate('/')">Back to all games ↑</button>
      </footer>
    </div>
  </main>
</template>
