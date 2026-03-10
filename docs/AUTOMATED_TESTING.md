# Automated E2E Testing with Playwright

Panduan lengkap untuk menjalankan automated testing menggunakan Playwright.

---

## 🚀 Quick Start

### Option 1: Clean Testing (Default)

**Jalankan tests dengan clean state:**

Windows:
```bash
scripts/run-all-tests.bat
```

Linux/Mac:
```bash
chmod +x scripts/run-all-tests.sh
./scripts/run-all-tests.sh
```

Script ini akan otomatis:
1. ✅ Setup test users (admin@test.com, karyawan@test.com)
2. ✅ Clean existing profiles (untuk hasil konsisten)
3. ✅ Start dev server (jika belum running)
4. ✅ Run 9 automated E2E tests
5. ✅ Data yang dibuat saat test akan tersimpan

### Option 2: Keep Data Mode

**Jalankan tests dan simpan semua data untuk inspeksi:**

Windows:
```bash
scripts/run-tests-keep-data.bat
```

Linux/Mac:
```bash
chmod +x scripts/run-tests-keep-data.sh
./scripts/run-tests-keep-data.sh
```

Script ini akan:
1. ✅ Setup test users
2. ✅ Skip cleanup (keep existing profiles)
3. ✅ Run profile tests only
4. ✅ Semua test data disimpan di database

**Gunakan keep data mode ketika:**
- Ingin inspect test data di Prisma Studio
- Ingin login manual dan lihat profiles
- Debugging data issues

---

## 💾 Memahami Test Data Behavior

### Kenapa Tests Clean Data?

Tests membersihkan existing profiles sebelum run untuk memastikan:
- ✅ Hasil test konsisten setiap kali
- ✅ Tidak ada interference dari test run sebelumnya
- ✅ Tests mulai dari known state

Ini adalah **best practice** untuk automated testing.

### Inspect Test Data

Setelah running tests (dengan mode apapun):

```bash
# Buka Prisma Studio
bunx prisma studio

# Check profiles table
# Anda akan lihat profiles yang dibuat oleh tests
```

Atau login manual:
```
http://localhost:3000/login

KARYAWAN:
- Email: karyawan@test.com
- Password: karyawan123

ADMIN:
- Email: admin@test.com
- Password: admin123
```

### Test Data Lifecycle

**Default Mode (run-all-tests.bat):**
```
1. Clean profiles (delete existing)
2. Run tests (create new profiles)
3. Tests complete
4. Data persists in database ✅
```

**Keep Data Mode (run-tests-keep-data.bat):**
```
1. Keep profiles (no cleanup)
2. Run tests (may update existing profiles)
3. Tests complete
4. All data persists ✅
```

---

## 📊 Test Coverage (9 Tests)

### Setup Tests (2 tests)
- ✅ Create test users (admin & karyawan)
- ✅ Clean up existing profiles

### KARYAWAN Tests (4 tests)
- ✅ TC1: Can access profile page
- ✅ TC2: Can create profile with allowed fields
- ✅ TC3: Can update profile
- ✅ TC4: Cannot see/edit admin-only fields (security)

### ADMIN Tests (3 tests)
- ✅ TC5: Can access profile with admin fields visible
- ✅ TC6: Can create profile with admin fields (jabatan, status)
- ✅ TC7: Can update admin-only fields

### Access Control (2 tests)
- ✅ TC8: Menu visibility based on role
- ✅ TC9: MAHASISWA cannot access profile

---

## 🔧 Manual Testing Options

### 1. Setup Test Users (One Time)
```bash
node scripts/setup-test-users.js
```

Creates:
- **admin@test.com** / admin123 (ADMIN role)
- **karyawan@test.com** / karyawan123 (KARYAWAN role)

### 2. Run Tests

**Headless (Fast - untuk CI/CD)**
```bash
npm run test
```

**Headed (Lihat browser berjalan)**
```bash
npm run test:headed
```

