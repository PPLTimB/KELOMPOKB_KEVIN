<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCurrentUser, setToken, removeToken, getToken } from '@/utils/auth'

const router = useRouter()
const route = useRoute()

const currentUser = ref(getCurrentUser())
const showTokenModal = ref(false)
const inputToken = ref('')
const tokenMessage = ref('')

function refreshUser() {
  currentUser.value = getCurrentUser()
}

onMounted(() => {
  refreshUser()
})

const isUmkm = computed(() => currentUser.value?.role === 'UMKM')
const isAdmin = computed(() => currentUser.value?.role === 'ADMIN')

const activeRoleLabel = computed(() => {
  if (!currentUser.value) return 'Tamu (Belum Login)'
  if (currentUser.value.isExpired) return 'Token Kedaluwarsa'
  return currentUser.value.role || 'Pengguna'
})

function openTokenModal() {
  inputToken.value = getToken() || ''
  tokenMessage.value = ''
  showTokenModal.value = true
}

function closeTokenModal() {
  showTokenModal.value = false
}

function simpanToken() {
  if (!inputToken.value.trim()) {
    removeToken()
    tokenMessage.value = 'Token berhasil dihapus.'
  } else {
    setToken(inputToken.value.trim())
    tokenMessage.value = 'Token berhasil disimpan!'
  }
  refreshUser()
  setTimeout(() => {
    closeTokenModal()
    window.location.reload()
  }, 400)
}

function hapusTokenAktif() {
  removeToken()
  inputToken.value = ''
  refreshUser()
  tokenMessage.value = 'Token dihapus.'
  setTimeout(() => {
    closeTokenModal()
    window.location.reload()
  }, 400)
}
</script>

<template>
  <header class="navbar">
    <div class="nav-container">
      <div class="nav-left">
        <router-link to="/katalog" class="brand-link" aria-label="Beranda JEMARI">
          <span class="brand-name">JEMARI</span>
        </router-link>
      </div>

      <nav class="nav-links" aria-label="Navigasi Utama">
        <router-link
          to="/katalog"
          class="nav-link"
          :class="{ active: route.path.startsWith('/katalog') || route.path.startsWith('/paket') }"
        >
          Katalog
        </router-link>

        <!-- Tautan Kelola Kategori hanya ditampilkan jika pengguna memiliki role ADMIN -->
        <router-link
          v-if="isAdmin"
          to="/admin/kategori"
          class="nav-link"
          :class="{ active: route.path.startsWith('/admin/kategori') }"
        >
          Kelola Kategori
        </router-link>
      </nav>

      <div class="nav-right">
        <!-- Tombol avatar & token pengujian -->
        <button
          type="button"
          class="user-pill-btn"
          @click="openTokenModal"
          :title="`Klik untuk mengelola token uji coba (Peran: ${activeRoleLabel})`"
          :aria-label="`Pengaturan token pengguna. Peran saat ini: ${activeRoleLabel}`"
        >
          <span class="role-badge" :class="isAdmin ? 'badge-admin' : isUmkm ? 'badge-umkm' : 'badge-guest'">
            {{ activeRoleLabel }}
          </span>
          <span class="avatar-circle" aria-hidden="true">
            {{ currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : '?' }}
          </span>
        </button>
      </div>
    </div>

    <!-- Modal Pengaturan Token Uji Coba Pengembang -->
    <div
      v-if="showTokenModal"
      class="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-token-title"
      @click.self="closeTokenModal"
    >
      <div class="modal-card">
        <div class="modal-header">
          <h2 id="modal-token-title" class="modal-title">Token Autentikasi Uji Coba</h2>
          <button type="button" class="btn-close" @click="closeTokenModal" aria-label="Tutup modal">×</button>
        </div>

        <div class="modal-body">
          <p class="modal-desc">
            Backend JEMARI mewajibkan token JWT pada header <code>Authorization: Bearer &lt;token&gt;</code>.
            Katalog jasa membutuhkan peran <strong>UMKM</strong>, sedangkan Kelola Kategori membutuhkan peran <strong>ADMIN</strong>.
          </p>

          <div class="form-group">
            <label for="jwt-token-input" class="form-label">JWT Token (Bearer):</label>
            <textarea
              id="jwt-token-input"
              v-model="inputToken"
              rows="4"
              class="token-textarea"
              placeholder="Tempelkan token JWT di sini (contoh: eyJhbGciOiJIUzI1Ni...)"
            ></textarea>
          </div>

          <div v-if="currentUser" class="token-info-box">
            <div><strong>Subjek/Email:</strong> {{ currentUser.email || '-' }}</div>
            <div><strong>Peran (Role):</strong> {{ currentUser.role || '-' }}</div>
            <div v-if="currentUser.isExpired" class="text-danger"><strong>Status:</strong> Token sudah kedaluwarsa</div>
          </div>

          <p v-if="tokenMessage" class="token-feedback">{{ tokenMessage }}</p>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="hapusTokenAktif">
            Hapus Token
          </button>
          <button type="button" class="btn-primary" @click="simpanToken">
            Simpan & Gunakan
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left {
  display: flex;
  align-items: center;
}

.brand-link {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.brand-name {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #111827;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  font-size: 15px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}

.nav-link:hover {
  color: #111827;
  background-color: #f3f4f6;
}

.nav-link.active {
  color: #111827;
  font-weight: 700;
  border-bottom: 2px solid #111827;
  border-radius: 6px 6px 0 0;
}

.nav-right {
  display: flex;
  align-items: center;
}

.user-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-height: 44px;
}

.user-pill-btn:hover {
  background-color: #f3f4f6;
}

.role-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 9999px;
}

.badge-umkm {
  background-color: #e0f2fe;
  color: #0369a1;
}

.badge-admin {
  background-color: #fef3c7;
  color: #b45309;
}

.badge-guest {
  background-color: #f3f4f6;
  color: #6b7280;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #111827;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

/* Modal Styling */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 100;
}

.modal-card {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  padding: 18px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #111827;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.btn-close:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.modal-body {
  padding: 20px 24px;
}

.modal-desc {
  font-size: 14px;
  color: #4b5563;
  margin-top: 0;
  margin-bottom: 16px;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
  color: #374151;
}

.token-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  font-family: monospace;
  font-size: 13px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  resize: vertical;
}

.token-textarea:focus {
  outline: none;
  border-color: #111827;
  box-shadow: 0 0 0 2px rgba(17, 24, 39, 0.15);
}

.token-info-box {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
  color: #374151;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.text-danger {
  color: #dc2626;
}

.token-feedback {
  font-size: 14px;
  color: #16a34a;
  font-weight: 600;
  margin: 0;
}

.modal-footer {
  padding: 16px 24px;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-secondary {
  min-height: 44px;
  padding: 10px 16px;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #f3f4f6;
}

.btn-primary {
  min-height: 44px;
  padding: 10px 20px;
  background-color: #111827;
  border: 1px solid #111827;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #1f2937;
}

@media (max-width: 640px) {
  .nav-container {
    height: 56px;
  }

  .role-badge {
    display: none;
  }
}
</style>
