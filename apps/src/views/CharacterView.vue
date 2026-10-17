<script setup>
import { computed, onMounted, ref, watch } from 'vue'
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

const stats = computed(() => {
  if (!character.value) return []

  return [
    { key: 'base_hp', label: 'Base HP' },
    { key: 'base_atk', label: 'Base ATK' },
    { key: 'base_def', label: 'Base DEF' },
    { key: 'base_spd', label: 'Base SPD' },
    { key: 'max_energy', label: 'Max Energy' },
  ].filter(({ key }) => character.value[key] !== null && character.value[key] !== undefined)
})

onMounted(loadCharacter)
watch(() => [props.game.slug, props.characterId], loadCharacter)
</script>

<template>
  <main class="min-h-screen" :style="{ '--game-accent': game.accent }">
    <header class="mx-auto flex h-[72px] max-w-7xl items-center justify-between border-b border-line px-5 sm:px-8">
      <button class="flex items-center gap-3 text-left" type="button" @click="navigate('/')">
        <span class="grid size-9 place-items-center rounded-lg bg-mint text-sm font-black text-ink">A</span>
        <span class="text-sm font-bold tracking-[0.12em] text-copy">ASTER<span class="ml-1 font-normal text-muted">DATABASE</span></span>
      </button>
      <button class="rounded-lg border border-line px-3 py-2 text-xs font-semibold text-muted transition hover:border-copy/40 hover:text-copy" type="button" @click="navigate(`/${game.slug}`)">
        <span aria-hidden="true">←</span><span class="ml-2">{{ game.shortName }} characters</span>
      </button>
    </header>

    <div class="mx-auto max-w-7xl px-5 pb-14 sm:px-8">
      <nav class="flex items-center gap-2 py-5 text-xs text-muted" aria-label="Breadcrumb">
        <button class="transition hover:text-copy" type="button" @click="navigate('/')">Library</button>
        <span aria-hidden="true">/</span>
        <button class="transition hover:text-copy" type="button" @click="navigate(`/${game.slug}`)">{{ game.shortName }}</button>
        <span aria-hidden="true">/</span>
        <span>Character profile</span>
      </nav>

      <div v-if="loading" class="grid min-h-[430px] place-items-center rounded-xl border border-line bg-panel">
        <div class="text-center">
          <span class="mx-auto block size-7 animate-spin rounded-full border-2 border-line border-t-mint"></span>
          <p class="mt-4 text-sm text-muted">Memuat profil karakter...</p>
        </div>
      </div>
      <div v-else-if="error" class="rounded-xl border border-red-400/20 bg-red-400/[0.05] p-6 sm:p-8">
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">Character file unavailable</p>
        <p class="mt-2 text-sm text-copy">{{ error }}</p>
        <div class="mt-5 flex flex-wrap gap-3">
          <button class="rounded-md border border-red-300/30 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-300/10" type="button" @click="loadCharacter">Try again</button>
          <button class="rounded-md border border-line px-3 py-2 text-xs font-semibold text-muted transition hover:text-copy" type="button" @click="navigate(`/${game.slug}`)">Back to characters</button>
        </div>
      </div>
      <section v-else-if="character" class="overflow-hidden rounded-xl border border-line bg-panel">
        <div class="grid lg:min-h-[590px] lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
          <div class="relative isolate flex min-h-[390px] flex-col justify-end overflow-hidden bg-panel-raised p-6 sm:min-h-[480px] sm:p-10 lg:order-2 lg:min-h-full">
            <img
              v-if="character.image"
              class="absolute inset-0 -z-20 h-full w-full object-cover object-top"
              :src="character.image"
              :alt="character.name"
            />
            <span class="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/15 to-black/10"></span>
            <span class="absolute inset-0 -z-10 bg-gradient-to-r from-black/25 to-transparent"></span>
            <div v-if="!character.image" class="absolute inset-0 -z-10 grid place-items-center bg-[radial-gradient(ellipse_at_center,_var(--game-accent)_0%,_#121c27_54%)] opacity-30"></div>
            <p class="text-[10px] font-bold uppercase tracking-[0.18em]" :style="{ color: game.accent }">{{ game.universe }} · {{ game.shortName }}</p>
            <p class="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-white/65">Character profile</p>
          </div>

          <div class="flex flex-col p-6 sm:p-10 lg:order-1 lg:py-12">
            <div class="mb-8">
              <p class="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]" :style="{ color: game.accent }">
                <span class="size-1.5 rounded-full" :style="{ backgroundColor: game.accent }"></span>
                {{ game.name }} / Archive
              </p>
              <h1 class="text-3xl font-extrabold leading-tight tracking-[-0.045em] text-copy sm:text-5xl">{{ character.name }}</h1>
              <p class="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Archive ID · {{ String(character.id).padStart(4, '0') }}</p>
            </div>

            <div class="mb-3 flex items-center justify-between border-b border-line pb-3">
              <h2 class="text-sm font-bold text-copy">Base statistics</h2>
              <span class="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Character data</span>
            </div>
            <div v-if="stats.length" class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              <div v-for="stat in stats" :key="stat.key" class="rounded-lg border border-line bg-ink/45 p-3.5">
                <p class="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">{{ stat.label }}</p>
                <p class="mt-2 text-xl font-bold tabular-nums text-copy">{{ character[stat.key] }}</p>
              </div>
            </div>
            <p v-else class="rounded-lg border border-line bg-ink/45 p-4 text-xs text-muted">Belum ada statistik untuk karakter ini.</p>

            <button class="mt-8 inline-flex w-fit items-center gap-2 text-xs font-semibold text-muted transition hover:text-copy" type="button" @click="navigate(`/${game.slug}`)">
              <span aria-hidden="true">←</span> Back to character database
            </button>
          </div>
        </div>
      </section>

      <footer class="mt-14 flex flex-col gap-2 border-t border-line pt-5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>ASTER DATABASE</span>
        <span>{{ game.shortName }} · Character profile</span>
        <button class="text-left transition hover:text-copy sm:text-right" type="button" @click="navigate(`/${game.slug}`)">Back to characters ↑</button>
      </footer>
    </div>
  </main>
</template>
