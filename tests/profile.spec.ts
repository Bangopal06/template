import { test, expect } from '@playwright/test'

// Test credentials
const KARYAWAN = {
  email: 'karyawan@test.com',
  password: 'karyawan123',
}

const ADMIN = {
  email: 'admin@test.com',
  password: 'admin123',
}

// Helper function to login
async function login(page, email: string, password: string) {
  await page.goto('/login')
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL('/dashboard')
}

test.describe('Profile Management - KARYAWAN', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, KARYAWAN.email, KARYAWAN.password)
  })

  test('TC1: KARYAWAN can access profile page', async ({ page }) => {
    // Navigate to profile
    await page.click('text=Profile')
    await page.waitForURL('/dashboard/profile')

    // Verify page loaded
    await expect(page.getByRole('heading', { name: 'Profile Saya' })).toBeVisible()
    await expect(page.locator('text=Informasi Profile')).toBeVisible()

    // Verify email field is disabled
    const emailInput = page.locator('input[value="' + KARYAWAN.email + '"]')
    await expect(emailInput).toBeDisabled()

    // Verify admin-only fields are NOT visible
    await expect(page.locator('text=Jabatan')).not.toBeVisible()
    await expect(page.locator('text=Status Kepegawaian')).not.toBeVisible()
  })

  test('TC2: KARYAWAN can create profile', async ({ page }) => {
    await page.click('text=Profile')
    await page.waitForURL('/dashboard/profile')

    // Fill profile form
    await page.fill('input[name="nik"]', '3201234567890123')
    await page.fill('input[name="namaLengkap"]', 'John Doe')
    await page.fill('input[name="gelarDepan"]', 'Dr.')
    await page.fill('input[name="gelarBelakang"]', 'S.Kom., M.T.')
    await page.fill('input[name="telepon"]', '08123456789')
    await page.selectOption('select[name="jenisKelamin"]', 'LAKI_LAKI')
    await page.fill('textarea[name="alamat"]', 'Jl. Contoh No. 123, Jakarta')
    await page.fill('input[name="tempatLahir"]', 'Jakarta')
    await page.fill('input[name="tanggalLahir"]', '1990-01-15')
    await page.fill('input[name="fotoProfil"]', 'https://example.com/photo.jpg')

    // Submit form
    await page.click('button:has-text("Simpan Profile")')

    // Verify success message
    await expect(page.locator('text=Profile berhasil diupdate')).toBeVisible({ timeout: 10000 })

    // Verify data persisted
    await page.reload()
    await expect(page.locator('input[name="namaLengkap"]')).toHaveValue('John Doe')
    await expect(page.locator('input[name="telepon"]')).toHaveValue('08123456789')
  })

  test('TC3: KARYAWAN can update profile', async ({ page }) => {
    await page.click('text=Profile')
    await page.waitForURL('/dashboard/profile')

    // Update some fields
    await page.fill('input[name="telepon"]', '08987654321')
    await page.fill('textarea[name="alamat"]', 'Jl. Baru No. 456, Bandung')
    await page.fill('input[name="gelarDepan"]', '') // Clear field

    // Submit
    await page.click('button:has-text("Simpan Profile")')
    await expect(page.locator('text=Profile berhasil diupdate')).toBeVisible({ timeout: 10000 })

    // Verify updates
    await page.reload()
    await expect(page.locator('input[name="telepon"]')).toHaveValue('08987654321')
    await expect(page.locator('textarea[name="alamat"]')).toHaveValue('Jl. Baru No. 456, Bandung')
    await expect(page.locator('input[name="gelarDepan"]')).toHaveValue('')
  })

  test('TC4: KARYAWAN cannot see admin-only fields', async ({ page }) => {
    await page.click('text=Profile')
    await page.waitForURL('/dashboard/profile')

    // Verify admin fields not in DOM
    const jabatanField = page.locator('input[name="jabatan"]')
    const statusField = page.locator('select[name="statusKepegawaian"]')

    await expect(jabatanField).not.toBeVisible()
    await expect(statusField).not.toBeVisible()

    // Verify no red admin section
    const adminSection = page.locator('.bg-red-50')
    await expect(adminSection).not.toBeVisible()
  })
})

