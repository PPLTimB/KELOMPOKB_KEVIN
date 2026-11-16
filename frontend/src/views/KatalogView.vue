<script setup>
import { ref, reactive, onMounted } from 'vue'
import Navbar from '@/components/common/Navbar.vue'
import PaketCard from '@/components/katalog/PaketCard.vue'
import FilterSidebar from '@/components/katalog/FilterSidebar.vue'
import Pagination from '@/components/katalog/Pagination.vue'
import { getKatalog } from '@/api/katalog'
import { getActiveKategoriTree } from '@/api/kategori'

// State data
const categories = ref([])
const paketList = ref([])
const totalElements = ref(0)
const totalPages = ref(0)
const currentPage = ref(0)
const pageSize = ref(9) // 9 kartu per halaman (grid 3x3 di desktop)

// State filter
const filters = reactive({
  keyword: '',
  kategoriId: null,
  hargaMin: '',
  hargaMax: '',
  sort: '',
})

// State UI
const isLoading = ref(true)
const errorMessage = ref('')
const backendFieldErrors = ref({})
const isMobileFilterOpen = ref(false)

async function loadCategories() {
  try {
    const res = await getActiveKategoriTree()
    if (res && res.data) {
      categories.value = res.data
    }
  } catch (err) {
    console.warn('Gagal memuat pohon kategori:', err.message)
  }
}

async function fetchKatalogData(page = 0) {
  isLoading.value = true
  errorMessage.value = ''
  backendFieldErrors.value = {}

  try {
    const params = {
      keyword: filters.keyword,
      kategoriId: filters.kategoriId,
      hargaMin: filters.hargaMin,
      hargaMax: filters.hargaMax,
      sort: filters.sort,
      page: page,
      size: pageSize.value,
    }

    const res = await getKatalog(params)

    if (res && res.data) {
      paketList.value = res.data.content || []
      currentPage.value = res.data.page || 0
      totalElements.value = res.data.totalElements || 0
      totalPages.value = res.data.totalPages || 0
    }
  } catch (err) {
    errorMessage.value = err.message || 'Gagal memuat katalog jasa.'
    if (err.fieldErrors) {
      backendFieldErrors.value = err.fieldErrors
    }
  } finally {
    isLoading.value = false
  }
}

function handleApplyFilter(newFilters) {
  filters.keyword = newFilters.keyword || ''
  filters.kategoriId = newFilters.kategoriId
  filters.hargaMin = newFilters.hargaMin
  filters.hargaMax = newFilters.hargaMax
  filters.sort = newFilters.sort || ''
  fetchKatalogData(0)
}

function handleResetFilter() {
  filters.keyword = ''
  filters.kategoriId = null
  filters.hargaMin = ''
  filters.hargaMax = ''
  filters.sort = ''
  fetchKatalogData(0)
}

