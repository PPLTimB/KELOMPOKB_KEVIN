<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/common/Navbar.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import KategoriFormModal from '@/components/kategori/KategoriFormModal.vue'
import {
  getAllKategoriAdmin,
  createKategoriAdmin,
  updateKategoriAdmin,
  deleteKategoriAdmin,
} from '@/api/kategori'
import { getCurrentUser } from '@/utils/auth'

const currentUser = ref(getCurrentUser())
const rawKategoriList = ref([])
const isLoading = ref(true)
const pageErrorMessage = ref('')
const pageSuccessMessage = ref('')

// State Modal Form
const showFormModal = ref(false)
const isEditMode = ref(false)
const selectedCategory = ref(null)
const modalServerError = ref('')
const modalServerFieldErrors = ref({})
const isSubmitting = ref(false)

// State Modal Konfirmasi Hapus
const showConfirmDelete = ref(false)
const categoryToDelete = ref(null)

const isAdmin = computed(() => currentUser.value?.role === 'ADMIN')

// Struktur Hierarki Kategori: Memisahkan kategori induk (parentId === null) dan sub-kategori
const categoryTree = computed(() => {
  const rootCategories = rawKategoriList.value.filter((cat) => !cat.parentId)
  const subCategories = rawKategoriList.value.filter((cat) => cat.parentId)

  return rootCategories.map((root) => {
    const subs = subCategories.filter((sub) => sub.parentId === root.id)
    return {
      ...root,
      subs,
    }
  })
})

// Daftar kategori yang dapat dijadikan induk (kategori tingkat atas yang bukan dirinya sendiri)
const availableParentCategories = computed(() => {
  if (!isEditMode.value || !selectedCategory.value) {
    return rawKategoriList.value.filter((c) => !c.parentId)
  }
  // Saat edit, tidak boleh memilih dirinya sendiri
  return rawKategoriList.value.filter((c) => !c.parentId && c.id !== selectedCategory.value.id)
})

async function fetchCategories() {
  isLoading.value = true
  pageErrorMessage.value = ''

  try {
    const res = await getAllKategoriAdmin()
    if (res && res.data) {
      rawKategoriList.value = res.data
    }
  } catch (err) {
    pageErrorMessage.value = err.message || 'Gagal memuat daftar kategori.'
  } finally {
    isLoading.value = false
  }
}

function openAddModal(parentId = null) {
  isEditMode.value = false
  modalServerError.value = ''
  modalServerFieldErrors.value = {}
  selectedCategory.value = {
    id: null,
    nama: '',
    deskripsi: '',
    parentId: parentId,
    active: true,
  }
  showFormModal.value = true
}

function openEditModal(category) {
  isEditMode.value = true
  modalServerError.value = ''
  modalServerFieldErrors.value = {}
  selectedCategory.value = {
    id: category.id,
    nama: category.nama,
    deskripsi: category.deskripsi || '',
    parentId: category.parentId || null,
    active: category.active,
  }
  showFormModal.value = true
}

async function handleFormSubmit(formData) {
  isSubmitting.value = true
  modalServerError.value = ''
  modalServerFieldErrors.value = {}
  pageSuccessMessage.value = ''

  try {
    if (isEditMode.value) {
      const payload = {
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        parentId: formData.parentId,
        active: formData.active,
      }
      await updateKategoriAdmin(formData.id, payload)
      pageSuccessMessage.value = `Kategori '${formData.nama}' berhasil diperbarui.`
    } else {
      const payload = {
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        parentId: formData.parentId,
      }
      await createKategoriAdmin(payload)
      pageSuccessMessage.value = `Kategori '${formData.nama}' berhasil ditambahkan.`
    }

    showFormModal.value = false
    await fetchCategories()
  } catch (err) {
    modalServerError.value = err.message || 'Gagal menyimpan kategori.'
    if (err.fieldErrors) {
      modalServerFieldErrors.value = err.fieldErrors
    }
  } finally {
    isSubmitting.value = false
  }
}

function askDeleteCategory(category) {
  categoryToDelete.value = category
  showConfirmDelete.value = true
  pageErrorMessage.value = ''
  pageSuccessMessage.value = ''
}

