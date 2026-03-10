# How to Run Playwright Tests

## 🚀 Quick Start (Recommended)

### Option 1: Clean Testing (Default)

**Run tests with clean state (data cleaned before tests):**

Windows:
```bash
scripts/run-all-tests.bat
```

Linux/Mac:
```bash
chmod +x scripts/run-all-tests.sh
./scripts/run-all-tests.sh
```

This will:
1. Setup test users
2. **Clean existing profiles** (for consistent test results)
3. Run all tests
4. Data created during tests will persist

### Option 2: Keep Data Mode

**Run tests and keep all data for inspection:**

Windows:
```bash
scripts/run-tests-keep-data.bat
```

Linux/Mac:
```bash
chmod +x scripts/run-tests-keep-data.sh
./scripts/run-tests-keep-data.sh
```

This will:
1. Setup test users
2. **Skip cleanup** (keep existing profiles)
3. Run profile tests only
4. All test data will be kept in database

**Use this when:**
- You want to inspect test data in Prisma Studio
- You want to login manually and see the profiles
- You're debugging data issues

## 💾 Understanding Test Data Behavior

### Default Mode (`run-all-tests.bat`)
```
Before tests: Clean profiles → Run tests → Data persists
```
- ✅ Consistent test results
- ✅ No interference from old data
- ✅ Best for CI/CD

### Keep Data Mode (`run-tests-keep-data.bat`)
```
Before tests: Keep profiles → Run tests → Data persists
```
- ✅ Inspect test data after tests
- ✅ Login manually to see profiles
- ✅ Best for debugging

### Inspect Test Data

After running tests with keep data mode:

```bash
# Open Prisma Studio
bunx prisma studio

# Or login manually
# http://localhost:3000/login
# karyawan@test.com / karyawan123
# admin@test.com / admin123
```

## 📋 Manual Testing

### 1. Setup Test Users (One Time)
```bash
node scripts/setup-test-users.js
```

This creates:
- karyawan@test.com / karyawan123
- admin@test.com / admin123

### 2. Run Tests

**Option A: Headless (Fast)**
```bash
npm run test
```

**Option B: Headed (See Browser)**
```bash
npm run test:headed
```

**Option C: UI Mode (Interactive - Recommended for Debugging)**
```bash
npm run test:ui
```

## Test Commands

```bash
# Run all tests
npm run test

# Run specific test file
npx playwright test tests/profile.spec.ts

# Run specific test by name
npx playwright test -g "KARYAWAN can create profile"

# Run with UI mode (recommended for debugging)
npm run test:ui

# Run headed (see browser)
npm run test:headed

# Show test report
npm run test:report

# Debug mode
npx playwright test --debug
```

## Test Structure

```
tests/
├── setup.spec.ts       # Setup test data (runs first)
└── profile.spec.ts     # Profile management tests
```

## Test Coverage

### KARYAWAN Tests (4 tests)
- ✅ TC1: Can access profile page
- ✅ TC2: Can create profile
- ✅ TC3: Can update profile
- ✅ TC4: Cannot see admin-only fields

### ADMIN Tests (3 tests)
- ✅ TC5: Can access profile with admin fields
- ✅ TC6: Can create profile with admin fields
- ✅ TC7: Can update admin-only fields

### Access Control (2 tests)
- ✅ TC8: Menu visibility based on role
- ✅ TC9: MAHASISWA cannot access profile

**Total: 9 automated tests**

## Expected Output

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

## Troubleshooting

### Tests fail with "Server not running"
```bash
# Make sure dev server is running
bun run dev
```

### Tests fail with "User not found"
```bash
# Create test users
node setup-test-users.js
```

### Prisma error
```bash
# Regenerate Prisma Client
rm -rf node_modules/.prisma
bunx prisma generate
```

### Want to see what's happening
```bash
# Run with headed mode
npm run test:headed

# Or use UI mode
npm run test:ui
```

### Tests are flaky
```bash
# Run with retries
npx playwright test --retries=2
```

## CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm run test
```

## Tips

1. **Use UI Mode for Development**
   ```bash
   npm run test:ui
   ```
   - See tests run in real-time
   - Time travel through test steps
   - Inspect DOM at any point

2. **Debug Specific Test**
   ```bash
   npx playwright test --debug -g "create profile"
   ```

3. **Generate Test Code**
   ```bash
   npx playwright codegen http://localhost:3000
   ```
   - Opens browser
   - Records your actions
   - Generates test code

4. **Screenshots on Failure**
   - Automatically saved in `test-results/`
   - Check after failed tests

5. **Parallel Testing**
   - Currently disabled (workers: 1)
   - Enable for faster tests when database allows

## Time Estimate

- Setup: 2 minutes
- Test run: ~30 seconds
- Total: ~3 minutes

**vs Manual Testing: 35 minutes**

**Time Saved: 32 minutes per test run!** 🎉

---

**Happy Testing!** 🧪
