# Setup Guide - Dashboard Template

Panduan lengkap setup dari awal sampai running.

## Prerequisites

- Node.js 18+ atau Bun
- Account Supabase (gratis)
- Git

## Step-by-Step Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd <project-name>
```

### 2. Install Dependencies

```bash
npm install
# atau
bun install
```

### 3. Setup Supabase Database

#### 3.1 Create Supabase Project

1. Buka https://supabase.com
2. Sign in / Sign up
3. Klik **New Project**
4. Isi:
   - **Name**: Nama project Anda
   - **Database Password**: Buat password yang kuat (SIMPAN INI!)
   - **Region**: Pilih yang terdekat (misal: Southeast Asia)
5. Klik **Create new project**
6. Tunggu ~2 menit sampai database ready

#### 3.2 Get Database Connection String

1. Buka project Anda di Supabase
2. Klik **Project Settings** (icon gear di sidebar kiri bawah)
3. Klik **Database** di sidebar
4. Scroll ke **Connection string**
5. Pilih mode **Session** (bukan Transaction)
6. Copy connection string
7. Replace `[YOUR-PASSWORD]` dengan password database Anda

Format connection string:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### 4. Setup Environment Variables

#### 4.1 Create .env File

```bash
cp .env.example .env
```

#### 4.2 Edit .env

Buka `.env` dan isi:

```env
# Database
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Session Secret
SESSION_SECRET="your-generated-secret-here"
```

**Penting:**
- `DATABASE_URL`: Port **6543** dengan `?pgbouncer=true`
- `DIRECT_URL`: Port **5432** tanpa query params
- Ganti `[PROJECT-REF]`, `[PASSWORD]`, dan `[REGION]` dengan nilai Anda

#### 4.3 Generate Session Secret

```bash
openssl rand -base64 32
```

Copy output dan paste ke `SESSION_SECRET` di `.env`

### 5. Setup Database Schema

#### 5.1 Generate Prisma Client

```bash
bunx prisma generate
# atau
npm run db:generate
```

#### 5.2 Push Schema ke Database

```bash
bunx prisma db push
# atau
npm run db:push
```

Output yang diharapkan:
```
✔ Generated Prisma Client
🚀 Your database is now in sync with your Prisma schema.
```

#### 5.3 Verify Database (Optional)

```bash
bunx prisma studio
# atau
npm run db:studio
```

Buka http://localhost:5555 untuk melihat database Anda.

### 6. Run Development Server

```bash
npm run dev
# atau
bun dev
```

Output:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

### 7. Test Application

#### 7.1 Register User

1. Buka http://localhost:3000/register
2. Isi form:
   - Email: `admin@example.com`
   - Password: `admin123`
   - Role: **Admin**
3. Klik **Register**
4. Akan redirect ke login page

#### 7.2 Login

1. Buka http://localhost:3000/login
2. Login dengan credentials tadi
3. Akan redirect ke http://localhost:3000/dashboard

#### 7.3 Check Dashboard

- Lihat informasi user Anda
- Coba logout
- Coba akses `/dashboard` tanpa login (akan redirect ke `/login`)

## Verification Checklist

- [ ] Dependencies installed
- [ ] Supabase project created
- [ ] `.env` file created and filled
- [ ] `SESSION_SECRET` generated
- [ ] `bunx prisma generate` success
- [ ] `bunx prisma db push` success
- [ ] Dev server running
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard accessible
- [ ] Logout working
- [ ] Protected routes working

## Common Issues

### Issue: "Can't reach database server"

**Solution:**
- Cek `DATABASE_URL` dan `DIRECT_URL` benar
- Cek Supabase project masih aktif
- Cek password tidak ada typo

### Issue: "Prisma Client not generated"

**Solution:**
```bash
bunx prisma generate
```

### Issue: "Invalid session secret"

**Solution:**
- Pastikan `SESSION_SECRET` ada di `.env`
- Minimal 32 karakter
- Generate ulang dengan `openssl rand -base64 32`

### Issue: "Module not found"

**Solution:**
```bash
rm -rf node_modules
npm install
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process di port 3000
npx kill-port 3000

# Atau run di port lain
npm run dev -- -p 3001
```

## Next Steps

Setelah setup berhasil:

1. **Customize UI**: Edit components di `app/` dan `components/`
2. **Add Features**: Tambah pages baru di `app/dashboard/`
3. **Extend Schema**: Edit `prisma/schema.prisma` dan run `bunx prisma db push`
4. **Deploy**: Push ke GitHub dan deploy ke Vercel

## Database Management

### View Database

```bash
bunx prisma studio
```

### Reset Database

```bash
bunx prisma db push --force-reset
```

**Warning:** Ini akan menghapus semua data!

### Backup Database

Di Supabase Dashboard:
1. Project Settings > Database
2. Scroll ke **Database Backups**
3. Klik **Download** untuk backup

## Development Tips

### Hot Reload

Next.js akan auto-reload saat Anda edit file. Tidak perlu restart server.

### Check Logs

- Server logs: Terminal tempat `npm run dev` running
- Browser logs: Browser DevTools Console (F12)

### Database Changes

Setiap kali edit `prisma/schema.prisma`:
```bash
bunx prisma db push
```

## Production Deployment

Lihat [README.md](./README.md) section Deployment untuk panduan deploy ke Vercel atau platform lain.

---

**Selamat! Template Anda sudah ready.** 🎉

Mulai build fitur Anda sekarang!
