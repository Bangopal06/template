import { test, expect } from '@playwright/test'

// Test credentials
const ADMIN = {
  email: 'admin@test.com',
  password: 'admin123',
}

const KARYAWAN = {
  email: 'karyawan@test.com',
  password: 'karyawan123',
}

// Helper function to login
async function login(page, email: string, password: string) {
  await page.goto('/login')
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL('/dashboard')
}

test.describe('Prodi Management - ADMIN', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN.email, ADMIN.password)
  })

  test('TC1: ADMIN can access prodi page', async ({ page }) => {
    // Navigate to prodi
    await page.click('text=Program Studi')
    await page.waitForURL('/dashboard/prodi')

    // Verify page loaded
    await expect(page.getByRole('heading', { name: 'Management Program Studi' })).toBeVisible()
    await expect(page.locator('text=Tambah Program Studi Baru')).toBeVisible()
    await expect(page.locator('text=Daftar Program Studi')).toBeVisible()
  })

  test('TC2: ADMIN can create prodi', async ({ page }) => {
    await page.click('text=Program Studi')
    await page.waitForURL('/dashboard/prodi')

    // Fill create form
    await page.fill('input[name="code"]', 'IF')
    await page.fill('input[name="nama"]', 'Teknik Informatika')
    await page.selectOption('select[name="jenjang"]', 'S1')
    await page.selectOption('select[name="status"]', 'true')

    // Submit form
    await page.click('button:has-text("Tambah Prodi")')

    // Verify success message
    await expect(page.locator('text=Prodi berhasil ditambahkan')).toBeVisible({ timeout: 10000 })

    // Verify prodi appears in list
    await expect(page.locator('text=[IF] Teknik Informatika')).toBeVisible()
    await expect(page.locator('text=S1')).toBeVisible()
  })

  test('TC3: ADMIN cannot create prodi with duplicate code', async ({ page }) => {
    await page.click('text=Program Studi')
    await page.waitForURL('/dashboard/prodi')

    // Try to create prodi with same code
    await page.fill('input[name="code"]', 'IF')
    await page.fill('input[name="nama"]', 'Sistem Informasi')
    await page.selectOption('select[name="jenjang"]', 'S1')
    await page.click('button:has-text("Tambah Prodi")')

    // Verify error message
    await expect(page.locator('text=Kode prodi sudah digunakan')).toBeVisible({ timeout: 10000 })
  })

  test('TC4: ADMIN can create prodi without code', async ({ page }) => {
    await page.click('text=Program Studi')
    await page.waitForURL('/dashboard/prodi')

    // Fill form without code
    await page.fill('input[name="nama"]', 'Manajemen Informatika')
    await page.selectOption('select[name="jenjang"]', 'D3')
    await page.click('button:has-text("Tambah Prodi")')

    // Verify success
    await expect(page.locator('text=Prodi berhasil ditambahkan')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Manajemen Informatika')).toBeVisible()
  })

  test('TC5: ADMIN can update prodi', async ({ page }) => {
    await page.click('text=Program Studi')
    await page.waitForURL('/dashboard/prodi')

    // Click edit on first prodi
    await page.click('button:has-text("Edit")').first()

    // Wait for edit mode
    await page.waitForSelector('button:has-text("Simpan")')

    // Update fields
    await page.fill('input[value="Teknik Informatika"]', 'Teknik Informatika Updated')
    await page.selectOption('select[name="jenjang"]', 'S2')

    // Save changes
    await page.click('button:has-text("Simpan")')

    // Verify update
    await page.waitForTimeout(1000) // Wait for refresh
    await expect(page.locator('text=Teknik Informatika Updated')).toBeVisible()
    await expect(page.locator('text=S2')).toBeVisible()
  })

  test('TC6: ADMIN can cancel edit', async ({ page }) => {
    await page.click('text=Program Studi')
    await page.waitForURL('/dashboard/prodi')

    // Click edit
    await page.click('button:has-text("Edit")').first()
    await page.waitForSelector('button:has-text("Batal")')

    // Click cancel
    await page.click('button:has-text("Batal")')

    // Verify back to view mode
    await expect(page.locator('button:has-text("Edit")').first()).toBeVisible()
  })

  test('TC7: ADMIN can change prodi status', async ({ page }) => {
    await page.click('text=Program Studi')
    await page.waitForURL('/dashboard/prodi')

    // Click edit
    await page.click('button:has-text("Edit")').first()
    await page.waitForSelector('select[name="status"]')

    // Change status to Inactive
    await page.selectOption('select[name="status"]', 'false')
    await page.click('button:has-text("Simpan")')

    // Verify status badge changed
    await page.waitForTimeout(1000)
    await expect(page.locator('text=Inactive').first()).toBeVisible()
  })

  test('TC8: ADMIN can delete prodi (soft delete)', async ({ page }) => {
    await page.click('text=Program Studi')
    await page.waitForURL('/dashboard/prodi')

    // Get prodi name before delete
    const prodiName = await page.locator('h3').first().textContent()

    // Setup dialog handler
    page.on('dialog', dialog => dialog.accept())

    // Click delete
    await page.click('button:has-text("Hapus")').first()

    // Wait for refresh
    await page.waitForTimeout(1000)

    // Verify prodi removed from list
    if (prodiName) {
      await expect(page.locator(`text=${prodiName}`)).not.toBeVisible()
    }
  })

  test('TC9: Form validation works', async ({ page }) => {
    await page.click('text=Program Studi')
    await page.waitForURL('/dashboard/prodi')

    // Try to submit empty form
    await page.click('button:has-text("Tambah Prodi")')

    // Verify HTML5 validation (required fields)
    const namaInput = page.locator('input[name="nama"]')
    const isInvalid = await namaInput.evaluate((el: HTMLInputElement) => !el.validity.valid)
    expect(isInvalid).toBe(true)
  })
})

