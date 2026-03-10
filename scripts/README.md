# Scripts Directory

Folder ini berisi semua script untuk testing dan setup.

---

## 📜 Available Scripts

### Testing Scripts

#### 1. run-all-tests.bat / run-all-tests.sh
**Purpose:** Run all Playwright E2E tests with clean state

**Usage:**
```bash
# Windows
scripts/run-all-tests.bat

# Linux/Mac
chmod +x scripts/run-all-tests.sh
./scripts/run-all-tests.sh
```

**What it does:**
1. Setup test users (admin@test.com, karyawan@test.com)
2. Clean existing profiles (for consistent results)
3. Run all 9 E2E tests
4. Show results

**When to use:**
- Regular testing
- CI/CD pipelines
- Before committing code
- Verifying features work

---

#### 2. run-tests-keep-data.bat / run-tests-keep-data.sh
**Purpose:** Run tests WITHOUT cleaning data (for inspection)

**Usage:**
```bash
# Windows
scripts/run-tests-keep-data.bat

# Linux/Mac
chmod +x scripts/run-tests-keep-data.sh
./scripts/run-tests-keep-data.sh
```

**What it does:**
1. Setup test users
2. Skip cleanup (keep existing profiles)
3. Run profile tests only
4. Keep all data in database

**When to use:**
- Debugging data issues
- Inspecting test data in Prisma Studio
- Manual verification after tests
- Understanding what data tests create

---

### Setup Scripts

#### 3. setup-test-users.js
**Purpose:** Create test users in database

**Usage:**
```bash
node scripts/setup-test-users.js
```

**What it does:**
1. Check if test users exist
2. Create users if not exist:
   - admin@test.com / admin123 (ADMIN)
   - karyawan@test.com / karyawan123 (KARYAWAN)
3. Hash passwords with bcrypt
4. Save to database

**When to use:**
- First time setup
- After database reset
- When test users are missing
- Manual testing preparation

**Output:**
```
✅ Created user: admin@test.com (ADMIN)
✅ Created user: karyawan@test.com (KARYAWAN)
```

Or if users exist:
```
⚠️  User admin@test.com already exists
⚠️  User karyawan@test.com already exists
```

---

#### 4. fix-prisma.bat / fix-prisma.sh
**Purpose:** Fix Prisma Client issues

**Usage:**
```bash
# Windows
scripts\fix-prisma.bat

# Linux/Mac
chmod +x scripts/fix-prisma.sh
./scripts/fix-prisma.sh
```

**What it does:**
1. Clean Prisma cache (delete node_modules/.prisma)
2. Regenerate Prisma Client
3. Validate schema

**When to use:**
- After schema changes
- When getting "Cannot read properties of undefined" errors
- After adding new models
- When Prisma Client is out of sync

**Important:** After running this script, you MUST restart dev server!

---

## 🚀 Quick Reference

### Run All Tests (Clean State)
```bash
# Windows
scripts\run-all-tests.bat

# Linux/Mac
./scripts/run-all-tests.sh
```

### Run Tests (Keep Data)
```bash
# Windows
scripts\run-tests-keep-data.bat

# Linux/Mac
./scripts/run-tests-keep-data.sh
```

### Setup Test Users Only
```bash
node scripts/setup-test-users.js
```

### Fix Prisma Client Issues
```bash
# Windows
scripts\fix-prisma.bat

# Linux/Mac
./scripts/fix-prisma.sh

# Then restart dev server
```

### Run Tests via npm
```bash
npm run test              # Headless
npm run test:ui           # UI mode
npm run test:headed       # See browser
npm run test:setup        # Setup users only
```

---

## 📁 Script Structure

```
scripts/
├── README.md                    # This file
├── run-all-tests.bat           # Windows: Run all tests
├── run-all-tests.sh            # Linux/Mac: Run all tests
├── run-tests-keep-data.bat     # Windows: Run tests, keep data
├── run-tests-keep-data.sh      # Linux/Mac: Run tests, keep data
├── run-prodi-tests.bat         # Windows: Run prodi tests
├── run-prodi-tests.sh          # Linux/Mac: Run prodi tests
├── setup-test-users.js         # Setup test users
├── fix-prisma.bat              # Windows: Fix Prisma Client
└── fix-prisma.sh               # Linux/Mac: Fix Prisma Client
```

