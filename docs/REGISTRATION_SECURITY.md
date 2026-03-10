# Registration Security

Sistem registrasi menggunakan **Registration Code** untuk mencegah registrasi sembarangan.

## Cara Kerja

1. Admin memiliki kode registrasi rahasia
2. Tanpa kode yang benar, tidak bisa register
3. Kode disimpan di environment variable `ADMIN_REGISTRATION_CODE`

## Setup

### 1. Set Registration Code

Edit `.env` dan tambahkan:

```env
ADMIN_REGISTRATION_CODE="ADMIN2024SECRET"
```

**Tips:**
- Gunakan kode yang kuat dan unik
- Jangan share kode di public
- Ganti kode secara berkala

### 2. Generate Kode yang Kuat

```bash
# Generate random code
openssl rand -hex 16
# Output: a3f5c8d9e2b1f4a6c7d8e9f0a1b2c3d4

# Atau gunakan password generator
openssl rand -base64 24
# Output: 8xK9mN2pQ5rS7tU1vW3xY6zA
```

## Cara Menggunakan

### Untuk Admin

1. **Registrasi Pertama Kali**
   - Buka `/register`
   - Isi email, password
   - Masukkan kode registrasi dari `.env`
   - Pilih role: ADMIN
   - Klik Register

2. **Memberikan Akses ke User Baru**
   
   **Opsi A: Share Registration Code**
   - Berikan kode registrasi ke user baru
   - User bisa register sendiri dengan kode tersebut
   - ⚠️ Kurang aman karena kode bisa disebarkan
   
   **Opsi B: Admin Creates Users (Recommended)**
   - Akan diimplementasikan di dashboard
   - Admin buat user baru dari dashboard
   - User dapat email dengan password temporary
   - ✅ Lebih aman dan terkontrol

### Untuk User Baru

1. Minta kode registrasi dari admin
2. Buka `/register`
3. Isi form:
   - Email
   - Password
   - **Kode Registrasi** (dari admin)
   - Role (Mahasiswa/Karyawan/Admin)
4. Klik Register
5. Login dengan credentials yang dibuat

## Error Messages

### "Kode registrasi tidak valid"
- Kode yang dimasukkan salah
- Cek dengan admin untuk kode yang benar
- Pastikan tidak ada spasi di awal/akhir

### "Email ini sudah terdaftar"
- Email sudah digunakan user lain
- Gunakan email berbeda
- Atau hubungi admin jika lupa password

## Security Best Practices

### 1. Ganti Kode Secara Berkala

```bash
# Generate kode baru
openssl rand -hex 16

# Update .env
ADMIN_REGISTRATION_CODE="kode_baru_disini"

# Restart server
npm run dev
```

### 2. Jangan Commit Kode ke Git

`.env` sudah ada di `.gitignore`, pastikan tidak ter-commit:

```bash
# Check .gitignore
cat .gitignore | grep .env
# Output: .env
```

### 3. Gunakan Kode yang Berbeda per Environment

```env
# Development
ADMIN_REGISTRATION_CODE="DEV_CODE_123"

# Production
ADMIN_REGISTRATION_CODE="PROD_SECURE_CODE_XYZ"
```

### 4. Limit Registration (Optional)

Tambahkan logic untuk:
- Hanya allow X registrasi per hari
- Hanya allow registrasi dari IP tertentu
- Disable registrasi setelah admin pertama dibuat

## Alternative Methods

### Method 1: Registration Code (Current) ✅
**Pros:**
- Simple & cepat implement
- Mudah digunakan
- Tidak perlu email service

**Cons:**
- Kode bisa disebarkan
- Kurang kontrol siapa yang register

### Method 2: Admin Creates Users (Recommended Next)
**Pros:**
- Full control oleh admin
- Lebih aman
- Bisa set password temporary

**Cons:**
- Admin harus manual buat user
- Perlu email service untuk notifikasi

### Method 3: Invitation Link
**Pros:**
- Link bisa expire
- One-time use
- Tracking siapa yang invite siapa

**Cons:**
- Lebih kompleks implement
- Perlu database table untuk invitations

## Next Steps

Untuk keamanan lebih baik, implementasikan:

1. **User Management Dashboard**
   - Admin bisa create/edit/delete users
   - Set password temporary
   - Disable/enable users

2. **Email Verification**
   - User verify email setelah register
   - Prevent fake emails

3. **Password Reset**
   - User bisa reset password via email
   - Secure token-based reset

4. **Audit Log**
   - Track siapa register kapan
   - Track login attempts
   - Monitor suspicious activities

## FAQ

**Q: Bagaimana jika lupa kode registrasi?**
A: Cek file `.env` di server. Jika tidak ada akses, hubungi developer.

**Q: Bisa ganti kode tanpa restart server?**
A: Tidak, harus restart server setelah ganti `.env`.

**Q: Apakah kode case-sensitive?**
A: Ya, "ADMIN123" berbeda dengan "admin123".

**Q: Berapa panjang kode yang recommended?**
A: Minimal 16 karakter, kombinasi huruf, angka, dan simbol.

**Q: Bisa pakai kode berbeda untuk role berbeda?**
A: Bisa, tapi perlu modifikasi code. Saat ini 1 kode untuk semua role.

---

**Need Help?**
Buat Issue di GitHub atau hubungi developer.
