# Troubleshooting Guide

Panduan mengatasi masalah umum dalam development.

---

## 🔧 Prisma Issues

### Error: Cannot read properties of undefined (reading 'findMany')

**Symptoms:**
```
TypeError: Cannot read properties of undefined (reading 'findMany')
at ProdiPage (app\dashboard\prodi\page.tsx:19:37)
```

**Cause:**
- Prisma Client belum ter-regenerate setelah schema changes
- Dev server belum di-restart
- Prisma cache corrupt

**Solution:**

**Option 1: Quick Fix Script (Recommended)**
```bash
# Windows
scripts\fix-prisma.bat

# Linux/Mac
chmod +x scripts/fix-prisma.sh
./scripts/fix-prisma.sh
```

**Option 2: Manual Steps**
```bash
# 1. Stop dev server (Ctrl+C)

# 2. Clean Prisma cache
# Windows
rmdir /s /q node_modules\.prisma

# Linux/Mac
rm -rf node_modules/.prisma

# 3. Regenerate Prisma Client
bunx prisma generate

# 4. Restart dev server
bun run dev
```

**Important:** Always restart dev server after regenerating Prisma Client!

---

### Error: Prisma Client validation failed

**Symptoms:**
```
Invalid `prisma.model.findMany()` invocation
```

**Cause:**
- Schema changes not pushed to database
- Prisma Client out of sync with database

**Solution:**
```bash
# 1. Push schema to database
bunx prisma db push

# 2. Regenerate Prisma Client
bunx prisma generate

# 3. Restart dev server
```

---

### Error: EPERM operation not permitted

**Symptoms:**
```
Error: EPERM: operation not permitted, rename 'query_engine-windows.dll.node.tmp'
```

**Cause:**
- Dev server is running
- File is locked by another process

**Solution:**
```bash
# 1. Stop ALL dev servers (Ctrl+C)
# 2. Close all terminals running dev server
# 3. Wait 5 seconds
# 4. Run fix script
scripts\fix-prisma.bat

# 5. Start dev server
bun run dev
```

---

## 🗄️ Database Issues

### Cannot connect to database

**Symptoms:**
```
Can't reach database server at `aws-1-ap-south-1.pooler.supabase.com:5432`
```

**Cause:**
- Wrong DATABASE_URL in .env
- Supabase project paused/deleted
- Network issues

**Solution:**
```bash
# 1. Check .env file
cat .env

# 2. Verify DATABASE_URL format
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@..."

# 3. Test connection
bunx prisma db pull

# 4. Check Supabase dashboard
# https://supabase.com/dashboard
```

---

### Database schema out of sync

**Symptoms:**
```
Your database is not in sync with your Prisma schema
```

**Solution:**
```bash
# Push schema to database
bunx prisma db push

# Or reset database (WARNING: deletes all data)
bunx prisma migrate reset
```

---

## 🧪 Testing Issues

### Tests fail with "Server not running"

**Cause:**
- Dev server not started
- Port 3000 already in use

**Solution:**
```bash
# Playwright will auto-start server
# Just run tests
npm run test

# If port conflict, kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

### Tests fail with "User not found"

**Cause:**
- Test users not created

**Solution:**
```bash
# Create test users
node scripts/setup-test-users.js

# Or run full test script
scripts\run-all-tests.bat
```

---

### Tests are flaky

**Cause:**
- Race conditions
- Database conflicts
- Network latency

**Solution:**
```bash
# Run with retries
npx playwright test --retries=2

# Run sequentially (already configured)
# workers: 1 in playwright.config.ts

# Increase timeouts
npx playwright test --timeout=60000
```

---

## 🔐 Authentication Issues

### Cannot login

**Symptoms:**
- Login form submits but stays on login page
- No error message

**Cause:**
- Wrong credentials
- Session secret not set
- Database connection issue

**Solution:**
```bash
# 1. Check .env
SESSION_SECRET="your-secret-key-min-32-chars"

# 2. Verify user exists
bunx prisma studio
# Check users table

# 3. Check browser console for errors
# F12 → Console tab

