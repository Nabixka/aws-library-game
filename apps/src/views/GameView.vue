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
  <main class="subpage character-library-page" :class="`theme-${game.theme}`">
    <header class="site-header catalog-header">
      <button class="brand" type="button" @click="navigate('/')">
        <span class="brand-mark">A</span>
        <span>ASTER<span class="brand-light"> / LIBRARY</span></span>
      </button>
      <nav class="catalog-nav" aria-label="Navigasi utama">
        <span class="catalog-nav-active">Characters</span>
        <button class="back-link" type="button" @click="navigate('/')">← All worlds</button>
      </nav>
    </header>

    <section class="world-heading catalog-heading">
      <p class="eyebrow">{{ game.universe }} <span>· CHARACTER ARCHIVE</span></p>
      <h1>{{ game.name }}</h1>
      <p class="world-tagline">{{ game.tagline }}</p>
      <div class="world-rule">
        <span>CHARACTER DATABASE</span>
        <span v-if="!loading && !error">{{ characters.length }} CHARACTERS</span>
      </div>
    </section>

    <section class="character-section" aria-live="polite">
      <div v-if="!loading && !error && characters.length" class="character-toolbar">
        <label class="character-search">
          <span class="search-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Cari karakter</span>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search characters..."
            autocomplete="off"
          />
        </label>
        <span class="character-result-count">
          SHOWING {{ filteredCharacters.length }} OF {{ characters.length }}
        </span>
      </div>

      <div v-if="loading" class="state-panel">
        <span class="loading-mark"></span>
        <p>Memuat arsip karakter...</p>
      </div>
      <div v-else-if="error" class="state-panel state-error">
        <p class="eyebrow">ARSIP BELUM DAPAT DIAKSES</p>
        <p>{{ error }}</p>
        <button class="text-link" type="button" @click="loadCharacters">Coba lagi ↗</button>
      </div>
      <div v-else-if="characters.length === 0" class="state-panel">
        <p>Belum ada karakter di arsip ini.</p>
      </div>
      <div v-else-if="filteredCharacters.length === 0" class="state-panel">
        <p>Tidak ada karakter yang cocok dengan “{{ searchQuery }}”.</p>
      </div>
      <div v-else class="character-grid">
        <button
          v-for="character in filteredCharacters"
          :key="character.id"
          class="character-card"
          type="button"
          @click="navigate(`/${game.slug}/character/${character.id}`)"
        >
          <span class="character-image-wrap">
            <img
              v-if="character.image"
              class="character-image"
              :src="character.image"
              :alt="character.name"
              loading="lazy"
              decoding="async"
            />
            <span v-else class="character-image-fallback">{{ game.shortName }}</span>
            <span class="character-number">#{{ character.id }}</span>
            <span class="character-open" aria-hidden="true">↗</span>
          </span>
          <span class="character-name">{{ character.name }}</span>
          <span class="character-meta">VIEW CHARACTER FILE</span>
        </button>
      </div>
    </section>

    <footer class="site-footer">
      <span>ASTER LIBRARY</span>
      <span>{{ game.shortName }} · {{ game.universe }}</span>
      <button class="footer-link" type="button" @click="navigate('/')">BACK TO WORLDS ↑</button>
    </footer>
  </main>
</template>
