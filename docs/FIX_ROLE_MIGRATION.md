# Fix Role Migration - MAHASISWA & KARYAWAN to USER

## Problem

Ada data existing dengan role `MAHASISWA` dan `KARYAWAN` yang perlu diubah ke `USER` atau `ADMIN` sebelum drop enum values.

## Solution: Manual SQL Migration

### Step 1: Update Existing Data

Jalankan SQL ini di Supabase SQL Editor atau Prisma Studio:

```sql
-- Update semua MAHASISWA menjadi USER
UPDATE users 
SET role = 'USER' 
WHERE role = 'MAHASISWA';

-- Update semua KARYAWAN menjadi USER (atau ADMIN jika mau)
UPDATE users 
SET role = 'USER' 
WHERE role = 'KARYAWAN';

-- Verify: Check apakah masih ada MAHASISWA atau KARYAWAN
SELECT role, COUNT(*) 
FROM users 
GROUP BY role;
```

### Step 2: Drop Old Enum Values

Setelah data sudah diupdate, jalankan:

```sql
-- Drop old enum values
ALTER TYPE "Role" RENAME TO "Role_old";

-- Create new enum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- Update column to use new enum
ALTER TABLE users 
  ALTER COLUMN role TYPE "Role" 
  USING role::text::"Role";

-- Drop old enum
DROP TYPE "Role_old";
```

### Step 3: Update Default Value

```sql
-- Set default to ADMIN
ALTER TABLE users 
  ALTER COLUMN role SET DEFAULT 'ADMIN'::"Role";
```

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

## Alternative: Quick Fix via Supabase Dashboard

### Option 1: Via SQL Editor

1. Buka Supabase Dashboard
2. Klik **SQL Editor**
3. Paste dan run:

```sql
-- Update all existing data
UPDATE users SET role = 'USER' WHERE role IN ('MAHASISWA', 'KARYAWAN');

-- Recreate enum
ALTER TYPE "Role" RENAME TO "Role_old";
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');
ALTER TABLE users ALTER COLUMN role TYPE "Role" USING role::text::"Role";
DROP TYPE "Role_old";
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'ADMIN'::"Role";
```

### Option 2: Via Prisma Studio

1. Jalankan: `npx prisma studio`
2. Buka table **users**
3. Manually update semua role MAHASISWA → USER
4. Manually update semua role KARYAWAN → USER
5. Close Prisma Studio
6. Run: `npx prisma db push --force-reset` (⚠️ HATI-HATI: Ini akan reset database!)

## Recommended: Safe Migration

Jika tidak mau kehilangan data:

```bash
# 1. Backup database dulu!
# Export dari Supabase Dashboard > Database > Backups

# 2. Update data via SQL
# Run SQL di atas via Supabase SQL Editor

# 3. Verify
# Check semua user sudah role ADMIN atau USER

# 4. Push schema
npx prisma db push

# 5. Generate client
npx prisma generate
```

## Verify Migration

Setelah migration, verify dengan:

```sql
-- Check role distribution
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;

-- Should only show ADMIN and USER
```

## Rollback (if needed)

Jika ada masalah:

```sql
-- Restore enum with old values
ALTER TYPE "Role" RENAME TO "Role_new";
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'KARYAWAN', 'MAHASISWA');
ALTER TABLE users ALTER COLUMN role TYPE "Role" USING role::text::"Role";
DROP TYPE "Role_new";
```

## Update Code

Setelah migration berhasil, update code yang masih reference KARYAWAN/MAHASISWA:

1. Search `KARYAWAN` di codebase → replace dengan `USER` atau `ADMIN`
2. Search `MAHASISWA` di codebase → replace dengan `USER`
3. Update any role checks di middleware/guards

## Testing

```bash
# 1. Test login
# 2. Test registration
# 3. Test role-based access
# 4. Check dashboard layout
# 5. Verify profile page
```
