<script setup>
import { ref, watch } from 'vue'
import { validateHarga } from '@/utils/validators'

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  initialKeyword: {
    type: String,
    default: '',
  },
  initialKategoriId: {
    type: [Number, String, null],
    default: null,
  },
  initialHargaMin: {
    type: [Number, String, null],
    default: '',
  },
  initialHargaMax: {
    type: [Number, String, null],
    default: '',
  },
  initialSort: {
    type: String,
    default: '',
  },
  backendFieldErrors: {
    type: Object,
    default: () => ({}),
  },
  isMobileOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['applyFilter', 'resetFilter', 'closeMobile'])

// State lokal form filter
const localKeyword = ref(props.initialKeyword)
const localKategoriId = ref(props.initialKategoriId ?? null)
const localHargaMin = ref(props.initialHargaMin ?? '')
const localHargaMax = ref(props.initialHargaMax ?? '')
const localSort = ref(props.initialSort || '')

// Error validasi lokal klien
const clientErrors = ref({})

// Debounce timer untuk pencarian kata kunci
let debounceTimer = null

watch(
  () => props.initialKeyword,
  (val) => {
    localKeyword.value = val || ''
  }
)

watch(
  () => props.initialKategoriId,
  (val) => {
    localKategoriId.value = val ?? null
  }
)

watch(
  () => props.initialHargaMin,
  (val) => {
    localHargaMin.value = val ?? ''
  }
)

watch(
  () => props.initialHargaMax,
  (val) => {
    localHargaMax.value = val ?? ''
  }
)

watch(
  () => props.initialSort,
  (val) => {
    localSort.value = val || ''
  }
)

function onKeywordInput() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    triggerApply()
  }, 400)
}

function clearKeyword() {
  localKeyword.value = ''
  triggerApply()
}

function selectCategory(id) {
  localKategoriId.value = id
  triggerApply()
}

function onSortChange() {
  triggerApply()
}

function validatePriceInputs() {
  const result = validateHarga(localHargaMin.value, localHargaMax.value)
  clientErrors.value = result.errors
  return result.valid
}

function triggerApply() {
  const isPriceValid = validatePriceInputs()
  if (!isPriceValid) {
    return
  }

  emit('applyFilter', {
    keyword: localKeyword.value,
    kategoriId: localKategoriId.value,
    hargaMin: localHargaMin.value !== '' ? localHargaMin.value : null,
    hargaMax: localHargaMax.value !== '' ? localHargaMax.value : null,
    sort: localSort.value,
  })
}

function handleManualApply() {
  triggerApply()
  emit('closeMobile')
}

function handleReset() {
  localKeyword.value = ''
  localKategoriId.value = null
  localHargaMin.value = ''
  localHargaMax.value = ''
  localSort.value = ''
  clientErrors.value = {}
  emit('resetFilter')
  emit('closeMobile')
}
</script>

