<script setup>
import { onMounted, ref, watch } from 'vue'
import { getCharacter } from '../api/characters.js'

const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
  characterId: {
    type: String,
    required: true,
  },
  navigate: {
    type: Function,
    required: true,
  },
})

const character = ref(null)
const loading = ref(true)
const error = ref('')

async function loadCharacter() {
  loading.value = true
  error.value = ''

  try {
    character.value = await getCharacter(props.game, props.characterId)
  } catch (requestError) {
    error.value = requestError.message || 'Detail karakter gagal dimuat.'
  } finally {
    loading.value = false
  }
}

const stats = [
  { key: 'base_hp', label: 'BASE HP' },
  { key: 'base_atk', label: 'BASE ATK' },
  { key: 'base_def', label: 'BASE DEF' },
  { key: 'base_spd', label: 'BASE SPD' },
  { key: 'max_energy', label: 'MAX ENERGY' },
]

onMounted(loadCharacter)
watch(() => [props.game.slug, props.characterId], loadCharacter)
</script>

<template>
  <main class="subpage" :class="`theme-${game.theme}`">
    <header class="site-header">
      <button class="brand" type="button" @click="navigate('/')">
        <span class="brand-mark">A</span>
        <span>ASTER<span class="brand-light"> / LIBRARY</span></span>
      </button>
      <button class="back-link" type="button" @click="navigate(`/${game.slug}`)">
        ← {{ game.shortName }} ARCHIVE
      </button>
    </header>

    <div v-if="loading" class="state-panel detail-state">
      <span class="loading-mark"></span>
      <p>Memuat character file...</p>
    </div>
    <div v-else-if="error" class="state-panel state-error detail-state">
      <p class="eyebrow">CHARACTER FILE UNAVAILABLE</p>
      <p>{{ error }}</p>
      <button class="text-link" type="button" @click="loadCharacter">Coba lagi ↗</button>
    </div>
    <section v-else-if="character" class="character-detail">
      <div class="detail-copy">
        <p class="eyebrow">{{ game.universe }} <span>· {{ game.shortName }} CHARACTER FILE</span></p>
        <h1>{{ character.name }}</h1>
        <p class="detail-id">ARCHIVE NO. {{ String(character.id).padStart(4, '0') }}</p>

        <div class="detail-stats">
          <div v-for="stat in stats" :key="stat.key" class="stat-row">
            <span>{{ stat.label }}</span>
            <strong>{{ character[stat.key] ?? '—' }}</strong>
          </div>
        </div>

        <button class="text-link detail-back" type="button" @click="navigate(`/${game.slug}`)">
          ← Kembali ke karakter
        </button>
      </div>
      <div class="detail-art">
        <img
          v-if="character.image"
          :src="character.image"
          :alt="character.name"
        />
        <div v-else class="detail-art-fallback">
          <span>{{ game.shortName }}</span>
          <strong>{{ character.name }}</strong>
        </div>
        <span class="detail-art-label">ASTER ARCHIVE · {{ game.shortName }}</span>
      </div>
    </section>

    <footer class="site-footer">
      <span>ASTER LIBRARY</span>
      <span>{{ game.shortName }} · CHARACTER FILE</span>
      <button class="footer-link" type="button" @click="navigate(`/${game.slug}`)">BACK TO CHARACTERS ↑</button>
    </footer>
  </main>
</template>
