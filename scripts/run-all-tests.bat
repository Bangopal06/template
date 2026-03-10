@echo off
REM Run All Tests Script for Windows
REM This script will setup and run all Playwright E2E tests

echo ╔════════════════════════════════════════════════════════════╗
echo ║     Profile Management - Playwright E2E Test Suite        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo.

REM Setup test users
echo [1/2] Setting up test users...
node scripts/setup-test-users.js
if %errorlevel% neq 0 (
    echo ❌ Failed to setup test users
    exit /b 1
)

echo.

REM Run Playwright tests
echo [2/2] Running Playwright E2E tests...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Playwright will start dev server automatically
call npx playwright test

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