<template>
  <aside
    class="filter-sidebar"
    :class="{ 'mobile-open': isMobileOpen }"
    aria-label="Panel Filter Katalog Jasa"
  >
    <div class="sidebar-header-mobile">
      <h2 class="mobile-filter-title">Filter & Pencarian Jasa</h2>
      <button
        type="button"
        class="btn-close-filter"
        @click="emit('closeMobile')"
        aria-label="Tutup panel filter"
      >
        ✕
      </button>
    </div>

    <!-- 1. Kolom Pencarian Kata Kunci -->
    <div class="filter-group">
      <label for="filter-keyword-input" class="group-label">Cari Jasa</label>
      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clip-rule="evenodd"
          />
        </svg>
        <input
          id="filter-keyword-input"
          v-model="localKeyword"
          type="search"
          class="search-input"
          placeholder="Cari jasa atau freelancer..."
          @input="onKeywordInput"
        />
        <button
          v-if="localKeyword"
          type="button"
          class="clear-keyword-btn"
          @click="clearKeyword"
          aria-label="Hapus kata kunci pencarian"
        >
          ×
        </button>
      </div>
    </div>

    <!-- 2. Pengurutan -->
    <div class="filter-group">
      <label for="filter-sort-select" class="group-label">Urutan</label>
      <div class="select-wrapper">
        <select
          id="filter-sort-select"
          v-model="localSort"
          class="sort-select"
          @change="onSortChange"
        >
          <option value="">Terbaru + Acak (Default)</option>
          <option value="harga_asc">Harga Termurah</option>
          <option value="harga_desc">Harga Termahal</option>
        </select>
      </div>
    </div>

    <!-- 3. Grup Filter Kategori -->
    <div class="filter-group">
      <div class="group-label-container">
        <span class="group-label">Kategori</span>
        <span class="category-note">Pilih induk otomatis mencakup sub-kategori</span>
      </div>

      <div class="category-tree-list" role="radiogroup" aria-label="Pilihan Kategori Jasa">
        <!-- Opsi Semua -->
        <label
          class="category-item-label"
          :class="{ active: localKategoriId === null || localKategoriId === '' }"
        >
          <input
            type="radio"
            name="kategori-radio"
            class="sr-only"
            :checked="localKategoriId === null || localKategoriId === ''"
            @change="selectCategory(null)"
          />
          <span class="radio-indicator"></span>
          <span class="category-name">Semua Kategori</span>
        </label>

        <!-- Daftar Pohon Kategori -->
        <div v-for="cat in categories" :key="cat.id" class="category-node">
          <!-- Kategori Induk -->
          <label
            class="category-item-label parent-label"
            :class="{ active: localKategoriId === cat.id }"
          >
            <input
              type="radio"
              name="kategori-radio"
              class="sr-only"
              :checked="localKategoriId === cat.id"
              @change="selectCategory(cat.id)"
            />
            <span class="radio-indicator"></span>
            <span class="category-name font-bold">{{ cat.nama }}</span>
          </label>

          <!-- Sub-kategori menjorok ke dalam -->
          <div
            v-if="cat.subKategori && cat.subKategori.length > 0"
            class="sub-category-list"
          >
            <label
              v-for="sub in cat.subKategori"
              :key="sub.id"
              class="category-item-label sub-label"
              :class="{ active: localKategoriId === sub.id }"
            >
              <input
                type="radio"
                name="kategori-radio"
                class="sr-only"
                :checked="localKategoriId === sub.id"
                @change="selectCategory(sub.id)"
              />
              <span class="radio-indicator sub-indicator"></span>
              <span class="category-name">{{ sub.nama }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Grup Filter Rentang Harga -->
    <div class="filter-group">
      <span class="group-label">Rentang Harga (Rp)</span>

      <div class="price-inputs-grid">
        <div class="price-field">
          <label for="filter-price-min" class="sr-only">Harga Minimum</label>
          <div class="input-prefix-wrapper">
            <span class="input-prefix" aria-hidden="true">Rp</span>
            <input
              id="filter-price-min"
              v-model="localHargaMin"
              type="number"
              min="0"
              step="5000"
              class="price-input"
              :class="{ 'has-error': clientErrors.hargaMin || backendFieldErrors.hargaMin }"
              placeholder="Min"
              @blur="validatePriceInputs"
              @keydown.enter.prevent="handleManualApply"
            />
          </div>
        </div>

        <span class="price-separator" aria-hidden="true">–</span>

        <div class="price-field">
          <label for="filter-price-max" class="sr-only">Harga Maksimum</label>
          <div class="input-prefix-wrapper">
            <span class="input-prefix" aria-hidden="true">Rp</span>
            <input
              id="filter-price-max"
              v-model="localHargaMax"
              type="number"
              min="0"
              step="5000"
              class="price-input"
              :class="{ 'has-error': clientErrors.hargaMax || backendFieldErrors.hargaMax }"
              placeholder="Max"
              @blur="validatePriceInputs"
              @keydown.enter.prevent="handleManualApply"
            />
          </div>
        </div>
      </div>

      <!-- Pesan Kesalahan Validasi Harga (Klien dan Backend) -->
      <div
        v-if="clientErrors.hargaMin || backendFieldErrors.hargaMin"
        class="field-error-message"
        role="alert"
      >
        {{ clientErrors.hargaMin || backendFieldErrors.hargaMin }}
      </div>
      <div
        v-if="clientErrors.hargaMax || backendFieldErrors.hargaMax"
        class="field-error-message"
        role="alert"
      >
        {{ clientErrors.hargaMax || backendFieldErrors.hargaMax }}
      </div>
    </div>

    <!-- Tombol Aksi Filter -->
    <div class="filter-actions">
      <button
        type="button"
        class="btn-apply"
        @click="handleManualApply"
      >
        Terapkan Filter
      </button>
      <button
        type="button"
        class="btn-reset"
        @click="handleReset"
      >
        Reset Filter
      </button>
    </div>
  </aside>
</template>

<style scoped>
.filter-sidebar {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.sidebar-header-mobile {
  display: none;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-label {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.group-label-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.category-note {
  font-size: 11px;
  color: #6b7280;
}

/* Pencarian */
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 18px;
  height: 18px;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  min-height: 44px;
  padding: 10px 36px 10px 38px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background-color: #ffffff;
}

.search-input:focus {
  outline: none;
  border-color: #111827;
  box-shadow: 0 0 0 2px rgba(17, 24, 39, 0.1);
}

.clear-keyword-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  font-size: 20px;
  color: #9ca3af;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.clear-keyword-btn:hover {
  color: #111827;
}

/* Dropdown Sort */
.select-wrapper {
  position: relative;
}

.sort-select {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background-color: #ffffff;
  color: #111827;
  cursor: pointer;
}

.sort-select:focus {
  outline: none;
  border-color: #111827;
}

/* Pohon Kategori */
.category-tree-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 4px;
}

.category-item-label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  min-height: 44px;
  user-select: none;
}

