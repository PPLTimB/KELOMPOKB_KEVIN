/**
 * Validasi harga filter katalog di sisi klien.
 * Aturan:
 * - Jika diisi, harus berupa angka numerik valid
 * - Nilai tidak boleh bernilai negatif (< 0)
 * - Harga minimum tidak boleh lebih besar dari harga maksimum jika keduanya diisi
 *
 * @param {string|number|null} min
 * @param {string|number|null} max
 * @returns {{ valid: boolean, errors: { hargaMin?: string, hargaMax?: string } }}
 */
export function validateHarga(min, max) {
  const errors = {}

  let numMin = null
  let numMax = null

  if (min !== null && min !== undefined && min !== '') {
    numMin = Number(min)
    if (isNaN(numMin)) {
      errors.hargaMin = 'Harga minimum harus berupa angka'
    } else if (numMin < 0) {
      errors.hargaMin = 'Harga minimum tidak boleh bernilai negatif'
    }
  }

  if (max !== null && max !== undefined && max !== '') {
    numMax = Number(max)
    if (isNaN(numMax)) {
      errors.hargaMax = 'Harga maksimum harus berupa angka'
    } else if (numMax < 0) {
      errors.hargaMax = 'Harga maksimum tidak boleh bernilai negatif'
    }
  }

  if (
    numMin !== null &&
    numMax !== null &&
    !isNaN(numMin) &&
    !isNaN(numMax) &&
    numMin >= 0 &&
    numMax >= 0
  ) {
    if (numMin > numMax) {
      errors.hargaMin = 'Harga minimum tidak boleh lebih besar dari harga maksimum'
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

