# Admin Setup Guide

Panduan lengkap untuk setup admin pertama kali dan mengelola user.

## Setup Admin Pertama Kali

### 1. Generate Registration Token

```bash
# Generate random token
openssl rand -hex 8
# Output: a7f3c9d2e5b8
```

### 2. Set Token di Environment

Edit `.env`:

```env
REGISTRATION_TOKEN="a7f3c9d2e5b8"
```

### 3. Akses Secret Registration URL

Buka browser dan akses:

```
http://localhost:3000/a7f3c9d2e5b8/register
```

**Format URL:**
```
http://localhost:3000/{REGISTRATION_TOKEN}/register
```

### 4. Register Admin

1. Isi form:
   - Email: admin@example.com
   - Password: (password yang kuat)
   - Role: ADMIN (otomatis)

2. Klik "Register as Admin"

3. Login dengan credentials yang dibuat

## Mengelola User (Admin Only)

### Akses User Management

Setelah login sebagai admin:

1. Buka dashboard
2. Klik menu "User Management" di sidebar
3. Atau akses: `http://localhost:3000/dashboard/users`

### Membuat User Baru

Di halaman User Management:

1. **Isi Form "Buat User Baru":**
   - Email: email user baru
   - Password: password temporary untuk user
   - Role: Pilih MAHASISWA atau KARYAWAN

2. **Klik "Buat User"**

3. **Berikan Credentials ke User:**
   - Email: [email yang dibuat]
   - Password: [password yang dibuat]
   - URL Login: http://localhost:3000/login

4. **User bisa login** dengan credentials tersebut

### Melihat Daftar User

Di halaman User Management, panel kanan menampilkan:
- Total user
- Email setiap user
- Role (dengan badge warna)
- Tanggal dibuat

## Security Features

### 1. Public Registration Disabled

- URL `/register` tidak bisa diakses publik
- Redirect otomatis ke login
- Hanya admin yang bisa buat user baru

### 2. Secret Registration URL

- URL dengan token rahasia: `/{token}/register`
- Token harus match dengan `REGISTRATION_TOKEN` di `.env`
- Hanya untuk admin pertama kali
- Setelah ada admin, tidak perlu lagi

### 3. Role-Based Access

- **ADMIN**: Full access, bisa buat user
- **KARYAWAN**: Access terbatas (sesuai kebutuhan)
- **MAHASISWA**: Access terbatas (sesuai kebutuhan)

### 4. Protected Routes

- `/dashboard/users` hanya bisa diakses ADMIN
- Non-admin akan di-redirect ke dashboard

## Best Practices

### 1. Ganti Token Setelah Setup

Setelah admin pertama dibuat:

```env
# Disable registration dengan token kosong atau random
REGISTRATION_TOKEN=""
# atau
REGISTRATION_TOKEN="disabled"
```

Restart server:
```bash
npm run dev
```

### 2. Password Policy

Untuk user baru:
- Minimal 6 karakter (bisa ditingkatkan)
- Kombinasi huruf, angka, simbol
- Instruksikan user untuk ganti password setelah login pertama

### 3. Audit Log (Future)

Pertimbangkan untuk track:
- Siapa yang buat user baru
- Kapan user dibuat
- Login attempts
- Password changes

### 4. Email Notification (Future)

Kirim email ke user baru dengan:
- Credentials
- Link login
- Instruksi ganti password

## Troubleshooting

### Token tidak valid

**Problem:** Akses `/{token}/register` redirect ke login

**Solution:**
1. Cek `REGISTRATION_TOKEN` di `.env`
2. Pastikan token di URL sama persis
3. Restart server setelah ubah `.env`

### Tidak bisa buat user

**Problem:** Error saat submit form create user

**Solution:**
1. Cek session masih valid (refresh page)
2. Pastikan login sebagai ADMIN
3. Cek email belum terdaftar
4. Cek console untuk error details

### User Management tidak muncul

**Problem:** Menu "User Management" tidak ada di sidebar

**Solution:**
1. Pastikan login sebagai ADMIN (bukan KARYAWAN/MAHASISWA)
2. Cek role di navbar (harus "ADMIN")
3. Logout dan login ulang

### Public register masih bisa diakses

**Problem:** URL `/register` masih bisa diakses

**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Cek file `app/(auth)/register/page.tsx` sudah diupdate

## API Endpoints

### Create User (Admin Only)

```bash
POST /api/users/create
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "MAHASISWA" | "KARYAWAN"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User mahasiswa berhasil dibuat"
}
```

### Verify Token

```bash
POST /api/auth/verify-token
Content-Type: application/json

{
  "token": "a7f3c9d2e5b8"
}
```

**Response:**
```json
{
  "valid": true
}
```

## Environment Variables

```env
# Required
DATABASE_URL="..."
DIRECT_URL="..."
SESSION_SECRET="..."

# Registration Token (for initial admin setup)
REGISTRATION_TOKEN="a7f3c9d2e5b8"
```

## Flow Diagram

```
1. Setup Admin Pertama
   ↓
   Generate Token → Set .env → Access /{token}/register → Register Admin
   
2. Admin Buat User
   ↓
   Login as Admin → Dashboard → User Management → Create User
   
3. User Login
   ↓
   User dapat credentials → Login → Access Dashboard
```

## Next Steps

Setelah setup admin:

1. **Buat user untuk testing**
   - 1 KARYAWAN
   - 1 MAHASISWA

2. **Test role-based access**
   - Login sebagai KARYAWAN → cek akses
   - Login sebagai MAHASISWA → cek akses

3. **Implement features**
   - Edit user
   - Delete user
   - Reset password
   - Disable/enable user

4. **Add email notification**
   - Welcome email
   - Password reset
   - Account changes

---

**Need Help?**
Buat Issue di GitHub atau hubungi developer.
