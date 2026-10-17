<script setup>
import { games } from '../data/games.js'

defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <main class="min-h-screen">
    <header class="mx-auto flex h-[72px] max-w-7xl items-center justify-between border-b border-line px-5 sm:px-8">
      <button class="flex items-center gap-3 text-left" type="button" @click="navigate('/')">
        <span class="grid size-9 place-items-center rounded-lg bg-mint text-sm font-black text-ink">A</span>
        <span class="text-sm font-bold tracking-[0.12em] text-copy">ASTER<span class="ml-1 font-normal text-muted">DATABASE</span></span>
      </button>
      <div class="flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-muted">
        <span class="size-1.5 rounded-full bg-mint shadow-[0_0_10px_#76d8c7]"></span>
        GAME LIBRARY
      </div>
    </header>

    <div class="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
      <section class="relative overflow-hidden pb-12 pt-14 sm:pb-16 sm:pt-20">
        <div class="pointer-events-none absolute -right-8 top-8 hidden size-72 rounded-full border border-white/[0.04] md:block"></div>
        <div class="pointer-events-none absolute right-7 top-16 hidden size-52 rounded-full border border-white/[0.05] md:block"></div>
        <p class="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-mint">
          <span class="h-px w-7 bg-mint"></span>
          Your game companion
        </p>
        <h1 class="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-copy sm:text-6xl">
          Explore every world.<br />
          <span class="text-muted">Know every character.</span>
        </h1>
        <p class="mt-5 max-w-xl text-sm leading-7 text-muted sm:text-base">
          A growing archive for your favorite games. Browse character profiles, artwork, and base stats in one place.
        </p>
        <div class="mt-8 flex flex-wrap gap-3 text-xs text-muted">
          <span class="rounded-md border border-line bg-panel/80 px-3 py-2"><strong class="mr-1.5 text-copy">{{ games.length }}</strong> game worlds</span>
          <span class="rounded-md border border-line bg-panel/80 px-3 py-2">Character archive</span>
          <span class="rounded-md border border-line bg-panel/80 px-3 py-2">Community built</span>
        </div>
      </section>

      <section aria-labelledby="worlds-title">
        <div class="mb-5 flex items-end justify-between gap-4 border-b border-line pb-4">
          <div>
            <p class="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Choose your destination</p>
            <h2 id="worlds-title" class="text-xl font-bold tracking-tight text-copy">Game databases</h2>
          </div>
          <span class="pb-0.5 text-xs tabular-nums text-muted">{{ String(games.length).padStart(2, '0') }} WORLDS</span>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <button
            v-for="game in games"
            :key="game.slug"
            class="group relative isolate flex min-h-[310px] flex-col justify-between overflow-hidden rounded-xl border border-line bg-panel text-left transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl hover:shadow-black/30"
            :style="{ '--game-accent': game.accent }"
            type="button"
            @click="navigate(`/${game.slug}`)"
          >
            <img
              class="absolute inset-0 -z-20 h-full w-full object-cover opacity-50 transition duration-500 group-hover:scale-105 group-hover:opacity-65"
              :src="game.image"
              :alt="`${game.name} landscape`"
              :style="{ objectPosition: game.imagePosition }"
              loading="lazy"
            />
            <span class="absolute inset-0 -z-10 bg-gradient-to-b from-ink/25 via-ink/30 to-ink"></span>
            <span class="flex items-center justify-between p-5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/75">
              <span class="flex items-center gap-2"><span class="size-1.5 rounded-full" :style="{ backgroundColor: game.accent }"></span>{{ game.universe }}</span>
              <span>{{ game.index }} / {{ String(games.length).padStart(2, '0') }}</span>
            </span>
            <span class="block p-5">
              <span class="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em]" :style="{ color: game.accent }">Character archive</span>
              <span class="block text-2xl font-extrabold leading-tight tracking-tight text-white">{{ game.name }}</span>
              <span class="mt-2 block max-w-xs text-xs leading-5 text-white/65">{{ game.tagline }}</span>
              <span class="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white/70">
                <span>Open database</span>
                <span class="grid size-8 place-items-center rounded-full border border-white/20 text-base transition group-hover:border-transparent group-hover:bg-white group-hover:text-ink" aria-hidden="true">↗</span>
              </span>
            </span>
          </button>
        </div>
      </section>

      <footer class="mt-14 flex flex-col gap-2 border-t border-line pt-5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>ASTER DATABASE</span>
        <span>Made for the curious, across every world.</span>
      </footer>
    </div>
  </main>
</template>
