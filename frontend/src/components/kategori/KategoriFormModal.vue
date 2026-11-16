<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  categoryData: {
    type: Object,
    default: () => ({
      id: null,
      nama: '',
      deskripsi: '',
      parentId: null,
      active: true,
    }),
  },
  availableParents: {
    type: Array,
    default: () => [],
  },
  serverError: {
    type: String,
    default: '',
  },
  serverFieldErrors: {
    type: Object,
    default: () => ({}),
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'submit'])

const formNama = ref('')
const formDeskripsi = ref('')
const formParentId = ref(null)
const formActive = ref(true)
const clientNamaError = ref('')

watch(
  () => props.show,
  (isShown) => {
    if (isShown) {
      formNama.value = props.categoryData?.nama || ''
      formDeskripsi.value = props.categoryData?.deskripsi || ''
      formParentId.value = props.categoryData?.parentId ?? null
      formActive.value = props.categoryData?.active ?? true
      clientNamaError.value = ''
    }
  },
  { immediate: true }
)

function handleSubmit() {
  clientNamaError.value = ''
  const trimmedNama = formNama.value.trim()

  if (!trimmedNama) {
    clientNamaError.value = 'Nama kategori wajib diisi'
    return
  }

  if (trimmedNama.length > 100) {
    clientNamaError.value = 'Nama kategori maksimal 100 karakter'
    return
  }

  emit('submit', {
    id: props.categoryData?.id,
    nama: trimmedNama,
    deskripsi: formDeskripsi.value.trim() || null,
    parentId: formParentId.value ? Number(formParentId.value) : null,
    active: formActive.value,
  })
}
</script>

<template>
  <div
    v-if="show"
    class="modal-backdrop"
    role="dialog"
    aria-modal="true"
    aria-labelledby="category-modal-title"
    @click.self="emit('close')"
  >
    <div class="modal-card">
      <div class="modal-header">
        <h2 id="category-modal-title" class="modal-title">
          {{ isEdit ? 'Ubah Kategori Jasa' : 'Tambah Kategori Jasa' }}
        </h2>
        <button
          type="button"
          class="btn-close"
          @click="emit('close')"
          aria-label="Tutup form kategori"
        >
          ×
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Banner Error dari Server -->
        <div v-if="serverError" class="alert-error" role="alert">
          {{ serverError }}
        </div>

        <!-- 1. Nama Kategori -->
        <div class="form-group">
          <label for="cat-nama-input" class="form-label">
            Nama Kategori <span class="required-star">*</span>
          </label>
          <input
            id="cat-nama-input"
            v-model="formNama"
            type="text"
            maxlength="100"
            class="form-input"
            :class="{ 'has-error': clientNamaError || serverFieldErrors.nama }"
            placeholder="Contoh: Desain Grafis, Pembuatan Website..."
            required
          />
          <span
            v-if="clientNamaError || serverFieldErrors.nama"
            class="field-error-text"
            role="alert"
          >
            {{ clientNamaError || serverFieldErrors.nama }}
          </span>
        </div>

        <!-- 2. Kategori Induk -->
        <div class="form-group">
          <label for="cat-parent-select" class="form-label">
            Kategori Induk (Opsional)
          </label>
          <select
            id="cat-parent-select"
            v-model="formParentId"
            class="form-select"
          >
            <option :value="null">— Tidak ada (Jadikan Kategori Utama) —</option>
            <option
              v-for="parent in availableParents"
              :key="parent.id"
              :value="parent.id"
            >
              {{ parent.nama }}
            </option>
          </select>
          <span class="field-hint">
            Pilih kategori induk jika ingin menjadikannya sub-kategori.
          </span>
        </div>

        <!-- 3. Deskripsi -->
        <div class="form-group">
          <label for="cat-desc-input" class="form-label">Deskripsi</label>
          <textarea
            id="cat-desc-input"
            v-model="formDeskripsi"
            rows="3"
            class="form-textarea"
            placeholder="Jelaskan jenis layanan jasa dalam kategori ini..."
          ></textarea>
        </div>

        <!-- 4. Status Aktif (Hanya jika Mode Edit) -->
        <div v-if="isEdit" class="form-group checkbox-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formActive"
              class="checkbox-input"
            />
            <span class="checkbox-text">Kategori Aktif (Dapat dilihat di katalog jasa)</span>
          </label>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn-secondary"
            @click="emit('close')"
            :disabled="isSubmitting"
          >
            Batal
          </button>
          <button
            type="submit"
            class="btn-primary"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Kategori') }}
          </button>
        </div>
      </form>
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
  z-index: 100;
}

.modal-card {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
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
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.alert-error {
  padding: 12px 14px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.required-star {
  color: #dc2626;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  box-sizing: border-box;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background-color: #ffffff;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #111827;
  box-shadow: 0 0 0 2px rgba(17, 24, 39, 0.1);
}

.form-input.has-error {
  border-color: #dc2626;
  background-color: #fef2f2;
}

.field-error-text {
  font-size: 12px;
  color: #dc2626;
  font-weight: 500;
}

.field-hint {
  font-size: 12px;
  color: #6b7280;
}

/* Checkbox */
.checkbox-group {
  margin-top: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  min-height: 44px;
  user-select: none;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-text {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.modal-footer {
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-secondary {
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

.btn-secondary:hover:not(:disabled) {
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

.btn-primary:hover:not(:disabled) {
  background-color: #1f2937;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
