/**
 * Utilitas pemformatan mata uang dan angka untuk JEMARI
 */

/**
 * Format angka ke representasi Rupiah ringkas (ramah layar kecil/mobile)
 * Contoh:
 * - 200000 -> "Rp 200rb"
 * - 1500000 -> "Rp 1,5jt"
 * - 1250000 -> "Rp 1,25jt"
 * - 50000 -> "Rp 50rb"
 * - 500 -> "Rp 500"
 *
 * @param {number|string} value
 * @returns {string}
 */
export function formatRupiahSingkat(value) {
  if (value === null || value === undefined || value === '') {
    return 'Rp 0'
  }

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) {
    return 'Rp 0'
  }

  if (num < 0) {
    return `-Rp ${formatRupiahSingkat(Math.abs(num)).replace('Rp ', '')}`
  }

  if (num >= 1000000000) {
    const formatted = (num / 1000000000).toLocaleString('id-ID', {
      maximumFractionDigits: 2,
    })
    return `Rp ${formatted}M`
  }

  if (num >= 1000000) {
    const formatted = (num / 1000000).toLocaleString('id-ID', {
      maximumFractionDigits: 2,
    })
    return `Rp ${formatted}jt`
  }

  if (num >= 1000) {
    const formatted = (num / 1000).toLocaleString('id-ID', {
      maximumFractionDigits: 1,
    })
    return `Rp ${formatted}rb`
  }

  return `Rp ${num.toLocaleString('id-ID')}`
}

/**
 * Format angka ke representasi Rupiah standar penuh
 * Contoh: 1500000 -> "Rp 1.500.000"
 *
 * @param {number|string} value
 * @returns {string}
 */
export function formatRupiahPenuh(value) {
  if (value === null || value === undefined || value === '') {
    return 'Rp 0'
  }

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) {
    return 'Rp 0'
  }

  return `Rp ${num.toLocaleString('id-ID')}`
}
