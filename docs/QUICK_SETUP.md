# Quick Setup - New System

Sistem baru dengan keamanan lebih baik:
- ✅ Public registration disabled
- ✅ Secret URL untuk admin pertama
- ✅ Admin creates users dari dashboard

## Setup dalam 5 Langkah

### 1. Generate Token (30 detik)

```bash
openssl rand -hex 8
```

Output: `a7f3c9d2e5b8` (contoh)

### 2. Set Environment (30 detik)

Edit `.env`:

```env
DATABASE_URL="..."
DIRECT_URL="..."
SESSION_SECRET="..."
REGISTRATION_TOKEN="a7f3c9d2e5b8"  # Token dari step 1
```

### 3. Setup Database (1 menit)

```bash
bunx prisma generate
bunx prisma db push
npm run dev
```

### 4. Register Admin (1 menit)

Buka browser:

```
http://localhost:3000/a7f3c9d2e5b8/register
```

Isi form:
- Email: admin@example.com
- Password: admin123
- Role: ADMIN (otomatis)

### 5. Buat User (2 menit)

1. Login sebagai admin
2. Klik "User Management" di sidebar
3. Isi form "Buat User Baru":
   - Email: mahasiswa@example.com
   - Password: mahasiswa123
   - Role: MAHASISWA
4. Klik "Buat User"
5. Berikan credentials ke user

## Done! 🎉

Sekarang Anda punya:
- ✅ 1 Admin account
- ✅ User management system
- ✅ Secure registration

## URLs

- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard
- **User Management**: http://localhost:3000/dashboard/users (Admin only)
- **Secret Register**: http://localhost:3000/{token}/register (One-time use)

## Next Steps

1. **Disable Secret URL** (setelah admin dibuat):
   ```env
   REGISTRATION_TOKEN=""
   ```

2. **Buat lebih banyak user** dari dashboard

3. **Customize features** sesuai kebutuhan

---

**Dokumentasi Lengkap:**
- [ADMIN_SETUP.md](./ADMIN_SETUP.md) - Panduan admin lengkap
- [README.md](./README.md) - Overview project
