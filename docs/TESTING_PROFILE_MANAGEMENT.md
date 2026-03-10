# End-to-End Testing - Profile Management

Panduan testing lengkap untuk fitur Profile Management dari sisi KARYAWAN dan ADMIN.

---

## Prerequisites

### 1. Setup Database
```bash
bunx prisma generate
bunx prisma db push
bun run dev
```

### 2. Create Test Users

Buat 2 user untuk testing:

**User 1: Admin**
- Email: admin@test.com
- Password: admin123
- Role: ADMIN

**User 2: Karyawan**
- Email: karyawan@test.com
- Password: karyawan123
- Role: KARYAWAN

---

## Test Case 1: KARYAWAN - First Time Access Profile

### Objective
Verify karyawan dapat mengakses halaman profile pertama kali dan melihat form kosong.

### Steps

1. **Login sebagai Karyawan**
   - Buka: http://localhost:3000/login
   - Email: `karyawan@test.com`
   - Password: `karyawan123`
   - Klik "Login"

2. **Navigate to Profile**
   - Setelah login, klik menu "Profile" di sidebar
   - URL: http://localhost:3000/dashboard/profile

3. **Verify Initial State**
   - ✅ Halaman profile muncul
   - ✅ Title: "Profile Saya"
   - ✅ Form "Informasi Profile" muncul
   - ✅ Field "Email" terisi dan disabled (read-only)
   - ✅ Field "NIP" tidak muncul (karena belum ada profile)
   - ✅ Semua field lain kosong dan editable
   - ✅ Field "Jabatan" dan "Status Kepegawaian" TIDAK muncul (admin only)

### Expected Result
- ✅ Karyawan dapat akses halaman profile
- ✅ Form muncul dengan field yang sesuai role
- ✅ Admin-only fields tidak terlihat

---

## Test Case 2: KARYAWAN - Create Profile (First Time)

### Objective
Verify karyawan dapat membuat profile pertama kali dengan semua field yang diizinkan.

### Steps

1. **Fill Profile Form**
   - NIK: `3201234567890123`
   - Nama Lengkap: `John Doe`
   - Gelar Depan: `Dr.`
   - Gelar Belakang: `S.Kom., M.T.`
   - Telepon: `08123456789`
   - Jenis Kelamin: `Laki-laki`
   - Alamat: `Jl. Contoh No. 123, Jakarta`
   - Tempat Lahir: `Jakarta`
   - Tanggal Lahir: `1990-01-15`
   - URL Foto Profil: `https://example.com/photo.jpg`

2. **Submit Form**
   - Klik button "Simpan Profile"
   - Tunggu loading

3. **Verify Success**
   - ✅ Success message muncul: "Profile berhasil diupdate!"
   - ✅ Form tetap terisi dengan data yang baru disimpan
   - ✅ Page refresh otomatis

4. **Verify Database**
   - Buka Prisma Studio: `bunx prisma studio`
   - Buka table `profiles`
   - ✅ Ada 1 record baru
   - ✅ `userId` sesuai dengan user karyawan
   - ✅ Semua field terisi sesuai input
   - ✅ `tanggalMasuk` terisi otomatis (current date)
   - ✅ `createdAt` dan `updatedAt` terisi otomatis

### Expected Result
- ✅ Profile berhasil dibuat
- ✅ Data tersimpan di database
- ✅ Auto-generated fields terisi

---

## Test Case 3: KARYAWAN - Update Profile

### Objective
Verify karyawan dapat update profile yang sudah ada.

### Steps

1. **Navigate to Profile**
   - Masih login sebagai karyawan
   - Klik menu "Profile"

2. **Verify Existing Data**
   - ✅ Form terisi dengan data sebelumnya
   - ✅ Semua field yang diisi sebelumnya muncul

3. **Update Some Fields**
   - Ubah Telepon: `08987654321`
   - Ubah Alamat: `Jl. Baru No. 456, Bandung`
   - Kosongkan Gelar Depan (hapus isi field)

