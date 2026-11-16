import { describe, it, expect } from 'vitest'
import { validateHarga } from '../validators'

describe('validateHarga', () => {
  it('harus valid jika kedua isian harga kosong', () => {
    const res = validateHarga('', '')
    expect(res.valid).toBe(true)
    expect(res.errors).toEqual({})
  })

  it('harus valid jika nilai harga numerik wajar dan min <= max', () => {
    const res = validateHarga('50000', '200000')
    expect(res.valid).toBe(true)
    expect(res.errors).toEqual({})
  })

  it('harus valid jika hanya salah satu harga yang diisi', () => {
    expect(validateHarga('10000', '').valid).toBe(true)
    expect(validateHarga('', '500000').valid).toBe(true)
  })

  it('harus gagal jika hargaMin bernilai negatif', () => {
    const res = validateHarga('-1000', '50000')
    expect(res.valid).toBe(false)
    expect(res.errors.hargaMin).toBe('Harga minimum tidak boleh bernilai negatif')
  })

  it('harus gagal jika hargaMax bernilai negatif', () => {
    const res = validateHarga('0', '-500')
    expect(res.valid).toBe(false)
    expect(res.errors.hargaMax).toBe('Harga maksimum tidak boleh bernilai negatif')
  })

  it('harus gagal jika hargaMin lebih besar dari hargaMax', () => {
    const res = validateHarga('300000', '100000')
    expect(res.valid).toBe(false)
    expect(res.errors.hargaMin).toBe(
      'Harga minimum tidak boleh lebih besar dari harga maksimum'
    )
  })

  it('harus gagal jika input bukan angka', () => {
    const res = validateHarga('abc', 'def')
    expect(res.valid).toBe(false)
    expect(res.errors.hargaMin).toBe('Harga minimum harus berupa angka')
    expect(res.errors.hargaMax).toBe('Harga maksimum harus berupa angka')
  })
})

