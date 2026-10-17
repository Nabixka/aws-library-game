import axios from 'axios'

export async function authenticate(action, credentials) {
  const baseUrl = import.meta.env.VITE_AUTH_URL?.trim().replace(/\/+$/, '')

  if (!baseUrl) {
    throw new Error(`URL API ${action} belum dikonfigurasi.`)
  }

  try {
    const response = await axios.post(`${baseUrl}/${action}`, credentials)
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        (error.response
          ? `Autentikasi gagal (${error.response.status}).`
          : `Gagal menghubungi API autentikasi: ${error.message}`),
    )
  }
}
