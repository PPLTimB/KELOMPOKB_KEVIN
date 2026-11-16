import axios from 'axios'
import { getToken } from '@/utils/auth'

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
// Pastikan tidak ada trailing slash ganda
const apiBaseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request Interceptor: Menambahkan Bearer Token jika ada di localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Membuka ApiResponse dan menangani error secara terstruktur
apiClient.interceptors.response.use(
  (response) => {
    // Backend JEMARI mengembalikan ApiResponse: { success, message, data, errors }
    return response.data
  },
  (error) => {
    const response = error.response
    let message = 'Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi.'
    const fieldErrors = {}

    if (response) {
      const data = response.data

      // Periksa pesan dari ApiResponse backend jika tersedia
      if (data && typeof data === 'object') {
        if (data.message) {
          message = data.message
        }

        // Peta error per-field dari list ErrorDetail [{ field, message }]
        if (Array.isArray(data.errors)) {
          data.errors.forEach((err) => {
            if (err.field && err.message) {
              fieldErrors[err.field] = err.message
            }
          })
        }
      }

      // Pesan khusus untuk status umum
      if (response.status === 401) {
        message = data?.message || 'Sesi Anda belum terautentikasi atau token tidak valid. Silakan pasang token uji yang sesuai.'
      } else if (response.status === 403) {
        message = data?.message || 'Anda tidak memiliki hak akses (role tidak sesuai) untuk halaman ini.'
      } else if (response.status === 404) {
        message = data?.message || 'Data yang diminta tidak ditemukan.'
      }
    } else if (error.request) {
      message = 'Gagal terhubung ke server backend. Pastikan server Spring Boot sedang berjalan.'
    }

    const enhancedError = new Error(message)
    enhancedError.status = response?.status
    enhancedError.fieldErrors = fieldErrors
    enhancedError.apiData = response?.data
    enhancedError.originalError = error

    return Promise.reject(enhancedError)
  }
)

export default apiClient