4. **Submit Form**
   - Klik "Simpan Profile"

5. **Verify Success**
   - ✅ Success message muncul
   - ✅ Field yang diubah ter-update
   - ✅ Field yang tidak diubah tetap sama
   - ✅ Field yang dikosongkan menjadi null

6. **Verify Database**
   - Buka Prisma Studio
   - ✅ Record ter-update (bukan create baru)
   - ✅ `updatedAt` berubah ke timestamp baru
   - ✅ `createdAt` tetap sama (tidak berubah)

### Expected Result
- ✅ Profile berhasil diupdate
- ✅ Hanya field yang diubah yang ter-update
- ✅ Timestamps ter-manage dengan benar

---

## Test Case 4: KARYAWAN - Cannot Edit Admin-Only Fields

### Objective
Verify karyawan tidak bisa melihat atau edit field yang hanya untuk admin.

### Steps

1. **Inspect Profile Form**
   - Masih di halaman profile karyawan
   - Inspect HTML dengan browser DevTools (F12)

2. **Verify Admin Fields Not Present**
   - ✅ Field "Jabatan" tidak ada di HTML
   - ✅ Field "Status Kepegawaian" tidak ada di HTML
   - ✅ Tidak ada section dengan background merah (admin-only section)

3. **Try Manual API Call (Optional)**
   - Buka browser console (F12)
   - Jalankan:
   ```javascript
   fetch('/api/profile/update', {
     method: 'PUT',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       jabatan: 'Manager',
       statusKepegawaian: 'TETAP'
     })
   }).then(r => r.json()).then(console.log)
   ```

4. **Verify Database**
   - Buka Prisma Studio
   - ✅ Field `jabatan` tetap null (tidak ter-update)
   - ✅ Field `statusKepegawaian` tetap null (tidak ter-update)

### Expected Result
- ✅ Karyawan tidak bisa lihat admin-only fields
- ✅ Karyawan tidak bisa update admin-only fields (even via API)

---

## Test Case 5: ADMIN - Access Profile

### Objective
Verify admin dapat mengakses halaman profile dan melihat semua field termasuk admin-only.

### Steps

1. **Logout dari Karyawan**
   - Klik button "Logout" di navbar

2. **Login sebagai Admin**
   - Email: `admin@test.com`
   - Password: `admin123`
   - Klik "Login"

3. **Navigate to Profile**
   - Klik menu "Profile" di sidebar

4. **Verify Admin View**
   - ✅ Halaman profile muncul
   - ✅ Semua field karyawan muncul
   - ✅ Section dengan background merah muncul (admin-only)
   - ✅ Field "Jabatan" muncul dengan label "(Admin Only)"
   - ✅ Field "Status Kepegawaian" muncul dengan label "(Admin Only)"

### Expected Result
- ✅ Admin dapat akses profile
- ✅ Admin melihat semua field termasuk admin-only

---

## Test Case 6: ADMIN - Create Profile with Admin Fields

### Objective
Verify admin dapat membuat profile dengan field admin-only.

### Steps

1. **Fill Profile Form (Admin)**
   - NIK: `3201987654321098`
   - Nama Lengkap: `Jane Smith`
   - Gelar Depan: `Prof.`
   - Gelar Belakang: `Ph.D.`
   - **Jabatan**: `Direktur` (admin-only)
   - **Status Kepegawaian**: `Tetap` (admin-only)
   - Telepon: `08111222333`
   - Jenis Kelamin: `Perempuan`
   - Alamat: `Jl. Admin No. 789`
   - Tempat Lahir: `Surabaya`
   - Tanggal Lahir: `1985-05-20`

2. **Submit Form**
   - Klik "Simpan Profile"

3. **Verify Success**
   - ✅ Success message muncul
   - ✅ Semua field terisi termasuk admin-only

