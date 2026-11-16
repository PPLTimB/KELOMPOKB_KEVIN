<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalElements: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['changePage'])

function goToPrevious() {
  if (props.currentPage > 0) {
    emit('changePage', props.currentPage - 1)
  }
}

function goToNext() {
  if (props.currentPage < props.totalPages - 1) {
    emit('changePage', props.currentPage + 1)
  }
}
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination-container" aria-label="Navigasi Halaman Katalog">
    <button
      type="button"
      class="page-btn prev-btn"
      :disabled="currentPage === 0"
      @click="goToPrevious"
      aria-label="Halaman Sebelumnya"
    >
      <span aria-hidden="true">‹</span> Sebelumnya
    </button>

    <div class="page-indicator">
      <span class="page-current">Halaman {{ currentPage + 1 }}</span>
      <span class="page-total">dari {{ totalPages }}</span>
      <span class="elements-total">({{ totalElements }} jasa)</span>
    </div>

    <button
      type="button"
      class="page-btn next-btn"
      :disabled="currentPage >= totalPages - 1"
      @click="goToNext"
      aria-label="Halaman Selanjutnya"
    >
      Selanjutnya <span aria-hidden="true">›</span>
    </button>
  </nav>
</template>

<style scoped>
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 0;
  margin-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  min-width: 110px;
  padding: 10px 16px;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  background-color: #f9fafb;
}

.page-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #4b5563;
  flex-wrap: wrap;
  justify-content: center;
}

.page-current {
  font-weight: 700;
  color: #111827;
}

.elements-total {
  color: #6b7280;
  font-size: 13px;
}

@media (max-width: 640px) {
  .pagination-container {
    flex-direction: column;
    gap: 14px;
  }

  .page-btn {
    width: 100%;
  }

  .page-indicator {
    order: -1;
  }
}
</style>

