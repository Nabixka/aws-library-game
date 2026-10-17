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
  <main class="library-page">
    <header class="site-header">
      <button class="brand" type="button" @click="navigate('/')">
        <span class="brand-mark">A</span>
        <span>ASTER<span class="brand-light"> / LIBRARY</span></span>
      </button>
      <span class="header-note"><span class="status-dot"></span> YOUR WORLDS, ARCHIVED</span>
    </header>

    <section class="library-intro">
      <p class="eyebrow">MULTIVERSE CHARACTER ARCHIVE <span>— 2026</span></p>
      <h1>Choose your<br /><span>universe.</span></h1>
      <p class="intro-copy">
        Satu tempat untuk menjelajahi karakter dari dunia favoritmu.
        Semesta mana yang akan kamu kunjungi?
      </p>
      <div class="intro-index"><span>03</span> WORLDS AVAILABLE</div>
    </section>

    <section class="game-grid" aria-label="Pilih game">
      <button
        v-for="game in games"
        :key="game.slug"
        class="game-card"
        :class="`theme-${game.theme}`"
        type="button"
        @click="navigate(`/${game.slug}`)"
      >
        <img
          class="game-art"
          :src="game.image"
          :alt="`${game.name} landscape`"
          :style="{ objectPosition: game.imagePosition }"
        />
        <span class="card-shade"></span>
        <span class="card-topline">
          <span>{{ game.universe }}</span>
          <span>{{ game.index }} / 03</span>
        </span>
        <span class="card-caption">
          <span class="card-kicker">EXPLORE THE ARCHIVE</span>
          <span class="card-title">{{ game.name }}</span>
          <span class="card-footer">
            <span>{{ game.shortName }} · CHARACTER DATABASE</span>
            <span class="card-arrow" aria-hidden="true">↗</span>
          </span>
        </span>
      </button>
    </section>

    <footer class="site-footer">
      <span>ASTER LIBRARY</span>
      <span>MADE FOR THE CURIOUS, ACROSS EVERY WORLD.</span>
      <span>SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span>
    </footer>
  </main>
</template>
