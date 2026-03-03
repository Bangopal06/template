# Fix Storage RLS Error

Error: `new row violates row-level security policy`

## Penyebab

Supabase Storage memerlukan authentication dari Supabase Auth, tapi aplikasi ini menggunakan JWT custom. Solusinya adalah menggunakan Service Role Key untuk bypass RLS.

## Solusi: Gunakan Service Role Key

### 1. Get Service Role Key dari Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Klik **Project Settings** (icon gear)
4. Klik **API** di sidebar
5. Scroll ke bawah ke section **Project API keys**
6. Copy **service_role** key (bukan anon key!)
   - ⚠️ **PENTING**: Service role key adalah SECRET, jangan commit ke git!

### 2. Tambahkan ke .env

Tambahkan service role key ke file `.env`:

```env
# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
```

### 3. Setup Storage Bucket

1. Buka **Storage** di Supabase Dashboard
2. Klik **New bucket**
3. Nama: `avatars`
4. **Public bucket**: ✅ Centang (agar foto bisa diakses publik)
5. Klik **Create bucket**

### 4. Disable RLS atau Buat Policy Allow All

**Option A: Disable RLS (Paling Mudah)**

1. Klik bucket **avatars**
2. Klik tab **Policies**
3. Toggle **Disable RLS** di atas

**Option B: Buat Policy Allow All**

1. Klik bucket **avatars**
2. Klik tab **Policies**
3. Klik **New Policy** > **For full customization**
4. Isi:
   - Policy name: `Allow All Operations`
   - Allowed operations: ✅ SELECT, INSERT, UPDATE, DELETE
   - Policy definition: `true`
5. Klik **Review** > **Save policy**

### 5. Restart Dev Server

```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### 6. Test Upload

1. Login ke aplikasi
2. Buka **Profile**
3. Upload foto (max 2MB)
4. Foto harus berhasil diupload

## Troubleshooting

### Error: "Supabase admin client not configured"

- Pastikan `SUPABASE_SERVICE_ROLE_KEY` sudah ditambahkan ke `.env`
- Restart dev server

### Error: "Bucket not found"

- Pastikan bucket `avatars` sudah dibuat di Supabase
- Check nama bucket benar (case-sensitive)

### Foto tidak muncul

- Pastikan bucket adalah **public**
- Check URL foto di browser
- Verify CORS settings

### Error: "File size exceeds limit"

- Compress foto sebelum upload
- Max size: 2MB

## Alternative: Gunakan URL Eksternal

Jika tidak mau setup Supabase Storage, gunakan metode "URL Gambar" di form profile:

1. Upload foto ke service eksternal:
   - [ImgBB](https://imgbb.com) - Free unlimited
   - [Cloudinary](https://cloudinary.com) - Free 25GB
   - [Imgur](https://imgur.com) - Free unlimited

2. Copy URL foto

3. Paste di form profile (tab "URL Gambar")

## Security Notes

⚠️ **PENTING**:
- Service Role Key bypass semua RLS policies
- Jangan expose service role key ke client-side
- Jangan commit service role key ke git
- Gunakan hanya di server-side (API routes)

## Kenapa Pakai Service Role?

Aplikasi ini menggunakan JWT custom (bukan Supabase Auth), jadi:
- User tidak ter-authenticate di Supabase Auth
- RLS policies tidak bisa verify user
- Solusi: Upload via server-side dengan service role key yang bypass RLS

Ini aman karena:
- Upload dilakukan di API route (server-side)
- User sudah ter-authenticate dengan JWT custom
- File validation dilakukan di server
