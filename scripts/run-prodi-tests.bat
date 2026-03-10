@echo off
REM Run Prodi Management Tests Script for Windows

REM Get script directory and project root
set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR%..

echo ╔════════════════════════════════════════════════════════════╗
echo ║     Prodi Management - Playwright E2E Test Suite          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Change to project root
cd /d "%PROJECT_ROOT%"

REM Setup test users
echo [1/2] Setting up test users...
node scripts/setup-test-users.js
if %errorlevel% neq 0 (
    echo ❌ Failed to setup test users
    exit /b 1
)

echo.

REM Run Playwright tests for prodi
echo [2/2] Running Prodi E2E tests...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Playwright will start dev server automatically
call npx playwright test tests/prodi.spec.ts

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
    echo   ✅ ADMIN - Create, read, update, delete prodi
    echo   ✅ Access Control - Role-based access
    echo   ✅ Data Integrity - Timestamps, soft delete
    echo   ✅ Validation - Form validation, duplicate check
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
    echo   3. Run with UI mode: npm run test:ui tests/prodi.spec.ts
    echo   4. Check screenshots in test-results/ folder
)

echo.
exit /b %EXIT_CODE%
