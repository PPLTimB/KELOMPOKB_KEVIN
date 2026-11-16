import apiClient from './client'

/**
 * Mengambil struktur pohon kategori aktif (akses: pengguna login UMKM/ADMIN/Freelancer)
 * Endpoint: GET /api/kategori
 *
 * @returns {Promise<{ success: boolean, message: string, data: Array }>}
 */
export function getActiveKategoriTree() {
  return apiClient.get('/api/kategori')
}

/**
 * Mengambil seluruh daftar kategori untuk manajemen admin (Role: ADMIN)
 * Endpoint: GET /api/admin/kategori
 *
 * @returns {Promise<{ success: boolean, message: string, data: Array }>}
 */
export function getAllKategoriAdmin() {
  return apiClient.get('/api/admin/kategori')
}

/**
 * Mengambil detail satu kategori (Role: ADMIN)
 * Endpoint: GET /api/admin/kategori/{id}
 *
 * @param {number|string} id
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export function getKategoriByIdAdmin(id) {
  return apiClient.get(`/api/admin/kategori/${id}`)
}

/**
 * Membuat kategori baru atau sub-kategori (Role: ADMIN)
 * Endpoint: POST /api/admin/kategori
 *
 * @param {{ nama: string, deskripsi?: string, parentId?: number|null }} payload
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export function createKategoriAdmin(payload) {
  return apiClient.post('/api/admin/kategori', payload)
}

/**
 * Memperbarui kategori yang ada (Role: ADMIN)
 * Endpoint: PUT /api/admin/kategori/{id}
 *
 * @param {number|string} id
 * @param {{ nama: string, deskripsi?: string, parentId?: number|null, active?: boolean }} payload
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export function updateKategoriAdmin(id, payload) {
  return apiClient.put(`/api/admin/kategori/${id}`, payload)
}

/**
 * Menghapus kategori (Role: ADMIN)
 * Endpoint: DELETE /api/admin/kategori/{id}
 *
 * @param {number|string} id
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export function deleteKategoriAdmin(id) {
  return apiClient.delete(`/api/admin/kategori/${id}`)
}

