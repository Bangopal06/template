# Program Studi Management Guide

Panduan lengkap untuk mengelola data Program Studi (Prodi) dalam sistem.

---

## 📋 Overview

Fitur Program Studi Management memungkinkan ADMIN untuk:
- ✅ Create (Tambah) prodi baru
- ✅ Read (Lihat) daftar prodi
- ✅ Update (Edit) data prodi
- ✅ Delete (Hapus) prodi dengan soft delete

---

## 🎯 Access Control

**Role yang dapat akses:** ADMIN only

**Menu Location:** Dashboard → Program Studi

**URL:** `/dashboard/prodi`

---

## 📊 Data Structure

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | String | Optional | Kode prodi (unique) |
| nama | String | Required | Nama program studi |
| jenjang | String | Required | Jenjang pendidikan (D3, D4, S1, S2, S3) |
| status | Boolean | Required | Active/Inactive (default: true) |
| createdAt | DateTime | Auto | Timestamp created |
| updatedAt | DateTime | Auto | Timestamp updated |
| deletedAt | DateTime | Optional | Timestamp deleted (soft delete) |

### Jenjang Options
- D3 (Diploma 3)
- D4 (Diploma 4)
- S1 (Sarjana)
- S2 (Magister)
- S3 (Doktor)

### Status Options
- Active (true) - Prodi aktif
- Inactive (false) - Prodi tidak aktif

---

## 🚀 Features

### 1. Create Prodi

**Steps:**
1. Login sebagai ADMIN
2. Navigate to Dashboard → Program Studi
3. Fill form "Tambah Program Studi Baru":
   - Kode Prodi (optional)
   - Nama Prodi (required)
   - Jenjang (required)
   - Status (required, default: Active)
4. Click "Tambah Prodi"

**Validation:**
- Nama prodi wajib diisi
- Jenjang wajib dipilih
- Kode prodi harus unique (jika diisi)

**Example:**
```
Kode: IF
Nama: Teknik Informatika
Jenjang: S1
Status: Active
```

---

### 2. View Prodi List

**Features:**
- Menampilkan semua prodi aktif (deletedAt = null)
- Sorted by createdAt (newest first)
- Menampilkan:
  - Kode prodi (jika ada)
  - Nama prodi
  - Badge status (Active/Inactive)
  - Badge jenjang
  - Tanggal dibuat
  - Tanggal diupdate (jika ada perubahan)

**Empty State:**
- Jika belum ada data: "Belum ada data program studi"

---

### 3. Update Prodi

**Steps:**
1. Click button "Edit" pada prodi yang ingin diubah
2. Form edit akan muncul inline
3. Edit fields yang ingin diubah:
   - Kode
   - Nama
   - Jenjang
   - Status
4. Click "Simpan" untuk save changes
5. Click "Batal" untuk cancel

**Validation:**
- Nama prodi wajib diisi
- Kode prodi harus unique (jika diubah)
- Jenjang wajib dipilih

**Auto-Update:**
- `updatedAt` akan otomatis diupdate ke timestamp saat ini

---

### 4. Delete Prodi (Soft Delete)

**Steps:**
1. Click button "Hapus" pada prodi yang ingin dihapus
2. Confirm dialog akan muncul
3. Click "OK" untuk confirm delete

**Soft Delete Behavior:**
- Data tidak benar-benar dihapus dari database
- Field `deletedAt` diset ke timestamp saat ini
- Field `status` diubah menjadi `false` (Inactive)
- Prodi tidak akan muncul di list (filtered by deletedAt = null)

**Why Soft Delete?**
- Data history tetap tersimpan
- Dapat di-restore jika diperlukan
- Audit trail lengkap
- Referential integrity terjaga

---

## 🔒 Security

### Access Control
- ✅ Only ADMIN can access `/dashboard/prodi`
- ✅ Non-ADMIN akan redirect ke `/dashboard`
- ✅ Unauthenticated akan redirect ke `/login`

### API Security
- ✅ All API routes check session
- ✅ All API routes check ADMIN role
- ✅ Return 401 Unauthorized if not ADMIN

### Data Validation
- ✅ Server-side validation dengan Zod
- ✅ Unique constraint pada `code`
- ✅ Required fields validation
- ✅ Type validation

---

## 📡 API Endpoints

### GET /api/prodi
**Purpose:** Get all prodi

**Auth:** Required (ADMIN only)

**Query Params:**
- `includeDeleted` (optional): "true" to include deleted prodi

**Response:**
```json
{
  "success": true,
  "prodis": [
    {
      "id": "uuid",
      "code": "IF",
      "nama": "Teknik Informatika",
      "jenjang": "S1",
      "status": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "deletedAt": null
    }
  ]
}
```

---

### POST /api/prodi/create
**Purpose:** Create new prodi

**Auth:** Required (ADMIN only)

