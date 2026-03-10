# Supabase Storage Setup Guide

Panduan lengkap setup Supabase Storage untuk upload foto profil.

## 1. Setup Storage Bucket di Supabase

### Langkah 1: Buat Storage Bucket

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Klik **Storage** di sidebar kiri
4. Klik **New bucket**
5. Isi form:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Centang (agar foto bisa diakses publik)
   - **File size limit**: 2MB (opsional)
   - **Allowed MIME types**: `image/*` (opsional)
6. Klik **Create bucket**

### Langkah 2: Setup Storage Policies (RLS)

Setelah bucket dibuat, setup policies untuk keamanan:

1. Klik bucket **avatars**
2. Klik tab **Policies**
3. Klik **New policy**

**Policy 1: Public Read (Semua orang bisa lihat)**
```sql
-- Policy name: Public Access
-- Allowed operation: SELECT
-- Policy definition:
true
```

**Policy 2: Authenticated Upload (User login bisa upload)**
```sql
-- Policy name: Authenticated users can upload
-- Allowed operation: INSERT
-- Policy definition:
(bucket_id = 'avatars'::text) AND (auth.role() = 'authenticated'::text)
```

**Policy 3: User can update own files**
```sql
-- Policy name: Users can update own avatar
-- Allowed operation: UPDATE
-- Policy definition:
(bucket_id = 'avatars'::text) AND (auth.uid() = owner)
```

**Policy 4: User can delete own files**
```sql
-- Policy name: Users can delete own avatar
-- Allowed operation: DELETE
-- Policy definition:
(bucket_id = 'avatars'::text) AND (auth.uid() = owner)
```

### Langkah 3: Get Supabase Credentials

1. Buka **Project Settings** > **API**
2. Copy credentials berikut:
   - **Project URL**: `https://[PROJECT-REF].supabase.co`
   - **anon/public key**: `eyJhbGc...` (API Key)

## 2. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## 3. Setup Environment Variables

Tambahkan ke `.env`:

```env
# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
```

Tambahkan ke `.env.example`:

```env
# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Cara Menggunakan

### Upload Foto

```typescript
import { supabase } from '@/lib/supabase'

// Upload file
const file = event.target.files[0]
const fileExt = file.name.split('.').pop()
const fileName = `${userId}-${Date.now()}.${fileExt}`

const { data, error } = await supabase.storage
  .from('avatars')
  .upload(fileName, file)

if (error) {
  console.error('Upload error:', error)
  return
}

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(fileName)

// Save publicUrl to database
```

### Delete Foto

```typescript
const { error } = await supabase.storage
  .from('avatars')
  .remove(['fileName.jpg'])
```

## 5. File Size & Type Restrictions

Untuk keamanan, set restrictions di bucket:

- **Max file size**: 2MB
- **Allowed types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

## 6. Alternative: Menggunakan URL Eksternal

Jika tidak ingin setup storage, Anda bisa:

1. Gunakan service eksternal:
   - [Cloudinary](https://cloudinary.com) - Free tier 25GB
   - [ImgBB](https://imgbb.com) - Free unlimited
   - [Imgur](https://imgur.com) - Free unlimited

2. Atau gunakan URL langsung:
   - Gravatar: `https://www.gravatar.com/avatar/[hash]`
   - UI Avatars: `https://ui-avatars.com/api/?name=John+Doe`
   - Pravatar: `https://i.pravatar.cc/150?img=3`

## 7. Best Practices

1. **Validasi file di client & server**
   - Check file type
   - Check file size
   - Sanitize filename

2. **Optimize images**
   - Resize before upload (max 500x500px)
   - Compress quality (80-90%)
   - Convert to WebP

3. **Security**
   - Validate file type di server
   - Scan for malware (optional)
   - Rate limit uploads

4. **Performance**
   - Use CDN (Supabase sudah include CDN)
   - Lazy load images
   - Use placeholder while loading

## Troubleshooting

### Error: "new row violates row-level security policy"

- Pastikan RLS policies sudah dibuat
- Check user sudah authenticated
- Verify bucket name benar

### Error: "File size exceeds limit"

- Check file size < 2MB
- Compress image sebelum upload

### Image tidak muncul

- Check bucket adalah **public**
- Verify URL benar
- Check CORS settings di Supabase

## Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Storage RLS Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Image Optimization](https://supabase.com/docs/guides/storage/serving/image-transformations)
