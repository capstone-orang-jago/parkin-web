# ParkIn (Web)

ParkIn Web adalah dashboard admin untuk ParkIn Palu. Aplikasi ini dipakai untuk memantau transaksi parkir, lokasi, petugas, dan laporan operasional dari satu antarmuka web.

## Teknologi

- Next.js 16 dengan App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Recharts untuk visualisasi data

## Fitur Utama

- Autentikasi login berbasis sesi JWT
- Dashboard ringkasan KPI, grafik tren, tabel transaksi terbaru, dan performa lokasi
- Manajemen transaksi, lokasi, dan petugas
- Halaman laporan dengan filter, ringkasan KPI, chart, dan ekspor data
- Redirect otomatis dari `/` ke halaman login atau dashboard sesuai status sesi

## Menjalankan Proyek

Pasang dependensi lalu jalankan server development:

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## Skrip

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Environment Variables

Buat file `.env.local` dan isi nilai berikut:

```bash
API_BASE_URL=https://api.example.com
AUTH_SECRET=string-rahasia-minimal-16-karakter
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- `API_BASE_URL` adalah base URL backend/admin API yang dipakai untuk mengambil dan memperbarui data.
- `AUTH_SECRET` dipakai untuk menandatangani dan memverifikasi sesi JWT.
- `NEXT_PUBLIC_APP_URL` dipakai saat refresh sesi dari sisi server.

## Struktur Aplikasi

- `app/(auth)` untuk halaman autentikasi
- `app/(dashboard)` untuk area utama aplikasi
- `components/` untuk komponen UI per domain
- `lib/` untuk helper data, auth, format, dan fetch layer

## Alur Akses

- Pengguna membuka `/`
- Jika belum login, pengguna diarahkan ke `/login`
- Jika sesi valid, pengguna diarahkan ke `/dashboard`
- Route dashboard lain tersedia di `/transaksi`, `/lokasi`, `/petugas`, dan `/laporan`