**UI Mode (Interactive - Best for Development)**
```bash
npm run test:ui
```

**Specific Test File**
```bash
npx playwright test tests/profile.spec.ts
```

**Specific Test by Name**
```bash
npx playwright test -g "KARYAWAN can create profile"
```

**Debug Mode**
```bash
npx playwright test --debug
```

### 3. View Test Report
```bash
npm run test:report
```

---

## 📁 Test Structure

```
tests/
├── setup.spec.ts       # Setup test data (runs first)
│   ├── Create test users
│   └── Clean up existing profiles
│
└── profile.spec.ts     # Profile management tests (9 tests)
    ├── KARYAWAN tests (4)
    │   ├── TC1: Access profile page
    │   ├── TC2: Create profile
    │   ├── TC3: Update profile
    │   └── TC4: Security check (cannot edit admin fields)
    │
    ├── ADMIN tests (3)
    │   ├── TC5: Access profile with admin fields
    │   ├── TC6: Create profile with admin fields
    │   └── TC7: Update admin-only fields
    │
    └── Access control (2)
        ├── TC8: Menu visibility by role
        └── TC9: MAHASISWA cannot access
```

---

## 🎬 How Playwright Tests Work

### 1. Automatic Server Start
Playwright config akan otomatis start dev server jika belum running:
```typescript
webServer: {
  command: 'bun run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: true,
}
```

### 2. Browser Automation
- Tests berjalan di real browser (Chromium)
- Simulate user interactions (click, type, navigate)
- Verify UI elements and behavior

### 3. Sequential Execution
```typescript
workers: 1  // Run tests one by one
```
Untuk avoid database conflicts saat multiple tests update data.

### 4. Screenshots on Failure
```typescript
screenshot: 'only-on-failure'
```
Otomatis capture screenshot jika test gagal.

### 5. HTML Report
```typescript
reporter: 'html'
```
Detailed report dengan timeline, screenshots, dan logs.

---

## ⏱️ Time Estimate

| Activity | Time |
|----------|------|
| Setup database | 30s |
| Create test users | 10s |
| Run 9 tests | 30s |
| **Total** | **~1-2 minutes** |

**vs Manual Testing: 35 minutes** → Hemat 33 menit! 🎉

---

## 🎯 What Gets Tested

### Profile Fields - KARYAWAN Can Edit:
- ✅ NIK
- ✅ Nama Lengkap
- ✅ Gelar (Depan & Belakang)
- ✅ Telepon
- ✅ Alamat
- ✅ Tempat Lahir
- ✅ Tanggal Lahir
- ✅ Jenis Kelamin
- ✅ Foto Profil

### Profile Fields - ADMIN Only:
- 🔒 Jabatan
- 🔒 Status Kepegawaian (TETAP/TIDAK_TETAP)

### Security Checks:
- ✅ KARYAWAN cannot see admin fields in UI
- ✅ KARYAWAN cannot update admin fields
- ✅ ADMIN can see and update all fields
- ✅ Menu visibility based on role
- ✅ Access control for different roles

---

## 🔍 Troubleshooting

### Tests fail with Prisma error
```bash
# Stop dev server first (Ctrl+C)

# Windows
rmdir /s /q node_modules\.prisma

# Linux/Mac
rm -rf node_modules/.prisma

# Regenerate
bunx prisma generate
```

### Want to see what's happening
```bash
# Run with headed mode
npm run test:headed

# Or use UI mode (best)
npm run test:ui
```

### Tests are flaky
```bash
# Run with retries
npx playwright test --retries=2
```

### Check screenshots
Failed tests automatically save screenshots to:
```
test-results/
└── [test-name]/
    └── test-failed-1.png
```

### Server already running
Playwright akan reuse existing server. Jika ada masalah:
```bash
# Stop server
# Ctrl+C di terminal yang running dev server

# Run tests (akan start server baru)
npm run test
```

