# Aster Database

Frontend untuk menjelajahi database karakter Honkai: Star Rail, Zenless Zone Zero, dan Genshin Impact. Dibangun dengan Vue 3, Vite, dan Tailwind CSS v4.

## Menjalankan aplikasi

```sh
npm install
npm run dev
```

Atur URL service melalui `VITE_HSR_API_URL`, `VITE_ZZZ_API_URL`, dan `VITE_GI_API_URL` di file `.env`. Contoh konfigurasi tersedia di `.env.example`.

Untuk login dan register, isi satu `VITE_AUTH_URL` dengan base URL endpoint Lambda. Frontend akan memanggil `${VITE_AUTH_URL}/login` dan `${VITE_AUTH_URL}/register`. Browser juga harus diizinkan mengakses endpoint tersebut melalui CORS. Seluruh request API frontend menggunakan Axios. Setelah login berhasil, akses ke tampilan utama berlaku selama aplikasi terbuka; endpoint autentikasi saat ini belum mengembalikan token atau sesi.

## Build produksi

```sh
npm run build
npm run preview
```
