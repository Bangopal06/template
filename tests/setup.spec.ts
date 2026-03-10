import { test } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

test.describe.configure({ mode: 'serial' })

test.describe('Setup Test Data', () => {
  test('Create test users', async () => {
    // Create KARYAWAN user
    const karyawanExists = await prisma.user.findUnique({
      where: { email: 'karyawan@test.com' },
    })

    if (!karyawanExists) {
      await prisma.user.create({
        data: {
          email: 'karyawan@test.com',
          password: await bcrypt.hash('karyawan123', 12),
          role: 'KARYAWAN',
        },
      })
      console.log('✅ Created karyawan@test.com')
    } else {
      console.log('⚠️  karyawan@test.com already exists')
    }

    // Create ADMIN user
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@test.com' },
    })

    if (!adminExists) {
      await prisma.user.create({
        data: {
          email: 'admin@test.com',
          password: await bcrypt.hash('admin123', 12),
          role: 'ADMIN',
        },
      })
      console.log('✅ Created admin@test.com')
    } else {
      console.log('⚠️  admin@test.com already exists')
    }
  })

  test('Clean up existing profiles', async () => {
    // Delete existing profiles for clean test
    const karyawan = await prisma.user.findUnique({
      where: { email: 'karyawan@test.com' },
    })

    const admin = await prisma.user.findUnique({
      where: { email: 'admin@test.com' },
    })

    if (karyawan) {
      await prisma.profile.deleteMany({
        where: { userId: karyawan.id },
      })
      console.log('✅ Cleaned karyawan profile')
    }

    if (admin) {
      await prisma.profile.deleteMany({
        where: { userId: admin.id },
      })
      console.log('✅ Cleaned admin profile')
    }
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })
})
