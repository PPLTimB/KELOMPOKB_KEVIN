/**
 * Utilitas manajemen autentikasi dan JWT token JEMARI
 * Token disimpan di localStorage dengan kunci tunggal 'jemari_token'.
 */

export const TOKEN_STORAGE_KEY = 'jemari_token'

/**
 * Mengambil token mentah dari localStorage
 * @returns {string|null}
 */
export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

/**
 * Menyimpan token ke localStorage
 * @param {string} token
 */
export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token.trim())
  } else {
    removeToken()
  }
}

/**
 * Menghapus token dari localStorage
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

/**
 * Mendekode payload JWT token (Base64URL)
 * Mengambil sub (email), userId, role, dan exp
 *
 * @param {string} token
 * @returns {{ email?: string, userId?: number, role?: string, exp?: number }|null}
 */
export function decodeToken(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  const parts = token.split('.')
  if (parts.length < 2) {
    return null
  }

  try {
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const payload = JSON.parse(jsonPayload)
    return {
      email: payload.sub || payload.email || '',
      userId: payload.userId || null,
      role: payload.role || '',
      exp: payload.exp || null,
    }
  } catch {
    return null
  }
}

/**
 * Mengambil data user yang sedang login berdasarkan token saat ini
 * @returns {{ email: string, userId: number|null, role: string, isExpired: boolean }|null}
 */
export function getCurrentUser() {
  const token = getToken()
  if (!token) return null

  const decoded = decodeToken(token)
  if (!decoded) return null

  const nowSec = Math.floor(Date.now() / 1000)
  const isExpired = decoded.exp ? decoded.exp < nowSec : false

  return {
    ...decoded,
    isExpired,
  }
}

/**
 * Memeriksa apakah user saat ini memiliki peran tertentu (mis. 'UMKM' atau 'ADMIN')
 * @param {string} roleName
 * @returns {boolean}
 */
export function hasRole(roleName) {
  const user = getCurrentUser()
  if (!user || user.isExpired) return false
  return user.role === roleName
}

