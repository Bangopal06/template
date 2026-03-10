-- Migration: Change MAHASISWA and KARYAWAN to USER
-- Run this in Supabase SQL Editor before running prisma db push

-- Step 1: Update existing data
UPDATE users 
SET role = 'USER' 
WHERE role IN ('MAHASISWA', 'KARYAWAN');

-- Step 2: Verify update
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;

-- Step 3: Recreate enum with only ADMIN and USER
ALTER TYPE "Role" RENAME TO "Role_old";

CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

ALTER TABLE users 
  ALTER COLUMN role TYPE "Role" 
  USING role::text::"Role";

DROP TYPE "Role_old";

-- Step 4: Set default to ADMIN
ALTER TABLE users 
  ALTER COLUMN role SET DEFAULT 'ADMIN'::"Role";

-- Step 5: Final verification
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;

-- You should only see ADMIN and USER now
