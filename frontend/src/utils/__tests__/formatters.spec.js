import { describe, it, expect } from 'vitest'
import { formatRupiahSingkat, formatRupiahPenuh } from '../formatters'

describe('formatRupiahSingkat', () => {
  it('harus memformat jutaan dengan satuan jt dan koma desimal Indonesia', () => {
    expect(formatRupiahSingkat(1500000)).toBe('Rp 1,5jt')
    expect(formatRupiahSingkat(2000000)).toBe('Rp 2jt')
    expect(formatRupiahSingkat(1250000)).toBe('Rp 1,25jt')
  })

  it('harus memformat ribuan dengan satuan rb', () => {
    expect(formatRupiahSingkat(200000)).toBe('Rp 200rb')
    expect(formatRupiahSingkat(75000)).toBe('Rp 75rb')
    expect(formatRupiahSingkat(1500)).toBe('Rp 1,5rb')
  })

  it('harus memformat angka di bawah seribu secara langsung', () => {
    expect(formatRupiahSingkat(500)).toBe('Rp 500')
    expect(formatRupiahSingkat(0)).toBe('Rp 0')
  })

  it('harus menangani input string angka', () => {
    expect(formatRupiahSingkat('1500000')).toBe('Rp 1,5jt')
    expect(formatRupiahSingkat('200000')).toBe('Rp 200rb')
  })

  it('harus menangani null, undefined, string kosong, atau NaN dengan aman', () => {
    expect(formatRupiahSingkat(null)).toBe('Rp 0')
    expect(formatRupiahSingkat(undefined)).toBe('Rp 0')
    expect(formatRupiahSingkat('')).toBe('Rp 0')
    expect(formatRupiahSingkat('bukan-angka')).toBe('Rp 0')
  })
})

describe('formatRupiahPenuh', () => {
  it('harus memformat nominal penuh sesuai standar rupiah Indonesia', () => {
    expect(formatRupiahPenuh(1500000)).toBe('Rp 1.500.000')
    expect(formatRupiahPenuh(200000)).toBe('Rp 200.000')
  })
})

