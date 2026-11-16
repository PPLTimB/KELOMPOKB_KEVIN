# Frontend JEMARI (Marketplace Jasa Digital)

Frontend Single Page Application (SPA) untuk platform **JEMARI**, menghubungkan pelaku UMKM dengan freelancer pemula/mahasiswa bertalenta.

Dibangun dengan **Vue 3**, **Vite**, **Vue Router**, dan **Axios** tanpa library UI besar, menerapkan prinsip desain *mobile-first*, ringan, dan wireframe monokrom bersih sesuai proposal.

---

## Cakupan Fitur PBI-03 (JRI-16)

1. **Penelusuran Katalog Jasa Terfilter (Peran UMKM – UC-02)**
   - Pencarian kata kunci jasa/freelancer dengan debounce (menghindari request berulang di setiap ketikan).
   - Filter kategori tunggal berbasis hierarki pohon kategori (memilih induk otomatis menyertakan seluruh sub-kategori aktif di backend).
   - Filter rentang harga (Min – Max) dengan validasi interaktif di klien dan pemetaan error backend.
   - Pilihan pengurutan: "Terbaru + Acak" (default), "Harga Termurah", dan "Harga Termahal".
   - Kartu paket jasa wireframe: placeholder diagonal cross, badge "Baru" untuk freelancer baru (berdasarkan flag dari backend), harga awal eksplisit ("Mulai dari Rp X" dengan format ringkas rb/jt), dan tautan detail.
   - Paginasi ramah layar kecil.
   - Penanganan keadaan: memuat (*loading*), kosong (*empty state*), dan gagal (*error state*).
   - Halaman placeholder untuk detail paket (`/paket/:id`).

2. **Kelola Kategori Jasa (Peran ADMIN – FR-15)**
   - Visualisasi pohon kategori utama dan sub-kategori menjorok ke dalam.
   - Tambah, ubah, dan hapus kategori maupun sub-kategori melalui formulir modal.
   - Dialog konfirmasi sebelum menghapus kategori.
   - Penanganan pesan error backend yang ramah (penolakan nama kembar 409 Conflict, pencegahan hapus kategori yang masih memiliki sub-kategori atau terikat dengan paket jasa 400 Bad Request).

3. **Kompatibilitas PBI Rekan**
   - Rute `/revision-terms` milik rekan pengembang tetap dipertahankan dan dapat diakses.

---

## Prasyarat & Lingkungan

- **Node.js**: Versi `^22.18.0` atau `>=24.12.0` (terverifikasi pada Node v24.14.1)
- **NPM**: Bawaan Node.js

---

## Konfigurasi Lingkungan (.env)

Salin berkas `.env.example` menjadi `.env` di dalam folder `frontend/`:

```sh
cp .env.example .env
```

Isi berkas `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

> **Catatan:** Jangan pernah melakukan *commit* pada berkas `.env` asli. Berkas ini sudah diabaikan di `.gitignore`.

---

## Cara Menjalankan

### 1. Instalasi Dependensi
```sh
npm install
```

### 2. Menjalankan Server Pengembangan (Dev)
```sh
npm run dev
```
Aplikasi akan berjalan secara lokal di `http://localhost:5173`.

### 3. Kompilasi & Build Produksi
```sh
npm run build
```
Hasil berkas produksi akan tersimpan di direktori `dist/`.

### 4. Menjalankan Unit Test (Vitest)
```sh
npm test
```
Menjalankan pengujian otomatis untuk pemformatan Rupiah singkat (`formatRupiahSingkat`) dan validasi harga filter (`validateHarga`).

---

## Cara Menempelkan Token Uji Coba (JWT)

Backend JEMARI mengamankan endpoint menggunakan Spring Security dengan JWT Bearer Token:
- Endpoint `/api/katalog/**` mewajibkan token dengan klaim peran: `"role": "UMKM"`
- Endpoint `/api/admin/**` mewajibkan token dengan klaim peran: `"role": "ADMIN"`
- Endpoint `GET /api/kategori/**` dapat diakses oleh semua pengguna yang telah terautentikasi (*authenticated*).

Karena halaman login berada di luar lingkup PBI ini, Anda dapat menempelkan token pengujian dengan dua cara berikut:

### Opsi A: Lewat Antarmuka (UI) – Direkomendasikan
1. Buka aplikasi di browser (mis. `http://localhost:5173/katalog`).
2. Klik tombol pill peran/avatar di bilah navigasi kanan atas.
3. Modal **Token Autentikasi Uji Coba** akan terbuka.
4. Tempelkan token JWT Bearer Anda pada kolom teks yang tersedia.
5. Klik tombol **Simpan & Gunakan**. Halaman akan otomatis disegarkan dan menggunakan token tersebut untuk seluruh request Axios ke backend.
6. Untuk menghapus token, buka modal kembali dan klik **Hapus Token**.

### Opsi B: Lewat Developer Tools Console Browser
Buka Console browser (`F12` atau `Ctrl+Shift+I`) dan jalankan perintah:

```javascript
// Untuk pengujian sebagai UMKM:
localStorage.setItem('jemari_token', 'TOKEN_JWT_DENGAN_ROLE_UMKM');

// Untuk pengujian sebagai ADMIN:
localStorage.setItem('jemari_token', 'TOKEN_JWT_DENGAN_ROLE_ADMIN');

// Refresh halaman
window.location.reload();
```

---

## Struktur Direktori

```
frontend/
├── .env.example               # Contoh variabel lingkungan
├── index.html                 # HTML template utama
├── package.json               # Dependensi & script proyek
├── vite.config.js             # Konfigurasi Vite & Vitest
├── src/
│   ├── main.js                # Titik masuk Vue 3
│   ├── App.vue                # Root komponen
│   ├── assets/
│   │   └── main.css           # Styling global & reset CSS
│   ├── api/
│   │   ├── client.js          # Axios instance terpusat & interceptor token
│   │   ├── katalog.js         # Endpoint katalog jasa (/api/katalog)
│   │   └── kategori.js        # Endpoint kategori publik & admin
│   ├── utils/
│   │   ├── auth.js            # Helper token localStorage & decode payload JWT
│   │   ├── formatters.js      # Pemformat mata uang Rupiah singkat (rb/jt)
│   │   ├── validators.js      # Validasi filter harga klien
│   │   └── __tests__/         # Unit test vitest (formatters & validators)
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.vue         # Navbar atas & modal token dev
│   │   │   └── ConfirmDialog.vue  # Modal dialog konfirmasi hapus
│   │   ├── katalog/
│   │   │   ├── FilterSidebar.vue  # Bilah filter desktop & drawer mobile
│   │   │   ├── PaketCard.vue      # Kartu paket jasa wireframe monokrom
│   │   │   └── Pagination.vue     # Paginasi ramah layar sentuh
│   │   └── kategori/
│   │       └── KategoriFormModal.vue # Modal form tambah/ubah kategori
│   ├── views/
│   │   ├── KatalogView.vue                # Halaman penelusuran katalog (UC-02)
│   │   ├── PaketDetailPlaceholderView.vue # Placeholder detail paket (/paket/:id)
│   │   ├── AdminKategoriView.vue          # Halaman kelola kategori (FR-15)
│   │   └── RevisionTermsView.vue          # Halaman ketentuan revisi rekan
│   └── router/
│       └── index.js           # Definisi rute aplikasi
```