---

## 🔧 Script Details

### run-all-tests.bat / .sh

**Steps:**
1. Setup test users
2. Run Playwright tests (auto-starts dev server)
3. Show results

**Exit Codes:**
- 0: All tests passed
- 1: Some tests failed or setup error

**Output:**
```
╔════════════════════════════════════════════════════════════╗
║     Profile Management - Playwright E2E Test Suite        ║
╚════════════════════════════════════════════════════════════╝

[1/2] Setting up test users...
✅ Created karyawan@test.com
✅ Created admin@test.com

[2/2] Running Playwright E2E tests...

Running 11 tests using 1 worker
  ✓ tests/setup.spec.ts:7:3 › Setup Test Data › Create test users (2s)
  ✓ tests/setup.spec.ts:42:3 › Setup Test Data › Clean up existing profiles (1s)
  ✓ tests/profile.spec.ts:23:3 › Profile Management - KARYAWAN › TC1 (3s)
  ...

  11 passed (30s)

╔════════════════════════════════════════════════════════════╗
║              🎉 ALL TESTS PASSED! 🎉                       ║
╚════════════════════════════════════════════════════════════╝
```

---

### run-tests-keep-data.bat / .sh

**Difference from run-all-tests:**
- Skips setup.spec.ts (no cleanup)
- Only runs profile.spec.ts
- Data persists for inspection

**Use case:**
```bash
# Run tests and keep data
./scripts/run-tests-keep-data.sh

# Then inspect data
bunx prisma studio

# Or login manually
# http://localhost:3000/login
# karyawan@test.com / karyawan123
```

---

### setup-test-users.js

**Dependencies:**
- @prisma/client
- bcryptjs

**Database:**
- Connects to DATABASE_URL from .env
- Creates users in `users` table
- Uses bcrypt with 12 rounds

**Error Handling:**
- Checks if users exist before creating
- Handles database connection errors
- Provides clear error messages

---

## 💡 Tips

### 1. Make Scripts Executable (Linux/Mac)
```bash
chmod +x scripts/*.sh
```

### 2. Run from Root Directory
```bash
# Good
./scripts/run-all-tests.sh

# Also works
cd scripts
./run-all-tests.sh
cd ..
```

### 3. Check Script Output
Scripts provide colored output:
- 🟢 Green: Success
- 🔴 Red: Error
- 🟡 Yellow: Warning
- 🔵 Cyan: Info

### 4. Debugging Failed Tests
```bash
# Run with UI mode
npm run test:ui

# Or run specific test
npx playwright test tests/profile.spec.ts

# Or with debug mode
npx playwright test --debug
```

---

## 🔍 Troubleshooting

### Script Not Found
```bash
# Make sure you're in project root
pwd

# Check if scripts exist
ls scripts/
```

### Permission Denied (Linux/Mac)
```bash
chmod +x scripts/*.sh
```

### Test Users Not Created
```bash
# Run setup manually
node scripts/setup-test-users.js

# Check database
bunx prisma studio
```

### Tests Fail
```bash
# Check if dev server is running
# Playwright will auto-start it

# Check database connection
# Verify .env has correct DATABASE_URL

# Regenerate Prisma Client
scripts\fix-prisma.bat  # Windows
./scripts/fix-prisma.sh # Linux/Mac

# Then restart dev server
```

---

## 📚 Related Documentation

- [../docs/AUTOMATED_TESTING.md](../docs/AUTOMATED_TESTING.md) - Full testing guide
- [../docs/RUN_TESTS.md](../docs/RUN_TESTS.md) - Quick reference
- [../docs/TEST_RESULTS_DOCUMENTATION.md](../docs/TEST_RESULTS_DOCUMENTATION.md) - Test results

---

**Happy Testing!** 🧪
