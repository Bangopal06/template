@echo off
REM Fix Prisma Client Script for Windows

echo ╔════════════════════════════════════════════════════════════╗
echo ║              Fix Prisma Client Issues                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo ⚠️  IMPORTANT: Make sure dev server is STOPPED (Ctrl+C)
echo.
timeout /t 3

echo [1/5] Cleaning Prisma cache...
rmdir /s /q node_modules\.prisma 2>nul
rmdir /s /q node_modules\@prisma 2>nul
echo ✅ Cache cleaned

echo.

echo [2/5] Reinstalling Prisma Client...
call bun install @prisma/client
if %errorlevel% neq 0 (
    echo ❌ Failed to install Prisma Client
    exit /b 1
)
echo ✅ Prisma Client installed

echo.

echo [3/5] Regenerating Prisma Client...
call bunx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma Client
    exit /b 1
)
echo ✅ Prisma Client generated

echo.

echo [4/5] Validating schema...
call bunx prisma validate
if %errorlevel% neq 0 (
    echo ❌ Schema validation failed
    exit /b 1
)
echo ✅ Schema valid

echo.

echo [5/5] Verifying Prodi model...
findstr /C:"model Prodi" node_modules\.prisma\client\schema.prisma >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Prodi model found in Prisma Client
) else (
    echo ❌ Prodi model NOT found in Prisma Client
    echo ⚠️  This is a problem! Check prisma/schema.prisma
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              ✅ Prisma Client Fixed!                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 CRITICAL Next Steps:
echo   1. Restart TypeScript Server in VS Code:
echo      - Press Ctrl+Shift+P
echo      - Type: "TypeScript: Restart TS Server"
echo      - Press Enter
echo.
echo   2. Start dev server:
echo      bun run dev
echo.
echo   3. Wait for server to start completely
echo.
echo   4. Access: http://localhost:3000/dashboard/prodi
echo.
echo ⚠️  If still not working, see FIX_PRODI_ERROR.md
echo.