4. **Verify Database**
   - Buka Prisma Studio
   - ✅ Record baru untuk admin
   - ✅ Field `jabatan` = "Direktur"
   - ✅ Field `statusKepegawaian` = "TETAP"
   - ✅ Semua field lain terisi

### Expected Result
- ✅ Admin dapat create profile dengan admin-only fields
- ✅ Admin-only fields tersimpan di database

---

## Test Case 7: ADMIN - Update Admin-Only Fields

### Objective
Verify admin dapat update field admin-only.

### Steps

1. **Update Admin Fields**
   - Ubah Jabatan: `CEO`
   - Ubah Status Kepegawaian: `Tidak Tetap`
   - Ubah Nama Lengkap: `Jane Smith Updated`

2. **Submit Form**
   - Klik "Simpan Profile"

3. **Verify Success**
   - ✅ Success message muncul
   - ✅ Semua perubahan tersimpan

4. **Verify Database**
   - ✅ `jabatan` = "CEO"
   - ✅ `statusKepegawaian` = "TIDAK_TETAP"
   - ✅ `namaLengkap` = "Jane Smith Updated"

### Expected Result
- ✅ Admin dapat update admin-only fields
- ✅ Perubahan tersimpan dengan benar

---

## Test Case 8: Navigation & Access Control

### Objective
Verify menu profile muncul sesuai role dan access control berfungsi.

### Steps

1. **Test MAHASISWA Access**
   - Logout dari admin
   - Login sebagai mahasiswa (jika ada)
   - ✅ Menu "Profile" TIDAK muncul di sidebar
   - Coba akses manual: http://localhost:3000/dashboard/profile
   - ✅ Redirect ke `/dashboard` (access denied)

2. **Test KARYAWAN Access**
   - Logout
   - Login sebagai karyawan
   - ✅ Menu "Profile" muncul di sidebar
   - Klik menu "Profile"
   - ✅ Dapat akses halaman profile

3. **Test ADMIN Access**
   - Logout
   - Login sebagai admin
   - ✅ Menu "Profile" muncul di sidebar
   - ✅ Menu "User Management" juga muncul
   - Klik menu "Profile"
   - ✅ Dapat akses halaman profile dengan admin fields

### Expected Result
- ✅ Menu profile hanya muncul untuk KARYAWAN dan ADMIN
- ✅ MAHASISWA tidak bisa akses profile
- ✅ Access control berfungsi dengan benar

---

## Test Case 9: Form Validation

### Objective
Verify form validation berfungsi dengan benar.

### Steps

1. **Test Empty Form**
   - Login sebagai karyawan
   - Buka profile
   - Kosongkan semua field (jika ada isi)
   - Klik "Simpan Profile"
   - ✅ Form berhasil submit (semua field optional)

2. **Test Invalid Date**
   - Isi Tanggal Lahir: `2050-01-01` (future date)
   - Klik "Simpan Profile"
   - ✅ Form berhasil submit (no validation yet)
   - Note: Bisa tambahkan validation di future

3. **Test Invalid Phone**
   - Isi Telepon: `abc123` (invalid format)
   - Klik "Simpan Profile"
   - ✅ Form berhasil submit (no validation yet)
   - Note: Bisa tambahkan validation di future

### Expected Result
- ✅ Semua field optional (bisa kosong)
- ✅ Form submit tanpa error
- Note: Validation bisa ditambahkan di future enhancement

---

## Test Case 10: API Direct Testing

### Objective
Verify API endpoints berfungsi dengan benar.

### Test GET Profile

```bash
# Login dulu untuk dapat session cookie
# Lalu test API

curl http://localhost:3000/api/profile \
  -H "Cookie: session=YOUR_SESSION_COOKIE"
```

**Expected Response:**
```json
{
  "success": true,
  "profile": {
    "id": "uuid",
    "userId": "uuid",
    "nip": null,
    "nik": "3201234567890123",
    "namaLengkap": "John Doe",
    // ... other fields
  }
}
```