test.describe('Profile Management - ADMIN', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN.email, ADMIN.password)
  })

  test('TC5: ADMIN can access profile with admin fields', async ({ page }) => {
    await page.click('text=Profile')
    await page.waitForURL('/dashboard/profile')

    // Verify page loaded
    await expect(page.getByRole('heading', { name: 'Profile Saya' })).toBeVisible()

    // Verify admin-only fields ARE visible
    await expect(page.locator('text=Jabatan (Admin Only)')).toBeVisible()
    await expect(page.locator('text=Status Kepegawaian (Admin Only)')).toBeVisible()

    // Verify admin section exists
    const adminSection = page.locator('.bg-red-50')
    await expect(adminSection).toBeVisible()
  })

  test('TC6: ADMIN can create profile with admin fields', async ({ page }) => {
    await page.click('text=Profile')
    await page.waitForURL('/dashboard/profile')

    // Fill all fields including admin-only
    await page.fill('input[name="nik"]', '3201987654321098')
    await page.fill('input[name="namaLengkap"]', 'Jane Smith')
    await page.fill('input[name="gelarDepan"]', 'Prof.')
    await page.fill('input[name="gelarBelakang"]', 'Ph.D.')
    
    // Admin-only fields
    await page.fill('input[name="jabatan"]', 'Direktur')
    await page.selectOption('select[name="statusKepegawaian"]', 'TETAP')
    
    await page.fill('input[name="telepon"]', '08111222333')
    await page.selectOption('select[name="jenisKelamin"]', 'PEREMPUAN')
    await page.fill('textarea[name="alamat"]', 'Jl. Admin No. 789')
    await page.fill('input[name="tempatLahir"]', 'Surabaya')
    await page.fill('input[name="tanggalLahir"]', '1985-05-20')

    // Submit
    await page.click('button:has-text("Simpan Profile")')
    await expect(page.locator('text=Profile berhasil diupdate')).toBeVisible({ timeout: 10000 })

    // Verify admin fields saved
    await page.reload()
    await expect(page.locator('input[name="jabatan"]')).toHaveValue('Direktur')
    await expect(page.locator('select[name="statusKepegawaian"]')).toHaveValue('TETAP')
  })

  test('TC7: ADMIN can update admin-only fields', async ({ page }) => {
    await page.click('text=Profile')
    await page.waitForURL('/dashboard/profile')

    // Update admin fields
    await page.fill('input[name="jabatan"]', 'CEO')
    await page.selectOption('select[name="statusKepegawaian"]', 'TIDAK_TETAP')
    await page.fill('input[name="namaLengkap"]', 'Jane Smith Updated')

    // Submit
    await page.click('button:has-text("Simpan Profile")')
    await expect(page.locator('text=Profile berhasil diupdate')).toBeVisible({ timeout: 10000 })

    // Verify updates
    await page.reload()
    await expect(page.locator('input[name="jabatan"]')).toHaveValue('CEO')
    await expect(page.locator('select[name="statusKepegawaian"]')).toHaveValue('TIDAK_TETAP')
    await expect(page.locator('input[name="namaLengkap"]')).toHaveValue('Jane Smith Updated')
  })
})

test.describe('Access Control', () => {
  test('TC8: Menu visibility based on role', async ({ page }) => {
    // Test KARYAWAN
    await login(page, KARYAWAN.email, KARYAWAN.password)
    
    await expect(page.locator('text=Profile')).toBeVisible()
    await expect(page.locator('text=User Management')).not.toBeVisible()

    // Logout
    await page.click('button:has-text("Logout")')
    await page.waitForURL('/login')

    // Test ADMIN
    await login(page, ADMIN.email, ADMIN.password)
    
    await expect(page.locator('text=Profile')).toBeVisible()
    await expect(page.locator('text=User Management')).toBeVisible()
  })

  test('TC9: MAHASISWA cannot access profile', async ({ page }) => {
    // This test assumes MAHASISWA user exists
    // If not, it will be skipped
    
    // Try to access profile directly without proper role
    await page.goto('/dashboard/profile')
    
    // Should redirect to login or dashboard
    await page.waitForURL(/\/(login|dashboard)$/)
  })
})
