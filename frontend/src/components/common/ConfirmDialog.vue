<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Konfirmasi Tindakan',
  },
  message: {
    type: String,
    default: 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  },
  confirmText: {
    type: String,
    default: 'Ya, Lanjutkan',
  },
  cancelText: {
    type: String,
    default: 'Batal',
  },
  danger: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div
    v-if="show"
    class="modal-backdrop"
    role="dialog"
    aria-modal="true"
    aria-labelledby="confirm-dialog-title"
    @click.self="emit('cancel')"
  >
    <div class="confirm-card">
      <div class="confirm-header">
        <h3 id="confirm-dialog-title" class="confirm-title">{{ title }}</h3>
      </div>
      <div class="confirm-body">
        <p class="confirm-message">{{ message }}</p>
      </div>
      <div class="confirm-footer">
        <button
          type="button"
          class="btn-cancel"
          @click="emit('cancel')"
        >
          {{ cancelText }}
        </button>
        <button
          type="button"
          class="btn-confirm"
          :class="{ 'btn-danger': danger }"
          @click="emit('confirm')"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  z-index: 110;
}

.confirm-card {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.confirm-header {
  padding: 20px 24px 12px;
}

.confirm-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.confirm-body {
  padding: 0 24px 20px;
}

.confirm-message {
  margin: 0;
  font-size: 15px;
  color: #4b5563;
  line-height: 1.5;
}

.confirm-footer {
  padding: 16px 24px;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  min-height: 44px;
  padding: 10px 18px;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #f3f4f6;
}

.btn-confirm {
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

.btn-confirm:hover {
  background-color: #1f2937;
}

.btn-danger {
  background-color: #dc2626;
  border-color: #dc2626;
}

.btn-danger:hover {
  background-color: #b91c1c;
}
</style>
