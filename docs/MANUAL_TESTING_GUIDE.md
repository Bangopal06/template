# Manual Testing Guide - Profile Management

Karena aplikasi menggunakan Server Actions (bukan REST API), testing dilakukan secara manual melalui browser.

## Quick Setup

### 1. Start Server
```bash
bun run dev
```

### 2. Create Test Users

**Via Browser:**
1. Buka: http://localhost:3000/{REGISTRATION_TOKEN}/register
2. Create 2 users:

**Admin User:**
- Email: admin@test.com
- Password: admin123
- Role: ADMIN

**Karyawan User:**
- Email: karyawan@test.com  
- Password: karyawan123
- Role: KARYAWAN

**Via Script (Recommended):**
```bash
node setup-test-users.js
```

---

## Test Checklist

### ✅ KARYAWAN Tests

#### Test 1: First Access
- [ ] Login as karyawan@test.com
- [ ] Click "Profile" in sidebar
- [ ] Verify: Form is empty (first time)
- [ ] Verify: Email field is disabled
- [ ] Verify: No "Jabatan" or "Status Kepegawaian" fields

#### Test 2: Create Profile
- [ ] Fill all fields:
  - NIK: 3201234567890123
  - Nama: John Doe
  - Gelar Depan: Dr.
  - Gelar Belakang: S.Kom., M.T.
  - Telepon: 08123456789
  - Jenis Kelamin: Laki-laki
  - Alamat: Jl. Contoh No. 123
  - Tempat Lahir: Jakarta
  - Tanggal Lahir: 1990-01-15
  - Foto: https://example.com/photo.jpg
- [ ] Click "Simpan Profile"
- [ ] Verify: Success message appears
- [ ] Verify: Form still filled with data

#### Test 3: Update Profile
- [ ] Change Telepon: 08987654321
- [ ] Change Alamat: Jl. Baru No. 456
- [ ] Clear Gelar Depan (empty field)
- [ ] Click "Simpan Profile"
- [ ] Verify: Success message
- [ ] Verify: Changes saved

#### Test 4: Security Check
- [ ] Open Browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Run this code:
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
- [ ] Refresh page
- [ ] Verify: Jabatan still null (not updated)
- [ ] Verify: Status still null (not updated)

---

### ✅ ADMIN Tests

#### Test 5: Admin Access
- [ ] Logout from karyawan
- [ ] Login as admin@test.com
- [ ] Click "Profile" in sidebar
- [ ] Verify: Red section appears (admin-only)
- [ ] Verify: "Jabatan" field visible
- [ ] Verify: "Status Kepegawaian" field visible

#### Test 6: Create with Admin Fields
- [ ] Fill all fields including:
  - NIK: 3201987654321098
  - Nama: Jane Smith
  - Gelar Depan: Prof.
  - Gelar Belakang: Ph.D.
  - **Jabatan: Direktur** (admin-only)
  - **Status: Tetap** (admin-only)
  - Telepon: 08111222333
  - Jenis Kelamin: Perempuan
  - Alamat: Jl. Admin No. 789
  - Tempat Lahir: Surabaya
  - Tanggal Lahir: 1985-05-20
- [ ] Click "Simpan Profile"
- [ ] Verify: Success message
- [ ] Verify: All fields saved including admin fields

#### Test 7: Update Admin Fields
- [ ] Change Jabatan: CEO
- [ ] Change Status: Tidak Tetap
- [ ] Change Nama: Jane Smith Updated
- [ ] Click "Simpan Profile"
- [ ] Verify: Success message
- [ ] Verify: All changes saved

---

### ✅ Access Control Tests

#### Test 8: Menu Visibility
- [ ] Login as KARYAWAN
- [ ] Verify: "Profile" menu visible
- [ ] Verify: "User Management" menu NOT visible

- [ ] Login as ADMIN
- [ ] Verify: "Profile" menu visible
- [ ] Verify: "User Management" menu visible

#### Test 9: Direct URL Access
- [ ] Login as MAHASISWA (if exists)
- [ ] Try access: http://localhost:3000/dashboard/profile
- [ ] Verify: Redirected to /dashboard (access denied)

---

### ✅ Database Verification

#### Test 10: Check Database
- [ ] Open Prisma Studio: `bunx prisma studio`
- [ ] Open table "profiles"
- [ ] Verify: 2 records (karyawan + admin)
- [ ] Verify karyawan profile:
  - [ ] userId matches karyawan user
  - [ ] jabatan is null
  - [ ] statusKepegawaian is null
  - [ ] Other fields filled
- [ ] Verify admin profile:
  - [ ] userId matches admin user
  - [ ] jabatan is "CEO"
  - [ ] statusKepegawaian is "TIDAK_TETAP"
  - [ ] Other fields filled

---

## Quick Test Script

Copy-paste this checklist and mark ✅ as you test:

```
KARYAWAN TESTS:
[ ] Test 1: First Access - Form empty, no admin fields
[ ] Test 2: Create Profile - All fields save correctly
[ ] Test 3: Update Profile - Changes save correctly
[ ] Test 4: Security - Cannot update admin fields

ADMIN TESTS:
[ ] Test 5: Admin Access - Admin fields visible
[ ] Test 6: Create with Admin Fields - Admin fields save
[ ] Test 7: Update Admin Fields - Admin fields update

ACCESS CONTROL:
[ ] Test 8: Menu Visibility - Correct per role
[ ] Test 9: Direct URL - MAHASISWA blocked

DATABASE:
[ ] Test 10: Database Check - Data correct
```

---

## Expected Results Summary

### KARYAWAN Profile:
```
✅ Can read: All fields
✅ Can update: NIK, Nama, Gelar, Telepon, Alamat, Tempat/Tanggal Lahir, Jenis Kelamin, Foto
❌ Cannot update: Jabatan, Status Kepegawaian
```

### ADMIN Profile:
```
✅ Can read: All fields
✅ Can update: All fields including Jabatan and Status Kepegawaian
```

### Access Control:
```
✅ KARYAWAN: Can access profile
✅ ADMIN: Can access profile + user management
❌ MAHASISWA: Cannot access profile
```

---

## Troubleshooting

### Profile page shows 500 error
```bash
rm -rf node_modules/.prisma
bunx prisma generate
bun run dev
```

### Cannot save profile
- Check browser console for errors
- Verify session is valid (try refresh)
- Check server logs

### Admin fields not showing
- Verify logged in as ADMIN
- Check role badge in navbar
- Try logout and login again

---

## Time Estimate

- Setup: 5 minutes
- KARYAWAN Tests: 10 minutes
- ADMIN Tests: 10 minutes
- Access Control: 5 minutes
- Database Check: 5 minutes

**Total: ~35 minutes**

---

## Automated Testing (Future)

Untuk automated testing, perlu setup:
1. Playwright atau Cypress untuk browser automation
2. Test database terpisah
3. Seed data script

Saat ini, manual testing lebih praktis karena:
- Server Actions tidak expose REST API
- Cookie-based authentication
- Server-side rendering

---

**Happy Testing!** 🧪
