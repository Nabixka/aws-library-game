<script setup>
import { ref } from 'vue'
import { authenticate } from '../api/auth.js'

const emit = defineEmits(['authenticated'])
const mode = ref('login')
const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function submit() {
  const action = mode.value
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await authenticate(action, {
      username: username.value.trim(),
      password: password.value,
    })

    if (action === 'register') {
      mode.value = 'login'
      password.value = ''
      successMessage.value = result.message || 'Akun berhasil dibuat. Silakan login.'
      return
    }

    emit('authenticated')
  } catch (error) {
    errorMessage.value = error.message || 'Autentikasi gagal. Coba lagi.'
  } finally {
    loading.value = false
  }
}

function setMode(nextMode) {
  mode.value = nextMode
  errorMessage.value = ''
  successMessage.value = ''
}
</script>

<template>
  <main class="grid min-h-screen place-items-center px-5 py-12">
    <section class="w-full max-w-md">
      <div class="mb-8 text-center">
        <span class="mx-auto grid size-12 place-items-center rounded-xl bg-mint text-lg font-black text-ink">A</span>
        <p class="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-mint">Aster Database</p>
        <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-copy">
          {{ mode === 'login' ? 'Selamat datang kembali' : 'Buat akun baru' }}
        </h1>
        <p class="mt-2 text-sm text-muted">
          {{ mode === 'login' ? 'Login untuk menjelajahi database game.' : 'Daftar untuk mulai menjelajahi database game.' }}
        </p>
      </div>

      <div class="rounded-xl border border-line bg-panel p-6 sm:p-8">
        <div class="mb-6 grid grid-cols-2 rounded-lg border border-line bg-ink p-1" role="tablist" aria-label="Autentikasi">
          <button
            class="rounded-md px-3 py-2.5 text-xs font-bold transition"
            :class="mode === 'login' ? 'bg-panel-raised text-copy' : 'text-muted hover:text-copy'"
            type="button"
            role="tab"
            :aria-selected="mode === 'login'"
            @click="setMode('login')"
          >
            Login
          </button>
          <button
            class="rounded-md px-3 py-2.5 text-xs font-bold transition"
            :class="mode === 'register' ? 'bg-panel-raised text-copy' : 'text-muted hover:text-copy'"
            type="button"
            role="tab"
            :aria-selected="mode === 'register'"
            @click="setMode('register')"
          >
            Register
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="submit">
          <label class="block">
            <span class="mb-2 block text-xs font-semibold text-copy">Username</span>
            <input
              v-model="username"
              class="w-full rounded-lg border border-line bg-ink px-3.5 py-3 text-sm text-copy placeholder:text-muted/70"
              type="text"
              name="username"
              autocomplete="username"
              placeholder="Masukkan username"
              required
              :disabled="loading"
            />
          </label>

          <label class="block">
            <span class="mb-2 block text-xs font-semibold text-copy">Password</span>
            <input
              v-model="password"
              class="w-full rounded-lg border border-line bg-ink px-3.5 py-3 text-sm text-copy placeholder:text-muted/70"
              type="password"
              name="password"
              :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
              placeholder="Masukkan password"
              required
              :disabled="loading"
            />
          </label>

          <p v-if="errorMessage" class="rounded-lg border border-red-400/25 bg-red-400/10 px-3 py-2.5 text-xs leading-5 text-red-200" role="alert">
            {{ errorMessage }}
          </p>
          <p v-if="successMessage" class="rounded-lg border border-mint/25 bg-mint/10 px-3 py-2.5 text-xs leading-5 text-mint" role="status">
            {{ successMessage }}
          </p>

          <button
            class="w-full rounded-lg bg-mint px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-ink transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
            type="submit"
            :disabled="loading"
          >
            {{ loading ? 'Memproses...' : mode === 'login' ? 'Login' : 'Buat akun' }}
          </button>
        </form>
      </div>
      <p class="mt-5 text-center text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
        Explore every world. Know every character.
      </p>
    </section>
  </main>
</template>
