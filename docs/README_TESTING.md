# Testing Guide

## Why Manual Testing?

Aplikasi ini menggunakan:
- **Next.js Server Actions** (bukan REST API)
- **Cookie-based authentication** (httpOnly cookies)
- **Server-side rendering**

Karena itu, automated testing dengan simple HTTP requests tidak bisa dilakukan. Untuk automated testing penuh, perlu tools seperti Playwright atau Cypress.

## Quick Start

### 1. Setup Test Users

```bash
node setup-test-users.js
```

Ini akan create:
- admin@test.com / admin123 (ADMIN)
- karyawan@test.com / karyawan123 (KARYAWAN)

### 2. Manual Testing

Follow panduan lengkap di: **`MANUAL_TESTING_GUIDE.md`**

## Testing Options

### Option 1: Manual Testing (Recommended)
- ✅ Mudah dan cepat
- ✅ Test real user experience
- ✅ Visual verification
- ⏱️ ~35 minutes

**Guide:** `MANUAL_TESTING_GUIDE.md`

### Option 2: Automated E2E (Future)
- ✅ Repeatable
- ✅ CI/CD integration
- ❌ Perlu setup Playwright/Cypress
- ⏱️ Setup: ~2 hours

**Tools:**
- Playwright: https://playwright.dev
- Cypress: https://www.cypress.io

## Files

- `setup-test-users.js` - Create test users
- `MANUAL_TESTING_GUIDE.md` - Step-by-step manual testing
- `TESTING_PROFILE_MANAGEMENT.md` - Detailed test scenarios
- ~~`test-profile.js`~~ - (Deprecated: Doesn't work with Server Actions)
- ~~`run-all-tests.bat/sh`~~ - (Deprecated: Use manual testing)

## Quick Test

1. **Start server:**
```bash
bun run dev
```

2. **Create users:**
```bash
node setup-test-users.js
```

3. **Test in browser:**
- Login as karyawan@test.com
- Go to Profile
- Fill and save
- Verify data saved

4. **Test admin:**
- Login as admin@test.com
- Go to Profile
- Verify admin fields visible
- Fill and save

## Future: Automated Testing

Untuk implement automated testing:

### 1. Install Playwright
```bash
npm install -D @playwright/test
npx playwright install
```

### 2. Create Test File
```typescript
// tests/profile.spec.ts
import { test, expect } from '@playwright/test'

test('karyawan can create profile', async ({ page }) => {
  await page.goto('http://localhost:3000/login')
  await page.fill('[name="email"]', 'karyawan@test.com')
  await page.fill('[name="password"]', 'karyawan123')
  await page.click('button[type="submit"]')
  
  await page.click('text=Profile')
  await page.fill('[name="namaLengkap"]', 'John Doe')
  await page.click('button:has-text("Simpan Profile")')
  
  await expect(page.locator('text=Profile berhasil diupdate')).toBeVisible()
})
```

### 3. Run Tests
```bash
npx playwright test
```

## Summary

**Current:** Manual testing via browser (35 minutes)
**Future:** Automated with Playwright (after setup)

**For now, use:** `MANUAL_TESTING_GUIDE.md`

---

**Questions?** Check `MANUAL_TESTING_GUIDE.md` for detailed steps.