---

## 🎨 UI Mode Features

```bash
npm run test:ui
```

Benefits:
- ✅ See tests run in real-time
- ✅ Time travel through test steps
- ✅ Inspect DOM at any point
- ✅ Re-run specific tests
- ✅ Debug with breakpoints
- ✅ Visual feedback

Perfect for:
- Understanding what tests do
- Debugging failures
- Developing new tests

---

## 🤖 CI/CD Integration

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      SESSION_SECRET: ${{ secrets.SESSION_SECRET }}
      REGISTRATION_TOKEN: ${{ secrets.REGISTRATION_TOKEN }}
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Setup database
        run: |
          bunx prisma generate
          bunx prisma db push --accept-data-loss
      
      - name: Install Playwright
        run: bunx playwright install --with-deps chromium
      
      - name: Run tests
        run: bun run test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 💡 Tips & Best Practices

### 1. Use UI Mode for Development
```bash
npm run test:ui
```
- Best way to understand what tests are doing
- Easy to debug failures
- Visual feedback

### 2. Run Specific Tests During Development
```bash
# Run only KARYAWAN tests
npx playwright test -g "KARYAWAN"

# Run only create profile test
npx playwright test -g "create profile"
```

### 3. Generate Test Code
```bash
npx playwright codegen http://localhost:3000
```
- Opens browser
- Records your actions
- Generates test code automatically

### 4. Check Test Output
- Console logs show detailed steps
- Screenshots saved on failure
- HTML report has full timeline

### 5. Keep Tests Independent
- Each test should work standalone
- Don't rely on test execution order
- Clean up test data in setup

---

## 📝 Test Credentials

```javascript
// KARYAWAN
email: 'karyawan@test.com'
password: 'karyawan123'

// ADMIN
email: 'admin@test.com'
password: 'admin123'
```

---

## 🎯 Expected Output

### Successful Test Run

```
Running 9 tests using 1 worker

  ✓ tests/setup.spec.ts:7:3 › Setup Test Data › Create test users (2s)
  ✓ tests/setup.spec.ts:42:3 › Setup Test Data › Clean up existing profiles (1s)
  ✓ tests/profile.spec.ts:23:3 › Profile Management - KARYAWAN › TC1: KARYAWAN can access profile page (3s)
  ✓ tests/profile.spec.ts:42:3 › Profile Management - KARYAWAN › TC2: KARYAWAN can create profile (5s)
  ✓ tests/profile.spec.ts:70:3 › Profile Management - KARYAWAN › TC3: KARYAWAN can update profile (4s)
  ✓ tests/profile.spec.ts:89:3 › Profile Management - KARYAWAN › TC4: KARYAWAN cannot see admin-only fields (2s)
  ✓ tests/profile.spec.ts:108:3 › Profile Management - ADMIN › TC5: ADMIN can access profile with admin fields (3s)
  ✓ tests/profile.spec.ts:124:3 › Profile Management - ADMIN › TC6: ADMIN can create profile with admin fields (6s)
  ✓ tests/profile.spec.ts:154:3 › Profile Management - ADMIN › TC7: ADMIN can update admin-only fields (4s)

  9 passed (30s)
```

---

## 📚 Additional Resources

### Playwright Documentation
- [Getting Started](https://playwright.dev/docs/intro)
- [Writing Tests](https://playwright.dev/docs/writing-tests)
- [Best Practices](https://playwright.dev/docs/best-practices)

### Project Documentation
- [MANUAL_TESTING_GUIDE.md](./MANUAL_TESTING_GUIDE.md) - Manual testing steps
- [TESTING_PROFILE_MANAGEMENT.md](./TESTING_PROFILE_MANAGEMENT.md) - Detailed test cases
- [RUN_TESTS.md](./RUN_TESTS.md) - Quick reference

---

**Happy Testing!** 🧪

Automated testing saves time and ensures consistency across all test runs.
