# Panduan Deploy ke Vercel

Buku Tamu Digital SMK Muhammadiyah Bandongan telah dioptimasi untuk deployment instan ke [Vercel](https://vercel.com).

## Langkah-langkah Deployment

1. **Persiapan Repository**
   - Push kode ini ke repository GitHub, GitLab, atau Bitbucket Anda.

2. **Impor ke Vercel**
   - Masuk ke dashboard Vercel.
   - Klik **"Add New"** > **"Project"**.
   - Pilih repository yang baru saja Anda push.

3. **Konfigurasi Environment Variables**
   - Di bagian **"Environment Variables"**, masukkan kunci-kunci berikut (ambil dari file `.env.local` atau dashboard Supabase):
     - `NEXT_PUBLIC_SUPABASE_URL`: URL API Supabase Anda.
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon Key Supabase Anda.
     - `TERMAI_API_KEY`: API Key untuk layanan upload (Opsional jika ingin menggunakan provider lain).

4. **Deploy**
   - Klik **"Deploy"**. Vercel akan secara otomatis mendeteksi Next.js dan menjalankan proses build.

## Pengaturan Database Supabase
Pastikan tabel berikut tersedia di database Supabase Anda:

### 1. Tabel `userdata`
| Column | Type | Description |
|---|---|---|
| `id` | uuid (Primary Key) | Auto-generated |
| `nama` | text | Nama lengkap tamu |
| `instansi` | text | Asal instansi |
| `maksud` | text | Maksud kunjungan |
| `tujuan` | text | Kesan & pesan |
| `image_url` | text | Link foto dokumentasi |
| `signature_url` | text | Link tanda tangan digital |
| `tanggal` | timestamptz | Waktu kunjungan |

### 2. Tabel `admin`
| Column | Type | Description |
|---|---|---|
| `username` | text (Primary Key) | Username admin |
| `password` | text | Password admin |
| `is_premium` | boolean | Status fitur premium |

## Troubleshooting Build
Jika terjadi error saat build terkait `canvas`, pastikan Anda menggunakan Node.js versi 18 ke atas (Vercel menggunakan versi terbaru secara default).
