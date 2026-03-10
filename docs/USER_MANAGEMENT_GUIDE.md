# User Management Guide

Panduan lengkap mengelola user di dashboard admin.

## Fitur User Management

### 1. Create User ✅
### 2. View Users ✅
### 3. Edit User ✅
### 4. Delete User ✅

---

## 1. Create User

### Akses
- URL: `/dashboard/users`
- Role: ADMIN only

### Cara Membuat User Baru

1. Login sebagai ADMIN
2. Buka "User Management" di sidebar
3. Di panel kiri, isi form "Buat User Baru":
   - **Email**: Email user baru
   - **Password**: Password temporary
   - **Role**: Pilih ADMIN, KARYAWAN, atau MAHASISWA
4. Klik "Buat User"
5. User baru akan muncul di daftar user

### Tips
- Gunakan password yang kuat
- Instruksikan user untuk ganti password setelah login pertama
- Catat credentials untuk diberikan ke user

---

## 2. View Users

### Informasi yang Ditampilkan

Setiap user card menampilkan:
- **Email**: Email user
- **Role**: Badge dengan warna berbeda
  - 🔴 ADMIN: Red badge
  - 🔵 KARYAWAN: Blue badge
  - 🟢 MAHASISWA: Green badge
- **Tanggal Dibuat**: Kapan user dibuat
- **Actions**: Button Edit & Delete

### Sorting
- User diurutkan berdasarkan tanggal dibuat (terbaru di atas)

---

## 3. Edit User

### Cara Edit User

1. Di daftar user, klik button **"Edit"** pada user yang ingin diubah
2. Form edit akan muncul dengan data user saat ini
3. Ubah data yang diperlukan:
   - **Email**: Ubah email user
   - **Password Baru**: Isi jika ingin ganti password (kosongkan jika tidak)
   - **Role**: Pilih role baru
4. Klik **"Save"** untuk menyimpan perubahan
5. Klik **"Cancel"** untuk membatalkan

### Yang Bisa Diubah
- ✅ Email
- ✅ Password (optional)
- ✅ Role

### Validasi
- Email harus valid dan belum digunakan user lain
- Password minimal 6 karakter (jika diisi)
- Role harus salah satu: ADMIN, KARYAWAN, MAHASISWA

### Error Handling
- **"Email sudah digunakan user lain"**: Pilih email berbeda
- **"User tidak ditemukan"**: Refresh page dan coba lagi
- **"Data tidak valid"**: Cek format email dan password

---

## 4. Delete User

### Cara Delete User

1. Di daftar user, klik button **"Delete"** pada user yang ingin dihapus
2. Konfirmasi dialog akan muncul: "Apakah Anda yakin ingin menghapus user [email]?"
3. Klik **"OK"** untuk menghapus
4. Klik **"Cancel"** untuk membatalkan

### Security Features

#### 1. Tidak Bisa Hapus Diri Sendiri
- Admin tidak bisa menghapus akun sendiri
- Error: "Tidak bisa menghapus akun sendiri"
- Untuk hapus admin, login dengan admin lain

#### 2. Konfirmasi Dialog
- Mencegah penghapusan tidak sengaja
- Menampilkan email user yang akan dihapus

#### 3. Permanent Delete
- ⚠️ Penghapusan bersifat permanen
- Data user tidak bisa dikembalikan
- Pastikan backup data jika diperlukan

---

## API Endpoints

### Create User
```bash
POST /api/users/create
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "MAHASISWA"
}
```

### Update User
```bash
PUT /api/users/update
Content-Type: application/json

{
  "userId": "uuid",
  "email": "newemail@example.com",
  "password": "newpassword123",  // optional
  "role": "KARYAWAN"
}
```

### Delete User
```bash
DELETE /api/users/delete
Content-Type: application/json

{
  "userId": "uuid"
}
```

---

## Best Practices

### 1. Password Management
- Gunakan password generator untuk password temporary
- Instruksikan user untuk ganti password setelah login pertama
- Jangan share password via email/chat yang tidak aman

### 2. Role Assignment
- **ADMIN**: Hanya untuk user yang perlu full access
- **KARYAWAN**: Untuk staff/karyawan
- **MAHASISWA**: Untuk siswa/mahasiswa

### 3. Regular Audit
- Review daftar user secara berkala
- Hapus user yang tidak aktif
- Update role sesuai perubahan status

### 4. Backup Before Delete
- Backup data user sebelum dihapus (jika diperlukan)
- Dokumentasikan alasan penghapusan
- Simpan log aktivitas user

---

## Troubleshooting

### Edit tidak berfungsi

**Problem**: Klik "Save" tapi data tidak berubah

**Solution**:
1. Cek console browser untuk error
2. Pastikan session masih valid (refresh page)
3. Cek format email valid
4. Cek password minimal 6 karakter (jika diisi)

### Delete tidak berfungsi

**Problem**: Klik "Delete" tapi user tidak terhapus

**Solution**:
1. Pastikan bukan akun sendiri
2. Refresh page dan coba lagi
3. Cek console browser untuk error
4. Logout dan login ulang

### Email sudah digunakan

**Problem**: Error saat edit email

**Solution**:
1. Cek apakah email sudah digunakan user lain
2. Gunakan email berbeda
3. Atau edit user yang menggunakan email tersebut

### User tidak muncul setelah create

**Problem**: User baru tidak muncul di list

**Solution**:
1. Refresh page (F5)
2. Cek apakah ada error saat create
3. Cek database dengan Prisma Studio

---

## Security Considerations

### 1. Admin Only Access
- Hanya ADMIN yang bisa akses `/dashboard/users`
- Non-admin akan di-redirect ke dashboard

### 2. Session Validation
- Setiap API call validate session
- Expired session akan return 401 Unauthorized

### 3. Input Validation
- Email format validation
- Password length validation
- Role enum validation

### 4. Prevent Self-Delete
- Admin tidak bisa hapus akun sendiri
- Mencegah kehilangan akses admin

### 5. Audit Trail (Future)
- Log semua perubahan user
- Track siapa yang edit/delete
- Timestamp setiap action

---

## Future Enhancements

### 1. Bulk Operations
- Select multiple users
- Bulk delete
- Bulk role change

### 2. Search & Filter
- Search by email
- Filter by role
- Sort by date/email

### 3. User Status
- Active/Inactive status
- Suspend user (temporary disable)
- Last login tracking

### 4. Password Reset
- Admin reset password
- Send reset link via email
- Force password change on next login

### 5. Export Users
- Export to CSV
- Export to Excel
- Backup user data

---

## Keyboard Shortcuts (Future)

- `Ctrl + N`: New user
- `Ctrl + E`: Edit selected user
- `Ctrl + D`: Delete selected user
- `Esc`: Cancel edit

---

**Need Help?**
Buat Issue di GitHub atau hubungi developer.
