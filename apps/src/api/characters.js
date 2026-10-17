function getApiUrl(game) {
  const baseUrl = game.apiUrl?.trim().replace(/\/+$/, '')

  if (!baseUrl) {
    throw new Error(`URL API untuk ${game.name} belum dikonfigurasi.`)
  }

  return `${baseUrl}/character`
}

async function requestCharacterData(game, path = '') {
  const response = await fetch(`${getApiUrl(game)}${path}`)
  if (!response.ok) {
    throw new Error(`API ${game.shortName} merespons dengan status ${response.status}.`)
  }

  const result = await response.json()
  if (!result || !('data' in result)) {
    throw new Error(`Format respons API ${game.shortName} tidak dikenali.`)
  }

  return result.data
}

export function getCharacters(game) {
  return requestCharacterData(game)
}

export function getCharacter(game, id) {
  return requestCharacterData(game, `/${encodeURIComponent(id)}`)
}
