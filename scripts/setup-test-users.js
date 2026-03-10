/**
 * Setup Test Users Script
 * 
 * Creates test users for manual testing:
 * - admin@test.com (ADMIN)
 * - karyawan@test.com (KARYAWAN)
 * 
 * Usage: node setup-test-users.js
 * 
 * Note: This only creates users in database.
 * For full E2E testing, use manual testing guide.
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function createTestUser(email, password, role) {
  try {
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      log(`⚠️  User ${email} already exists`, 'yellow')
      return existing
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    })

    log(`✅ Created user: ${email} (${role})`, 'green')
    return user
  } catch (error) {
    log(`❌ Failed to create user ${email}: ${error.message}`, 'red')
    throw error
  }
}

async function main() {
  console.clear()
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan')
  log('║          Setup Test Users for E2E Testing                 ║', 'cyan')
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan')

  log('Creating test users...', 'yellow')
  console.log('')

  try {
    // Create admin user
    await createTestUser('admin@test.com', 'admin123', 'ADMIN')

    // Create karyawan user
    await createTestUser('karyawan@test.com', 'karyawan123', 'KARYAWAN')

    console.log('')
    log('═'.repeat(60), 'cyan')
    log('✅ Test users setup complete!', 'green')
    log('═'.repeat(60), 'cyan')
    console.log('')
    log('Test Credentials:', 'yellow')
    log('  Admin:', 'cyan')
    log('    Email: admin@test.com')
    log('    Password: admin123')
    console.log('')
    log('  Karyawan:', 'cyan')
    log('    Email: karyawan@test.com')
    log('    Password: karyawan123')
    console.log('')
    log('You can now test manually in browser:', 'green')
    log('  1. Start server: bun run dev', 'cyan')
    log('  2. Open: http://localhost:3000/login', 'cyan')
    log('  3. Follow: MANUAL_TESTING_GUIDE.md', 'cyan')
    console.log('')
  } catch (error) {
    log('\n❌ Setup failed', 'red')
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
