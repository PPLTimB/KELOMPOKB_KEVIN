import apiClient from './client'

/**
 * Mengambil daftar katalog jasa dengan filter, pencarian, dan paginasi (Role: UMKM)
 * Endpoint: GET /api/katalog
 *
 * @param {Object} params
 * @param {string} [params.keyword]
 * @param {number|string} [params.kategoriId]
 * @param {number|string} [params.hargaMin]
 * @param {number|string} [params.hargaMax]
 * @param {string} [params.sort]
 * @param {number} [params.page]
 * @param {number} [params.size]
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export function getKatalog(params = {}) {
  const query = {}

  if (params.keyword && params.keyword.trim()) {
    query.keyword = params.keyword.trim()
  }
  if (params.kategoriId !== null && params.kategoriId !== undefined && params.kategoriId !== '') {
    query.kategoriId = params.kategoriId
  }
  if (params.hargaMin !== null && params.hargaMin !== undefined && params.hargaMin !== '') {
    query.hargaMin = params.hargaMin
  }
  if (params.hargaMax !== null && params.hargaMax !== undefined && params.hargaMax !== '') {
    query.hargaMax = params.hargaMax
  }
  if (params.sort) {
    query.sort = params.sort
  }
  if (typeof params.page === 'number') {
    query.page = params.page
  }
  if (typeof params.size === 'number') {
    query.size = params.size
  }

  return apiClient.get('/api/katalog', { params: query })
}
