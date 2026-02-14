# Skillvers - Learning Support System Frontend

Skillvers adalah platform pendukung pembelajaran (Learning Support System) yang dirancang khusus untuk siswa kelas 12 dalam mempersiapkan ujian akhir mereka. Platform ini menyediakan akses ke berbagai materi pembelajaran, kuis interaktif, dan pemantauan progres belajar secara terstruktur dan efisien.

Aplikasi ini menonjolkan pengalaman pengguna (UX) yang premium dengan desain modern, bersih, dan performa tinggi menggunakan teknologi web terkini.

## ✨ Fitur Utama
- **Katalog Materi Lengkap**: Daftar subjek dan kategori materi yang terorganisir.
- **Mega Menu Kategori**: Navigasi materi yang intuitif dan responsif.
- **Sistem Kuis Interaktif**: Uji pemahaman materi dengan kuis yang memiliki evaluasi skor langsung.
- **Progres Belajar**: Pantau sejauh mana materi telah dipelajari.
- **Modern UI/UX**: Desain premium menggunakan font Poppins, animasi smooth, dan layout yang responsif.
- **Autentikasi Aman**: Sistem login dan register yang aman dengan fitur toggle password.
- **Skeleton Loading**: Pengalaman pemuatan data yang halus dengan skeleton screen.

## 🛠 Spesifikasi Teknis (Valid)
Proyek ini dibangun menggunakan stack teknologi modern berikut:

- **Core Library**: [React.js v18.3.1](https://reactjs.org/)
- **Build Tool**: [Vite v5.4.11](https://vitejs.dev/)
- **Routing**: [React Router DOM v6.22.0](https://reactrouter.com/)
- **API Client**: [Axios v1.6.7](https://axios-http.com/)
- **Styling**: Vanilla CSS dengan custom design system (BEM & Utility-first)
- **Icons**: [Lucide React v0.563.0](https://lucide.dev/)
- **Font**: Poppins (Google Fonts)
- **Deployment Ready**: Terkonfigurasi untuk Vercel melalui `vercel.json`

## 💻 Cara Menjalankan di Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di mesin lokal Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (Versi 18 atau lebih baru direkomendasikan)
- npm (biasanya terinstal bersama Node.js)

### 2. Clone Repositori
```bash
git clone https://github.com/jelitarahma/frontend-learning-support-sistem.git
cd frontend-learning-support-sistem
```

### 3. Instal Dependensi
Gunakan npm untuk menginstal semua library yang diperlukan:
```bash
npm install
```

### 4. Konfigurasi Environment (Jika ada)
Pastikan API backend berjalan. Ubah `API_BASE_URL` di dalam kode (biasanya di `src/api/apiClient.js`) jika diperlukan.

### 5. Jalankan Development Server
```bash
npm run dev
```
Aplikasi akan tersedia di `http://localhost:5173`.

### 6. Build untuk Produksi
```bash
npm run build
```
Hasil build akan tersedia di folder `dist/`.

## 🚀 Deployment ke Vercel

Proyek ini sudah dilengkapi dengan `vercel.json` untuk menangani routing Single Page Application (SPA). Untuk deploy:
1. Hubungkan akun GitHub Anda ke Vercel.
2. Pilih repositori `frontend-learning-support-sistem`.
3. Gunakan pengaturan default (Vite).
4. Klik **Deploy**.

---
**Dibuat oleh Jelita Rahma Ayu Guntari | BINUS Online 2026**
