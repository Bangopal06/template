# Quick Start - 5 Menit Setup

Panduan super cepat untuk running template ini.

## Prerequisites

- Node.js 18+ atau Bun
- Account Supabase (gratis di https://supabase.com)

## Steps

### 1. Clone & Install (1 menit)

```bash
git clone <your-repo>
cd <project-name>
npm install
```

### 2. Setup Supabase (2 menit)

1. Buka https://supabase.com → Create new project
2. Tunggu database ready
3. Buka **Project Settings** > **Database**
4. Copy **Connection String** (mode: Session)

### 3. Setup Environment (1 menit)

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
SESSION_SECRET="$(openssl rand -base64 32)"
```

### 4. Setup Database (1 menit)

```bash
bunx prisma generate
bunx prisma db push
```

### 5. Run! (30 detik)

```bash
npm run dev
```

Buka http://localhost:3000

## Test

1. Klik **Register**
2. Isi email & password
3. Login
4. Lihat dashboard ✅

## Done! 🎉

Sekarang customize sesuai kebutuhan Anda.

**Next:**
- Edit `app/dashboard/page.tsx` untuk dashboard Anda
- Tambah model di `prisma/schema.prisma`
- Tambah pages di `app/dashboard/`

**Need Help?**
Lihat [SETUP.md](./SETUP.md) untuk panduan lengkap.
