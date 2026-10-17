export const games = [
  {
    slug: 'hsr',
    shortName: 'HSR',
    name: 'Honkai: Star Rail',
    universe: 'The Astral Express',
    tagline: 'Perjalanan melintasi bintang dimulai di sini.',
    apiUrl: import.meta.env.VITE_HSR_API_URL || 'http://localhost:3001',
    theme: 'hsr',
    image:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1800&q=85',
    imagePosition: 'center 48%',
    index: '01',
  },
  {
    slug: 'zzz',
    shortName: 'ZZZ',
    name: 'Zenless Zone Zero',
    universe: 'New Eridu',
    tagline: 'Di kota ini, yang absurd adalah hal biasa.',
    apiUrl: import.meta.env.VITE_ZZZ_API_URL || 'http://localhost:3002',
    theme: 'zzz',
    image:
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=85',
    imagePosition: 'center 52%',
    index: '02',
  },
  {
    slug: 'gi',
    shortName: 'GI',
    name: 'Genshin Impact',
    universe: 'Teyvat',
    tagline: 'Temukan kisah dan karakter dari tujuh bangsa.',
    apiUrl: import.meta.env.VITE_GI_API_URL || 'http://localhost:3003',
    theme: 'gi',
    image:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=85',
    imagePosition: 'center 55%',
    index: '03',
  },
]