function handlePageChange(newPage) {
  fetchKatalogData(newPage)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleMobileFilter() {
  isMobileFilterOpen.value = !isMobileFilterOpen.value
}

onMounted(() => {
  loadCategories()
  fetchKatalogData(0)
})
</script>

<template>
  <div class="katalog-page">
    <Navbar />

    <main class="main-content">
      <div class="content-container">
        <!-- Header Judul & Tombol Filter Mobile -->
        <div class="katalog-header">
          <div class="header-titles">
            <h1 class="page-title">Katalog Jasa Digital</h1>
            <p class="page-subtitle">
              Temukan talenta freelancer mahasiswa terpercaya untuk mendukung pertumbuhan bisnis UMKM Anda.
            </p>
          </div>

          <div class="mobile-actions-bar">
            <button
              type="button"
              class="btn-mobile-filter"
              @click="toggleMobileFilter"
              aria-label="Buka filter pencarian"
            >
              <svg class="icon-filter" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.972.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Filter & Urutkan</span>
            </button>
          </div>
        </div>

        <!-- Layout 2 Kolom: Sidebar di Kiri, Grid di Kanan -->
        <div class="catalog-layout">
          <!-- Sidebar Filter -->
          <div class="sidebar-column">
            <FilterSidebar
              :categories="categories"
              :initial-keyword="filters.keyword"
              :initial-kategori-id="filters.kategoriId"
              :initial-harga-min="filters.hargaMin"
              :initial-harga-max="filters.hargaMax"
              :initial-sort="filters.sort"
              :backend-field-errors="backendFieldErrors"
              :is-mobile-open="isMobileFilterOpen"
              @apply-filter="handleApplyFilter"
              @reset-filter="handleResetFilter"
              @close-mobile="isMobileFilterOpen = false"
            />
          </div>

          <!-- Kolom Konten Hasil Katalog -->
          <div class="catalog-results-column">
            <!-- 1. State Loading -->
            <div v-if="isLoading" class="state-container loading-state">
              <div class="spinner" aria-hidden="true"></div>
              <p class="state-text">Sedang memuat katalog jasa...</p>
            </div>

            <!-- 2. State Gagal / Error -->
            <div v-else-if="errorMessage" class="state-container error-state" role="alert">
              <div class="state-icon-circle error-circle" aria-hidden="true">!</div>
              <h2 class="state-title">Gagal Memuat Katalog</h2>
              <p class="state-text">{{ errorMessage }}</p>
              <div class="error-actions">
                <button
                  type="button"
                  class="btn-primary-action"
                  @click="fetchKatalogData(currentPage)"
                >
                  Coba Lagi
                </button>
                <p class="auth-hint">
                  Catatan: Halaman ini memerlukan token peran <strong>UMKM</strong>. Anda dapat mengatur token uji lewat ikon profil di pojok kanan atas.
                </p>
              </div>
            </div>

            <!-- 3. State Kosong (Empty) -->
            <div v-else-if="paketList.length === 0" class="state-container empty-state">
              <div class="state-icon-circle empty-circle" aria-hidden="true">✕</div>
              <h2 class="state-title">Jasa Tidak Ditemukan</h2>
              <p class="state-text">
                Tidak ada paket jasa yang cocok dengan kriteria filter Anda. Coba longgarkan atau hapus filter pencarian Anda.
              </p>
              <button
                type="button"
                class="btn-primary-action"
                @click="handleResetFilter"
              >
                Hapus Filter
              </button>
            </div>

            <!-- 4. Daftar Kartu Paket Jasa -->
            <div v-else class="catalog-grid-wrapper">
              <div class="catalog-grid">
                <PaketCard
                  v-for="paket in paketList"
                  :key="paket.id"
                  :paket="paket"
                />
              </div>

              <!-- Paginasi -->
              <Pagination
                :current-page="currentPage"
                :total-pages="totalPages"
                :total-elements="totalElements"
                @change-page="handlePageChange"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.katalog-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
}

.main-content {
  flex: 1;
  padding: 32px 16px 64px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

.katalog-header {
  margin-bottom: 28px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
}

.header-titles {
  max-width: 700px;
}

.page-title {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.5px;
}

.page-subtitle {
  margin: 0;
  font-size: 15px;
  color: #6b7280;
  line-height: 1.5;
}

.mobile-actions-bar {
  display: none;
}

.btn-mobile-filter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 16px;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  cursor: pointer;
}

.icon-filter {
  width: 18px;
  height: 18px;
  color: #4b5563;
}

/* Layout 2 Kolom */
.catalog-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 28px;
  align-items: flex-start;
}

.sidebar-column {
  position: sticky;
  top: 80px;
}

.catalog-results-column {
  min-width: 0;
}

/* Grid Kartu Paket Jasa */
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* Container State */
.state-container {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #111827;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.state-icon-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.error-circle {
  background-color: #fee2e2;
  color: #dc2626;
}

.empty-circle {
  background-color: #f3f4f6;
  color: #6b7280;
}

.state-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.state-text {
  margin: 0 0 20px;
  font-size: 14px;
  color: #6b7280;
  max-width: 480px;
  line-height: 1.5;
}

.btn-primary-action {
  min-height: 44px;
  padding: 10px 24px;
  background-color: #111827;
  color: #ffffff;
  border: 1px solid #111827;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-primary-action:hover {
  background-color: #1f2937;
}

.auth-hint {
  font-size: 12px;
  color: #6b7280;
  margin-top: 14px;
  max-width: 440px;
}

/* Responsif Layar Menengah (Tablet) */
@media (max-width: 1024px) {
  .catalog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Responsif Layar Kecil (Smartphone / Mobile) */
@media (max-width: 900px) {
  .catalog-layout {
    grid-template-columns: 1fr;
  }

  .sidebar-column {
    display: none;
  }

  .mobile-actions-bar {
    display: block;
    width: 100%;
  }

  .btn-mobile-filter {
    width: 100%;
    justify-content: center;
  }

  .catalog-grid {
    grid-template-columns: 1fr;
  }

  .main-content {
    padding: 20px 12px 48px;
  }

  .page-title {
    font-size: 22px;
  }
}
</style>
