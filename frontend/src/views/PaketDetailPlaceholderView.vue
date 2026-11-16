<script setup>
import { useRoute } from 'vue-router'
import Navbar from '@/components/common/Navbar.vue'

const route = useRoute()
const paketId = route.params.id
</script>

<template>
  <div class="placeholder-page">
    <Navbar />

    <main class="main-content">
      <div class="content-card">
        <div class="wireframe-badge">Placeholder PBI Mendatang</div>
        <h1 class="page-title">Detail Paket Jasa #{{ paketId }}</h1>
        <p class="desc">
          Halaman detail lengkap paket jasa ini sedang dalam tahap pengembangan pada Product Backlog Item (PBI) terpisah.
        </p>

        <div class="action-row">
          <router-link to="/katalog" class="btn-back">
            ‹ Kembali ke Katalog Jasa
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.placeholder-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
}

.content-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 48px 32px;
  max-width: 520px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.wireframe-badge {
  display: inline-block;
  padding: 4px 12px;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 20px;
}

.page-title {
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.desc {
  margin: 0 0 28px;
  font-size: 15px;
  color: #4b5563;
  line-height: 1.6;
}

.action-row {
  display: flex;
  justify-content: center;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 10px 24px;
  background-color: #111827;
  color: #ffffff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.btn-back:hover {
  background-color: #1f2937;
}
</style>