.category-item-label:hover {
  background-color: #f3f4f6;
}

.category-item-label.active {
  background-color: #f3f4f6;
  font-weight: 700;
}

.radio-indicator {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #9ca3af;
  display: inline-block;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.category-item-label.active .radio-indicator {
  border-color: #111827;
  background-color: #111827;
  box-shadow: inset 0 0 0 2px #ffffff;
}

.category-name {
  font-size: 14px;
  color: #374151;
}

.font-bold {
  font-weight: 600;
  color: #111827;
}

.sub-category-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-left: 20px;
  border-left: 2px solid #e5e7eb;
  padding-left: 8px;
}

.sub-label {
  min-height: 40px;
  padding: 6px 8px;
}

.sub-indicator {
  width: 12px;
  height: 12px;
}

/* Input Rentang Harga */
.price-inputs-grid {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-field {
  flex: 1;
}

.input-prefix-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix {
  position: absolute;
  left: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  pointer-events: none;
}

.price-input {
  width: 100%;
  box-sizing: border-box;
  min-height: 44px;
  padding: 10px 10px 10px 32px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
}

.price-input:focus {
  outline: none;
  border-color: #111827;
  box-shadow: 0 0 0 2px rgba(17, 24, 39, 0.1);
}

.price-input.has-error {
  border-color: #dc2626;
  background-color: #fef2f2;
}

.price-separator {
  color: #9ca3af;
  font-weight: 700;
}

.field-error-message {
  font-size: 12px;
  color: #dc2626;
  font-weight: 500;
  margin-top: 2px;
}

/* Aksi Filter */
.filter-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.btn-apply {
  min-height: 44px;
  background-color: #111827;
  color: #ffffff;
  border: 1px solid #111827;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-apply:hover {
  background-color: #1f2937;
}

.btn-reset {
  min-height: 44px;
  background-color: #ffffff;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-reset:hover {
  background-color: #f3f4f6;
  color: #111827;
}

/* Responsif Mobile Drawer */
@media (max-width: 900px) {
  .filter-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 120;
    border-radius: 0;
    border: none;
    overflow-y: auto;
    padding: 20px;
    background-color: #ffffff;
    display: none;
  }

  .filter-sidebar.mobile-open {
    display: flex;
  }

  .sidebar-header-mobile {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e7eb;
  }

  .mobile-filter-title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
  }

  .btn-close-filter {
    background: none;
    border: none;
    font-size: 20px;
    color: #6b7280;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    cursor: pointer;
  }

  .btn-close-filter:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>