# 4. Check server logs
# Terminal running dev server
```

---

### Session expires immediately

**Cause:**
- SESSION_SECRET not set or too short
- Cookie issues

**Solution:**
```bash
# 1. Generate new SESSION_SECRET
openssl rand -base64 32

# 2. Add to .env
SESSION_SECRET="generated-secret-here"

# 3. Restart dev server
```

---

## 🎨 UI Issues

### Styles not loading

**Cause:**
- Tailwind not compiled
- CSS cache issue

**Solution:**
```bash
# 1. Stop dev server
# 2. Delete .next folder
rm -rf .next

# 3. Restart dev server
bun run dev
```

---

### Components not updating

**Cause:**
- Hot reload not working
- Browser cache

**Solution:**
```bash
# 1. Hard refresh browser
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (Mac)

# 2. Clear browser cache
# F12 → Network tab → Disable cache

# 3. Restart dev server
```

---

## 📦 Build Issues

### Build fails with type errors

**Cause:**
- TypeScript errors
- Missing types

**Solution:**
```bash
# 1. Check TypeScript errors
npm run lint

# 2. Regenerate Prisma types
bunx prisma generate

# 3. Check tsconfig.json
# Verify paths and includes

# 4. Restart TypeScript server
# VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

---

### Build fails with Prisma errors

**Cause:**
- Prisma Client not generated in build

**Solution:**
```bash
# Build script already includes prisma generate
npm run build

# If still fails, manually generate first
bunx prisma generate
npm run build
```

---

## 🚀 Deployment Issues

### Vercel deployment fails

**Cause:**
- Environment variables not set
- Build errors

**Solution:**
```bash
# 1. Set environment variables in Vercel
# Dashboard → Settings → Environment Variables
# - DATABASE_URL
# - DIRECT_URL
# - SESSION_SECRET
# - REGISTRATION_TOKEN

# 2. Check build logs
# Vercel dashboard → Deployments → View logs

# 3. Test build locally
npm run build
```

---

## 🔍 Debug Tips

### Enable Debug Logging

**Prisma:**
```bash
# Add to .env
DEBUG="prisma:*"

# Or specific
DEBUG="prisma:query"
```

**Next.js:**
```bash
# Run with debug
NODE_OPTIONS='--inspect' bun run dev

# Open chrome://inspect in Chrome
```

---

### Check Logs

**Server Logs:**
```bash
# Terminal running dev server
# Look for errors in red
```

**Browser Console:**
```bash
# F12 → Console tab
# Look for errors in red
```

**Network Tab:**
```bash
# F12 → Network tab
# Check API responses
# Look for 4xx or 5xx status codes
```

---

## 📞 Getting Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Check error message carefully
3. ✅ Try fix-prisma script
4. ✅ Restart dev server
5. ✅ Check browser console
6. ✅ Check server logs

### Where to Get Help

1. **Documentation:**
   - [docs/README.md](./README.md) - Documentation index
   - [docs/FAQ.md](./FAQ.md) - Frequently asked questions

2. **GitHub Issues:**
   - Search existing issues
   - Create new issue with:
     - Error message
     - Steps to reproduce
     - Environment (OS, Node version, etc.)

3. **Community:**
   - Stack Overflow
   - Discord/Slack community

---

## 🛠️ Useful Commands

### Quick Fixes
```bash
# Fix Prisma issues
scripts\fix-prisma.bat

# Setup test users
node scripts/setup-test-users.js

# Reset database (WARNING: deletes data)
bunx prisma migrate reset

# Open Prisma Studio
bunx prisma studio
```

### Diagnostics
```bash
# Validate schema
bunx prisma validate

# Check database connection
bunx prisma db pull

# Check Prisma Client version
bunx prisma version

# Check Node version
node --version

# Check Bun version
bun --version
```

### Clean Start
```bash
# 1. Stop all servers
# 2. Clean everything
rm -rf node_modules .next
rm -rf node_modules/.prisma

# 3. Reinstall
bun install

# 4. Setup
bunx prisma generate
bunx prisma db push

# 5. Start
bun run dev
```

---

**Last Updated:** 2024
**Version:** 1.0

Need more help? Check [docs/FAQ.md](./FAQ.md) or create an issue!