test.describe('Prodi Management - Access Control', () => {
  test('TC10: KARYAWAN cannot access prodi page', async ({ page }) => {
    await login(page, KARYAWAN.email, KARYAWAN.password)

    // Verify menu not visible
    await expect(page.locator('text=Program Studi')).not.toBeVisible()

    // Try to access directly
    await page.goto('/dashboard/prodi')

    // Should redirect to dashboard
    await page.waitForURL('/dashboard')
  })

  test('TC11: Menu visibility based on role', async ({ page }) => {
    // Test ADMIN
    await login(page, ADMIN.email, ADMIN.password)
    await expect(page.locator('text=Program Studi')).toBeVisible()

    // Logout
    await page.click('button:has-text("Logout")')
    await page.waitForURL('/login')

    // Test KARYAWAN
    await login(page, KARYAWAN.email, KARYAWAN.password)
    await expect(page.locator('text=Program Studi')).not.toBeVisible()
  })
})

test.describe('Prodi Management - Data Integrity', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN.email, ADMIN.password)
  })

  test('TC12: Timestamps are auto-generated', async ({ page }) => {
    await page.click('text=Program Studi')
    await page.waitForURL('/dashboard/prodi')

    // Create prodi
    await page.fill('input[name="nama"]', 'Test Timestamp Prodi')
    await page.selectOption('select[name="jenjang"]', 'S1')
    await page.click('button:has-text("Tambah Prodi")')

    await page.waitForTimeout(1000)

    // Verify timestamp displayed
    await expect(page.locator('text=Dibuat:')).toBeVisible()
  })

  test('TC13: UpdatedAt changes on update', async ({ page }) => {
    await page.click('text=Program Studi')
    await page.waitForURL('/dashboard/prodi')

    // Edit prodi
    await page.click('button:has-text("Edit")').first()
    await page.waitForSelector('button:has-text("Simpan")')
    
    await page.fill('input[name="nama"]', 'Updated Name for Timestamp Test')
    await page.click('button:has-text("Simpan")')

    await page.waitForTimeout(1000)

    // Verify "Diupdate" appears
    await expect(page.locator('text=Diupdate:')).toBeVisible()
  })
})