### Test PUT Profile

```bash
curl -X PUT http://localhost:3000/api/profile/update \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_COOKIE" \
  -d '{
    "namaLengkap": "John Doe Updated",
    "telepon": "08999888777"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile berhasil diupdate",
  "profile": { /* updated profile */ }
}
```

---

## Test Case 11: Edge Cases

### Test 1: Multiple Updates in Quick Succession
1. Update profile
2. Immediately update again (before page refresh)
3. ✅ Both updates should succeed
4. ✅ Last update wins

### Test 2: Concurrent Updates (2 Tabs)
1. Open profile in 2 browser tabs
2. Update different fields in each tab
3. Submit both
4. ✅ Both should succeed
5. ✅ Last submit wins for conflicting fields

### Test 3: Long Text Input
1. Isi Alamat dengan text sangat panjang (1000+ characters)
2. Submit
3. ✅ Should succeed (no length limit in schema)

### Test 4: Special Characters
1. Isi Nama Lengkap: `John O'Brien-Smith`
2. Isi Alamat: `Jl. "Quotes" & Symbols #123`
3. Submit
4. ✅ Should succeed
5. ✅ Special characters tersimpan dengan benar

---

## Test Case 12: Database Integrity

### Verify Relationships
1. Buka Prisma Studio
2. Check table `profiles`
3. ✅ `userId` adalah foreign key ke `users.id`
4. ✅ Relationship one-to-one (1 user = 1 profile max)

### Verify Cascade Delete
1. Buka User Management (as admin)
2. Delete user yang punya profile
3. Check Prisma Studio
4. ✅ Profile user tersebut juga terhapus (cascade delete)

### Verify Unique Constraints
1. Try create 2 profiles dengan `userId` sama (via API)
2. ✅ Should fail (unique constraint)

---

## Test Summary Checklist

### KARYAWAN Tests
- [ ] Can access profile page
- [ ] Can create profile (first time)
- [ ] Can update profile
- [ ] Cannot see admin-only fields
- [ ] Cannot update admin-only fields
- [ ] All editable fields work correctly

### ADMIN Tests
- [ ] Can access profile page
- [ ] Can see admin-only fields
- [ ] Can create profile with admin fields
- [ ] Can update admin-only fields
- [ ] All fields work correctly

### Access Control Tests
- [ ] MAHASISWA cannot access profile
- [ ] Menu visibility correct per role
- [ ] API access control works

### Data Integrity Tests
- [ ] Auto-generated fields work (tanggalMasuk, timestamps)
- [ ] Cascade delete works
- [ ] Unique constraints enforced
- [ ] Relationships correct

### Edge Cases Tests
- [ ] Empty form submission works
- [ ] Multiple updates work
- [ ] Special characters handled
- [ ] Long text handled

---

## Known Issues / Future Enhancements

### Current Limitations
1. No client-side validation (only server-side)
2. No image upload (only URL input)
3. No NIP auto-generation yet (will be added when admin creates karyawan)
4. No soft delete UI yet (tanggalKeluar field exists but not used)

### Future Enhancements
1. Add client-side validation (Zod + React Hook Form)
2. Add image upload functionality
3. Add NIP auto-generation when admin creates karyawan user
4. Add soft delete feature in User Management
5. Add profile photo preview
6. Add date picker component
7. Add phone number formatting
8. Add NIK validation (16 digits)

---

## Troubleshooting

### Profile page shows 500 error
**Solution:** Prisma Client not regenerated
```bash
rm -rf node_modules/.prisma
bunx prisma generate
bun run dev
```

### Cannot update profile
**Solution:** Check browser console for errors, verify session valid

### Admin fields not showing
**Solution:** Verify logged in as ADMIN role, check session.role

### Database not updating
**Solution:** Check Prisma Studio, verify API response, check server logs

---

**Testing Complete!** ✅

Jika semua test case passed, fitur Profile Management siap untuk production.
