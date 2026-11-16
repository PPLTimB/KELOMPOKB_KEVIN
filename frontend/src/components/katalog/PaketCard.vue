<script setup>
import { computed } from 'vue'
import { formatRupiahSingkat } from '@/utils/formatters'

const props = defineProps({
  paket: {
    type: Object,
    required: true,
  },
})

const formattedPrice = computed(() => {
  return formatRupiahSingkat(props.paket.hargaMulai)
})

const freelancerName = computed(() => {
  return props.paket.freelancer?.fullName || 'Freelancer JEMARI'
})

const categoryName = computed(() => {
  return props.paket.namaKategori || 'Kategori Umum'
})
</script>

<template>
  <article class="paket-card">
    <!-- Area Gambar / Wireframe Cross Placeholder -->
    <div class="card-image-area" aria-hidden="true">
      <svg class="placeholder-cross" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100" y2="100" stroke="#d1d5db" stroke-width="1.5" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#d1d5db" stroke-width="1.5" />
      </svg>
      <div class="image-center-label">Jasa Digital</div>

      <!-- Badge Baru (Hanya jika flag baru dari backend bernilai true) -->
      <span v-if="paket.baru" class="badge-baru" aria-label="Freelancer Baru">
        Baru
      </span>
    </div>

    <!-- Informasi Paket -->
    <div class="card-body">
      <div class="card-category">{{ categoryName }}</div>

      <h3 class="card-title">
        <router-link :to="`/paket/${paket.id}`" class="title-link">
          {{ paket.judul }}
        </router-link>
      </h3>

      <div class="freelancer-info">
        <span class="freelancer-avatar" aria-hidden="true">
          {{ freelancerName.charAt(0).toUpperCase() }}
        </span>
        <span class="freelancer-name">{{ freelancerName }}</span>
      </div>

      <div class="card-footer">
        <div class="price-container">
          <span class="price-prefix">Mulai dari</span>
          <span class="price-value">{{ formattedPrice }}</span>
        </div>

        <router-link
          :to="`/paket/${paket.id}`"
          class="card-action-link"
          :aria-label="`Lihat detail paket ${paket.judul}`"
        >
          Lihat <span class="arrow-icon" aria-hidden="true">›</span>
        </router-link>
      </div>
    </div>
  </article>
</template>

<style scoped>
.paket-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.paket-card:hover {
  border-color: #9ca3af;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Placeholder Gambar Bergaris Silang Sesuai Mockup Wireframe */
.card-image-area {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-cross {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.image-center-label {
  position: relative;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  border: 1px solid #e5e7eb;
}

.badge-baru {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #111827;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-category {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.card-title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  color: #111827;
}

.title-link {
  color: inherit;
  text-decoration: none;
}

.title-link:hover {
  text-decoration: underline;
}

.freelancer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.freelancer-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #e5e7eb;
  color: #374151;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.freelancer-name {
  font-size: 13px;
  color: #4b5563;
}

.card-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-container {
  display: flex;
  flex-direction: column;
}

.price-prefix {
  font-size: 11px;
  color: #6b7280;
}

.price-value {
  font-size: 16px;
  font-weight: 800;
  color: #111827;
}

.card-action-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.15s ease;
  min-height: 44px;
  min-width: 44px;
  justify-content: center;
}

.card-action-link:hover {
  background-color: #111827;
  color: #ffffff;
  border-color: #111827;
}

.arrow-icon {
  font-size: 16px;
  line-height: 1;
}
</style>

