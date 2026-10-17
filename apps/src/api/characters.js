import axios from 'axios'

function getApiUrl(game) {
  const baseUrl = game.apiUrl?.trim().replace(/\/+$/, '')

  if (!baseUrl) {
    throw new Error(`URL API untuk ${game.name} belum dikonfigurasi.`)
  }

  return `${baseUrl}/character`
}

async function requestCharacterData(game, path = '') {
  let result
  try {
    const response = await axios.get(`${getApiUrl(game)}${path}`)
    result = response.data
  } catch (error) {
    if (error.response) {
      throw new Error(`API ${game.shortName} merespons dengan status ${error.response.status}.`)
    }
    throw new Error(`Gagal menghubungi API ${game.shortName}: ${error.message}`)
  }

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