async function executeDeleteCategory() {
  if (!categoryToDelete.value) return

  const catName = categoryToDelete.value.nama
  const catId = categoryToDelete.value.id
  showConfirmDelete.value = false

  try {
    await deleteKategoriAdmin(catId)
    pageSuccessMessage.value = `Kategori '${catName}' berhasil dihapus.`
    await fetchCategories()
  } catch (err) {
    pageErrorMessage.value = err.message || `Gagal menghapus kategori '${catName}'.`
  } finally {
    categoryToDelete.value = null
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<template>
  <div class="admin-kategori-page">
    <Navbar />

    <main class="main-content">
      <div class="content-container">
        <!-- Header Halaman -->
        <div class="admin-header">
          <div>
            <h1 class="page-title">Kelola Kategori Jasa</h1>
            <p class="page-subtitle">
              Atur hierarki kategori dan sub-kategori jasa digital untuk marketplace JEMARI.
            </p>
          </div>

          <div class="header-actions">
            <button
              v-if="isAdmin"
              type="button"
              class="btn-add-category"
              @click="openAddModal(null)"
            >
              + Tambah Kategori Utama
            </button>
          </div>
        </div>

        <!-- Banner Pesan Sukses / Error Halaman -->
        <div v-if="pageSuccessMessage" class="alert-box alert-success" role="status">
          <span>{{ pageSuccessMessage }}</span>
          <button type="button" class="btn-dismiss" @click="pageSuccessMessage = ''">✕</button>
        </div>

        <div v-if="pageErrorMessage" class="alert-box alert-danger" role="alert">
          <span>{{ pageErrorMessage }}</span>
          <button type="button" class="btn-dismiss" @click="pageErrorMessage = ''">✕</button>
        </div>

        <!-- Peringatan Hak Akses Role ADMIN -->
        <div v-if="!isAdmin" class="role-warning-card" role="alert">
          <div class="warning-icon" aria-hidden="true">⚠️</div>
          <div class="warning-content">
            <h2 class="warning-title">Akses Khusus Administrator</h2>
            <p class="warning-desc">
              Halaman ini memerlukan token autentikasi dengan peran <strong>ADMIN</strong>.
              Saat ini Anda belum memasang token atau sedang menggunakan peran lain.
            </p>
            <p class="warning-instruction">
              Silakan klik menu avatar pengguna di bilah navigasi kanan atas untuk menempelkan token uji ADMIN.
            </p>
          </div>
        </div>

        <!-- Konten Pohon Kategori -->
        <div v-else class="kategori-table-card">
          <!-- State Loading -->
          <div v-if="isLoading" class="loading-state">
            <div class="spinner" aria-hidden="true"></div>
            <p>Sedang memuat data kategori...</p>
          </div>

          <!-- State Kosong -->
          <div v-else-if="categoryTree.length === 0" class="empty-state">
            <p class="empty-text">Belum ada kategori yang terdaftar.</p>
            <button
              type="button"
              class="btn-add-category"
              @click="openAddModal(null)"
            >
              + Buat Kategori Pertama
            </button>
          </div>

          <!-- Daftar Hierarki Kategori -->
          <div v-else class="tree-list-wrapper">
            <div
              v-for="parent in categoryTree"
              :key="parent.id"
              class="parent-category-block"
            >
              <!-- Baris Kategori Induk -->
              <div class="category-row parent-row">
                <div class="category-info-col">
                  <div class="category-title-line">
                    <span class="category-title font-bold">{{ parent.nama }}</span>
                    <span
                      class="status-pill"
                      :class="parent.active ? 'status-active' : 'status-inactive'"
                    >
                      {{ parent.active ? 'Aktif' : 'Nonaktif' }}
                    </span>
                    <span class="sub-counter-pill">
                      {{ parent.subs.length }} Sub-kategori
                    </span>
                  </div>
                  <p v-if="parent.deskripsi" class="category-description">
                    {{ parent.deskripsi }}
                  </p>
                </div>

                <div class="category-actions-col">
                  <button
                    type="button"
                    class="btn-row-action btn-sub-add"
                    @click="openAddModal(parent.id)"
                    title="Tambah Sub-kategori di bawah kategori ini"
                  >
                    + Sub
                  </button>
                  <button
                    type="button"
                    class="btn-row-action btn-edit"
                    @click="openEditModal(parent)"
                  >
                    Ubah
                  </button>
                  <button
                    type="button"
                    class="btn-row-action btn-delete"
                    @click="askDeleteCategory(parent)"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              <!-- Daftar Sub-kategori -->
              <div v-if="parent.subs && parent.subs.length > 0" class="sub-categories-wrapper">
                <div
                  v-for="sub in parent.subs"
                  :key="sub.id"
                  class="category-row sub-row"
                >
                  <div class="category-info-col">
                    <div class="category-title-line">
                      <span class="sub-arrow" aria-hidden="true">└─</span>
                      <span class="category-title">{{ sub.nama }}</span>
                      <span
                        class="status-pill status-mini"
                        :class="sub.active ? 'status-active' : 'status-inactive'"
                      >
                        {{ sub.active ? 'Aktif' : 'Nonaktif' }}
                      </span>
                    </div>
                    <p v-if="sub.deskripsi" class="category-description sub-desc">
                      {{ sub.deskripsi }}
                    </p>
                  </div>

                  <div class="category-actions-col">
                    <button
                      type="button"
                      class="btn-row-action btn-edit"
                      @click="openEditModal(sub)"
                    >
                      Ubah
                    </button>
                    <button
                      type="button"
                      class="btn-row-action btn-delete"
                      @click="askDeleteCategory(sub)"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Form Tambah/Ubah Kategori -->
    <KategoriFormModal
      :show="showFormModal"
      :is-edit="isEditMode"
      :category-data="selectedCategory"
      :available-parents="availableParentCategories"
      :server-error="modalServerError"
      :server-field-errors="modalServerFieldErrors"
      :is-submitting="isSubmitting"
      @close="showFormModal = false"
      @submit="handleFormSubmit"
    />

    <!-- Modal Konfirmasi Hapus -->
    <ConfirmDialog
      :show="showConfirmDelete"
      title="Hapus Kategori Jasa"
      :message="`Apakah Anda yakin ingin menghapus kategori '${categoryToDelete?.nama}'? Kategori yang memiliki sub-kategori atau sedang digunakan oleh paket jasa tidak dapat dihapus.`"
      confirm-text="Ya, Hapus Kategori"
      cancel-text="Batal"
      :danger="true"
      @confirm="executeDeleteCategory"
      @cancel="showConfirmDelete = false"
    />
  </div>
</template>

<style scoped>
.admin-kategori-page {
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
  max-width: 1000px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.page-title {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 800;
  color: #111827;
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.btn-add-category {
  min-height: 44px;
  padding: 10px 20px;
  background-color: #111827;
  color: #ffffff;
  border: 1px solid #111827;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-add-category:hover {
  background-color: #1f2937;
}

/* Alert Boxes */
.alert-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
}

.alert-success {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
}

.alert-danger {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.btn-dismiss {
  background: none;
  border: none;
  font-size: 16px;
  color: inherit;
  cursor: pointer;
  padding: 4px 8px;
}

/* Role Warning */
.role-warning-card {
  background-color: #ffffff;
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 32px 24px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.warning-icon {
  font-size: 36px;
}

.warning-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #92400e;
}

.warning-desc {
  margin: 0 0 8px;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
}

.warning-instruction {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

/* Card Tabel / Pohon */
.kategori-table-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.loading-state,
.empty-state {
  padding: 48px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e5e7eb;
  border-top-color: #111827;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-text {
  color: #6b7280;
  font-size: 15px;
  margin-bottom: 16px;
}

/* Hierarki Kategori */
.tree-list-wrapper {
  display: flex;
  flex-direction: column;
}

.parent-category-block {
  border-bottom: 1px solid #e5e7eb;
}

.parent-category-block:last-child {
  border-bottom: none;
}

.category-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  gap: 16px;
}

.parent-row {
  background-color: #ffffff;
}

.sub-row {
  background-color: #f9fafb;
  border-top: 1px dashed #e5e7eb;
  padding-left: 44px;
}

.category-info-col {
  flex: 1;
  min-width: 0;
}

.category-title-line {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sub-arrow {
  color: #9ca3af;
  font-family: monospace;
  font-size: 14px;
}

.category-title {
  font-size: 15px;
  color: #111827;
}

.font-bold {
  font-weight: 700;
  font-size: 16px;
}

.status-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 9999px;
}

.status-active {
  background-color: #dcfce7;
  color: #15803d;
}

.status-inactive {
  background-color: #fee2e2;
  color: #b91c1c;
}

.sub-counter-pill {
  font-size: 11px;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 2px 8px;
  border-radius: 6px;
}

.category-description {
  margin: 4px 0 0;
  font-size: 13px;
  color: #6b7280;
}

.sub-desc {
  margin-left: 24px;
}

.category-actions-col {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-row-action {
  min-height: 38px;
  min-width: 44px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-sub-add {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-sub-add:hover {
  background-color: #e5e7eb;
  color: #111827;
}

.btn-edit {
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-edit:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.btn-delete {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.btn-delete:hover {
  background-color: #fca5a5;
  color: #b91c1c;
}

@media (max-width: 640px) {
  .category-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .sub-row {
    padding-left: 20px;
  }

  .category-actions-col {
    width: 100%;
    justify-content: flex-end;
  }

  .btn-row-action {
    flex: 1;
    text-align: center;
  }
}
</style>

