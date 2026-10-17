export const games = [
  {
    slug: 'hsr',
    shortName: 'HSR',
    name: 'Honkai: Star Rail',
    universe: 'The Astral Express',
    tagline: 'Perjalanan melintasi bintang dimulai di sini.',
    apiUrl: import.meta.env.VITE_HSR_API_URL || 'http://localhost:3001',
    theme: 'hsr',
    accent: '#76d8c7',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbSUzVX1NAzQcHFqtfh9R66Ohm53v7uSx2Te-aRoJd1Q&s=10',
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
    accent: '#f0a45b',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQmuzahqD_UhYUTx1MS7jr5H_yeZFsCzVz1uIGgFqbIg&s=10',
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
    accent: '#91c98c',
    image:
      'https://imgeucdn.gamespress.com/cdn/files/Games%20Press/2026/09/121042-6f9bc0cc/Key_Art_EN.jpg?w=533&mode=max&otf=y&quality=90&format=jpg&bgcolor=white&sky=529283df108cff2ff97aee2e7617253cc51712a5b9764c685a1c4354536652c5',
    imagePosition: 'center 55%',
    index: '03',
  },
]
