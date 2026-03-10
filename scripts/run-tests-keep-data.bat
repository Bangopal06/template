@echo off
REM Run Tests and Keep Data Script for Windows
REM This script will run tests WITHOUT cleaning up data

echo ╔════════════════════════════════════════════════════════════╗
echo ║     Profile Management - E2E Tests (Keep Data Mode)       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Setup test users
echo [1/2] Setting up test users...
node scripts/setup-test-users.js
if %errorlevel% neq 0 (
    echo ❌ Failed to setup test users
    exit /b 1
)

echo.

REM Run Playwright tests (skip cleanup)
echo [2/2] Running Playwright E2E tests...
echo.
echo ⚠️  NOTE: Data will be kept after tests for inspection
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Run only profile tests, skip setup cleanup
call npx playwright test tests/profile.spec.ts

REM Capture exit code
set EXIT_CODE=%errorlevel%

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

if %EXIT_CODE% equ 0 (
    echo ╔════════════════════════════════════════════════════════════╗
    echo ║              🎉 ALL TESTS PASSED! 🎉                       ║
    echo ╚════════════════════════════════════════════════════════════╝
    echo.
    echo 📊 Test Coverage:
    echo   ✅ KARYAWAN - Profile access, create, update, security
    echo   ✅ ADMIN - Profile with admin fields
    echo   ✅ Access Control - Role-based menu visibility
    echo.
    echo 💾 Data Status:
    echo   ✅ Test data KEPT in database
    echo   ✅ Check Prisma Studio: bunx prisma studio
    echo   ✅ Login manually to see profiles
    echo.
    echo 📝 View detailed report: npm run test:report
) else (
    echo ╔════════════════════════════════════════════════════════════╗
    echo ║              ⚠️  SOME TESTS FAILED ⚠️                      ║
    echo ╚════════════════════════════════════════════════════════════╝
    echo.
    echo 🔍 Troubleshooting:
    echo   1. Check test output above for errors
    echo   2. View HTML report: npm run test:report
    echo   3. Run with UI mode: npm run test:ui
    echo   4. Check screenshots in test-results/ folder
)

echo.
exit /b %EXIT_CODE%
