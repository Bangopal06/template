# Frequently Asked Questions (FAQ)

## Setup & Installation

### Q: Apakah saya harus pakai Supabase?
A: Ya, template ini dirancang untuk Supabase PostgreSQL. Tapi Anda bisa ganti ke PostgreSQL provider lain dengan mengubah `DATABASE_URL` di `.env`.

### Q: Bisa pakai MySQL atau MongoDB?
A: Tidak langsung. Template ini menggunakan PostgreSQL. Untuk database lain, Anda perlu ubah `datasource` di `prisma/schema.prisma` dan sesuaikan konfigurasi.

### Q: Kenapa perlu `DATABASE_URL` dan `DIRECT_URL`?
A: 
- `DATABASE_URL` (port 6543): Untuk connection pooling via PgBouncer
- `DIRECT_URL` (port 5432): Untuk migrations dan operations yang butuh direct connection

### Q: Bagaimana cara generate `SESSION_SECRET`?
A: Jalankan command ini:
```bash
openssl rand -base64 32
```
Copy output dan paste ke `.env`

## Authentication

### Q: Bagaimana cara menambah field ke User?
A: 
1. Edit `prisma/schema.prisma`:
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?  // Tambah field baru
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
2. Run: `bunx prisma db push`
3. Update form register di `app/(auth)/register/page.tsx`

### Q: Bagaimana cara menambah role baru?
A:
1. Edit `prisma/schema.prisma`:
```prisma
enum Role {
  ADMIN
  USER
  MODERATOR  // Tambah role baru
}
```
2. Run: `bunx prisma db push`
3. Update validation di `app/actions/auth-actions.ts`

### Q: Session berapa lama expire?
A: Default 7 hari. Ubah di `lib/session.ts`:
```typescript
const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
```

### Q: Bagaimana cara logout otomatis setelah X waktu?
A: Edit `lib/session.ts` dan ubah `.setExpirationTime('7d')` ke waktu yang Anda inginkan (misal: `'1h'` untuk 1 jam).

## Database

### Q: Bagaimana cara melihat data di database?
A: Jalankan:
```bash
bunx prisma studio
```
Buka http://localhost:5555

### Q: Bagaimana cara reset database?
A: 
```bash
bunx prisma db push --force-reset
```
**Warning:** Ini akan menghapus semua data!

### Q: Bagaimana cara backup database?
A: Di Supabase Dashboard:
1. Project Settings > Database
2. Scroll ke "Database Backups"
3. Klik "Download"

### Q: Bagaimana cara menambah model/table baru?
A:
1. Edit `prisma/schema.prisma`:
```prisma
model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```
2. Run: `bunx prisma db push`

## Development

### Q: Port 3000 sudah dipakai, bagaimana?
A:
```bash
npm run dev -- -p 3001
```

### Q: Hot reload tidak jalan?
A: Restart dev server:
```bash
# Ctrl+C untuk stop
npm run dev
```

### Q: Error "Prisma Client not generated"?
A:
```bash
bunx prisma generate
```

### Q: Error "Can't reach database server"?
A: Cek:
1. `DATABASE_URL` dan `DIRECT_URL` benar
2. Supabase project masih aktif
3. Password tidak ada typo
4. Internet connection stabil

## Deployment

### Q: Bagaimana cara deploy ke Vercel?
A:
1. Push code ke GitHub
2. Import project di Vercel
3. Set environment variables:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `SESSION_SECRET`
4. Deploy

### Q: Apakah perlu setup khusus untuk production?
A: Pastikan:
- Environment variables sudah diset
- `NODE_ENV=production`
- Database accessible dari hosting
- HTTPS enabled

### Q: Bagaimana cara custom domain?
A: Tergantung hosting provider. Untuk Vercel:
1. Project Settings > Domains
2. Add domain
3. Update DNS records

## Customization

### Q: Bagaimana cara ganti warna/theme?
A: Edit `app/globals.css` di bagian CSS variables:
```css
:root {
  --primary: 222.2 47.4% 11.2%;
  /* Ubah nilai ini */
}
```

### Q: Bagaimana cara ganti font?
A: Edit `app/layout.tsx`:
```typescript
import { YourFont } from 'next/font/google'

const yourFont = YourFont({ subsets: ['latin'] })
```

### Q: Bagaimana cara tambah page baru di dashboard?
A:
1. Buat folder baru di `app/dashboard/`
2. Buat `page.tsx` di folder tersebut
3. Page otomatis protected (perlu login)

### Q: Bagaimana cara tambah API route?
A:
1. Buat folder di `app/api/`
2. Buat `route.ts`:
```typescript
export async function GET(request: Request) {
  return Response.json({ message: 'Hello' })
}
```

## Troubleshooting

### Q: Error "Invalid session secret"?
A: Pastikan `SESSION_SECRET` ada di `.env` dan minimal 32 karakter.

### Q: Error "Module not found"?
A:
```bash
rm -rf node_modules
npm install
```

### Q: Build error di production?
A: Cek:
1. `npm run build` berhasil di local
2. Environment variables sudah diset di hosting
3. Database accessible dari hosting

### Q: Login berhasil tapi redirect ke login lagi?
A: Cek:
1. `SESSION_SECRET` sama di semua environment
2. Cookies enabled di browser
3. HTTPS di production (required untuk secure cookies)

## Security

### Q: Apakah password di-hash?
A: Ya, menggunakan bcryptjs dengan salt rounds 12.

### Q: Apakah session aman?
A: Ya, menggunakan JWT dengan HS256 algorithm dan httpOnly cookies.

### Q: Bagaimana cara enable 2FA?
A: Template ini belum include 2FA. Anda perlu implement sendiri atau gunakan library seperti `otplib`.

### Q: Apakah ada rate limiting?
A: Belum include. Untuk production, consider tambah rate limiting di middleware atau gunakan service seperti Upstash.

## Support

### Q: Dimana saya bisa dapat help?
A: 
1. Baca dokumentasi: README.md, SETUP.md
2. Cek Issues di GitHub
3. Buat Issue baru jika belum ada

### Q: Apakah ada Discord/Slack community?
A: Belum ada. Gunakan GitHub Issues untuk diskusi.

### Q: Bagaimana cara contribute?
A: Lihat [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Tidak menemukan jawaban?**
Buat Issue di GitHub dengan label "question".