**Request Body:**
```json
{
  "code": "IF",
  "nama": "Teknik Informatika",
  "jenjang": "S1",
  "status": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Prodi berhasil ditambahkan",
  "prodi": { /* prodi data */ }
}
```

**Errors:**
- 400: Data tidak valid
- 400: Kode prodi sudah digunakan
- 401: Unauthorized

---

### PUT /api/prodi/update
**Purpose:** Update existing prodi

**Auth:** Required (ADMIN only)

**Request Body:**
```json
{
  "id": "uuid",
  "code": "IF",
  "nama": "Teknik Informatika",
  "jenjang": "S1",
  "status": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Prodi berhasil diupdate",
  "prodi": { /* updated prodi data */ }
}
```

**Errors:**
- 400: Data tidak valid
- 400: Kode prodi sudah digunakan
- 404: Prodi tidak ditemukan
- 401: Unauthorized

---

### DELETE /api/prodi/delete
**Purpose:** Soft delete prodi

**Auth:** Required (ADMIN only)

**Request Body:**
```json
{
  "id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Prodi berhasil dihapus",
  "prodi": { /* deleted prodi data */ }
}
```

**Errors:**
- 400: Data tidak valid
- 404: Prodi tidak ditemukan
- 401: Unauthorized

---

## 💾 Database Schema

```prisma
model Prodi {
  id        String    @id @default(uuid()) @db.Uuid
  code      String?   @unique
  nama      String
  jenjang   String
  status    Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  @@map("prodis")
}
```

---

## 🎨 UI Components

### Files Structure
```
app/dashboard/prodi/
├── page.tsx              # Main page (server component)
├── CreateProdiForm.tsx   # Form untuk tambah prodi
└── ProdiList.tsx         # List dan edit prodi
```

### CreateProdiForm.tsx
**Features:**
- Form untuk create prodi baru
- Client-side validation
- Success/error messages
- Auto-refresh after success

### ProdiList.tsx
**Features:**
- Display list of prodi
- Inline edit mode
- Delete with confirmation
- Real-time updates
- Badge untuk status dan jenjang

---

## 🧪 Testing

### Manual Testing

**Test Case 1: Create Prodi**
1. Login as ADMIN
2. Navigate to Program Studi
3. Fill form with valid data
4. Submit
5. ✅ Verify prodi appears in list
6. ✅ Verify success message
7. ✅ Verify form reset

**Test Case 2: Create Prodi with Duplicate Code**
1. Try to create prodi with existing code
2. ✅ Verify error message: "Kode prodi sudah digunakan"

**Test Case 3: Update Prodi**
1. Click Edit on a prodi
2. Change some fields
3. Click Simpan
4. ✅ Verify changes saved
5. ✅ Verify updatedAt changed

**Test Case 4: Delete Prodi**
1. Click Hapus on a prodi
2. Confirm deletion
3. ✅ Verify prodi removed from list
4. ✅ Verify soft delete (check database)

**Test Case 5: Access Control**
1. Login as KARYAWAN
2. Try to access /dashboard/prodi
3. ✅ Verify redirect to /dashboard
4. ✅ Verify menu not visible

---

## 🔍 Troubleshooting

### Prodi tidak muncul di list
**Solution:**
- Check if prodi has deletedAt = null
- Check database directly via Prisma Studio

### Error saat create prodi
**Solution:**
- Check validation errors
- Check if code is unique
- Check required fields

### Error saat update prodi
**Solution:**
- Check if prodi exists
- Check if new code is unique
- Check validation

### Soft delete tidak bekerja
**Solution:**
- Check API response
- Check database: deletedAt, status
- Verify filter in GET query

---

## 📚 Related Documentation

- [USER_MANAGEMENT_GUIDE.md](./USER_MANAGEMENT_GUIDE.md) - User management
- [ADMIN_SETUP.md](./ADMIN_SETUP.md) - Admin setup
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Project structure

---

## 🎯 Best Practices

### 1. Kode Prodi
- Gunakan kode singkat dan jelas (2-5 karakter)
- Uppercase untuk consistency
- Contoh: IF, SI, TI, MI

### 2. Nama Prodi
- Gunakan nama lengkap dan formal
- Contoh: "Teknik Informatika", bukan "TI"

### 3. Status Management
- Set Inactive untuk prodi yang tidak aktif
- Jangan langsung delete, gunakan Inactive dulu
- Soft delete hanya untuk prodi yang benar-benar tidak digunakan

### 4. Soft Delete
- Soft delete lebih aman daripada hard delete
- Data history tetap tersimpan
- Dapat di-restore jika diperlukan

---

## 🚀 Future Enhancements

Potential improvements:
1. Restore deleted prodi feature
2. Bulk operations (delete multiple)
3. Export to Excel/CSV
4. Import from Excel/CSV
5. Search and filter
6. Pagination for large datasets
7. Prodi history/audit log
8. Relationship with other entities (e.g., Mahasiswa, Dosen)

---

**Last Updated:** 2024
**Version:** 1.0
**Status:** Production Ready ✅
