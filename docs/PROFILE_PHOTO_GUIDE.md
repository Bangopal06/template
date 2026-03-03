# Profile Photo Management Guide

Panduan lengkap untuk fitur upload dan manage foto profil.

## Fitur

✅ Upload foto profil (max 2MB)
✅ Preview foto full rounded
✅ Auto-delete foto lama saat upload baru
✅ Delete foto profil
✅ Tampilan konsisten di navbar, dashboard, dan profile page

## Cara Menggunakan

### 1. Upload Foto Profil

1. Login ke aplikasi
2. Klik menu **Profile** di sidebar
3. Klik **Choose File** atau **Browse**
4. Pilih foto (JPEG, PNG, WebP, atau GIF)
5. Foto akan otomatis terupload
6. Foto lama (jika ada) akan otomatis terhapus dari storage

### 2. Hapus Foto Profil

1. Buka halaman **Profile**
2. Klik tombol **Hapus Foto Profil** (merah)
3. Konfirmasi penghapusan
4. Foto akan terhapus dari storage dan database

### 3. Lihat Foto Profil

Foto profil akan muncul di:
- **Navbar** (kanan atas) - Avatar kecil
- **Dashboard** - Avatar besar dengan info user
- **Profile Page** - Avatar besar dengan form edit

## Spesifikasi Teknis

### File Requirements

- **Format**: JPEG, PNG, WebP, GIF
- **Max Size**: 2MB
- **Recommended**: Square image (1:1 ratio)
- **Optimal Size**: 500x500px atau 1000x1000px

### Storage

- **Provider**: Supabase Storage
- **Bucket**: `avatars`
- **Access**: Public (read-only)
- **CDN**: Enabled (auto by Supabase)

### Naming Convention

```
{userId}-{timestamp}.{extension}
```

Example: `550e8400-e29b-41d4-a716-446655440000-1709123456789.jpg`

## API Endpoints

### POST /api/profile/upload

Upload foto profil baru.

**Request:**
```typescript
FormData {
  file: File
}
```

**Response:**
```json
{
  "success": true,
  "message": "Photo uploaded successfully",
  "url": "https://project.supabase.co/storage/v1/object/public/avatars/...",
  "profile": { ... }
}
```

### PUT /api/profile/update

Hapus foto profil (set to null).

**Request:**
```json
{
  "fotoProfil": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "Foto profil berhasil dihapus",
  "profile": { ... }
}
```

## Tampilan

### Profile Page

```
┌─────────────────────────────────┐
│     Informasi Profile           │
├─────────────────────────────────┤
│                                 │
│         ┌─────────┐             │
│         │         │             │
│         │  Photo  │  (Rounded)  │
│         │         │             │
│         └─────────┘             │
│       user@email.com            │
│        Foto Profil              │
│                                 │
│  [Choose File] No file chosen   │
│  Format: JPEG, PNG, WebP, GIF   │
│                                 │
│  [Hapus Foto Profil]            │
│                                 │
└─────────────────────────────────┘
```

### Dashboard

```
┌─────────────────────────────────┐
│     User Information            │
├─────────────────────────────────┤
│                                 │
│         ┌─────────┐             │
│         │  Photo  │  (Rounded)  │
│         └─────────┘             │
│                                 │
│      user@email.com             │
│         [ADMIN]                 │
│                                 │
│  User ID: xxx-xxx-xxx           │
│  Profile Status: ✓ Complete     │
│                                 │
└─────────────────────────────────┘
```

### Navbar

```
┌────────────────────────────────────────┐
│  Dashboard Template    [○] user@... [ADMIN] [Logout] │
└────────────────────────────────────────┘
```

## Troubleshooting

### Foto tidak muncul

1. Check console browser untuk error
2. Verify URL foto valid
3. Check bucket `avatars` adalah public
4. Clear browser cache

### Upload gagal

1. Check file size < 2MB
2. Check file format (JPEG, PNG, WebP, GIF)
3. Check `SUPABASE_SERVICE_ROLE_KEY` di `.env`
4. Check console server untuk error log

### Foto lama tidak terhapus

1. Check console server untuk delete log
2. Verify `getFileNameFromUrl()` extract filename dengan benar
3. Check permissions di Supabase Storage

### Error: "Supabase admin client not configured"

1. Tambahkan `SUPABASE_SERVICE_ROLE_KEY` ke `.env`
2. Restart dev server
3. Get service role key dari Supabase Dashboard > Settings > API

## Best Practices

### Untuk User

1. **Gunakan foto square** (1:1 ratio) untuk hasil terbaik
2. **Compress foto** sebelum upload jika > 2MB
3. **Gunakan foto berkualitas** untuk tampilan profesional
4. **Update foto** secara berkala

### Untuk Developer

1. **Validate di client & server** untuk keamanan
2. **Log semua operasi** untuk debugging
3. **Handle errors gracefully** dengan pesan user-friendly
4. **Test delete operation** untuk memastikan cleanup
5. **Monitor storage usage** di Supabase Dashboard

## Security

✅ File type validation (client & server)
✅ File size limit (2MB)
✅ Server-side upload (tidak expose service key)
✅ Auto-delete old files (prevent storage bloat)
✅ Authenticated users only

## Performance

✅ CDN enabled (Supabase auto)
✅ Image optimization (Next.js Image component)
✅ Lazy loading
✅ Caching (3600s)

## Future Improvements

- [ ] Image cropping tool
- [ ] Multiple image sizes (thumbnail, medium, large)
- [ ] Image compression on upload
- [ ] Drag & drop upload
- [ ] Progress bar for upload
- [ ] Webcam capture
- [ ] Image filters/effects

## Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Image Compression Tools](https://tinypng.com)
