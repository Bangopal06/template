# Getting Started

Selamat datang di Next.js Dashboard Template! 🎉

Template ini adalah starting point untuk aplikasi web dengan authentication dan dashboard yang sudah terintegrasi dengan Supabase.

## What's Included?

✅ **Authentication System**
- Login & Register pages
- Password hashing dengan bcryptjs
- JWT-based session management
- Role-based access control (ADMIN & USER)

✅ **Protected Dashboard**
- Automatic route protection
- Session verification
- Logout functionality

✅ **Database Integration**
- Supabase PostgreSQL
- Prisma ORM
- Type-safe database queries

✅ **Modern UI**
- Tailwind CSS
- shadcn/ui components
- Responsive design

## Quick Links

📖 **Documentation**
- [README.md](./README.md) - Overview & features
- [QUICKSTART.md](./QUICKSTART.md) - 5-minute setup
- [SETUP.md](./SETUP.md) - Detailed setup guide
- [FAQ.md](./FAQ.md) - Common questions
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Code organization

🛠️ **Development**
- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute
- [CHANGELOG.md](./CHANGELOG.md) - Version history

## Setup in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env dengan Supabase credentials
```

### 3. Setup Database
```bash
bunx prisma generate
bunx prisma db push
npm run dev
```

Buka http://localhost:3000 🚀

## What to Do Next?

### For Beginners
1. Follow [QUICKSTART.md](./QUICKSTART.md) untuk setup cepat
2. Register user pertama
3. Explore dashboard
4. Baca [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) untuk memahami struktur

### For Developers
1. Follow [SETUP.md](./SETUP.md) untuk setup lengkap
2. Customize `app/dashboard/page.tsx`
3. Add models di `prisma/schema.prisma`
4. Build features Anda!

## Common Tasks

### Add New Page
```bash
# Create app/dashboard/settings/page.tsx
mkdir -p app/dashboard/settings
touch app/dashboard/settings/page.tsx
```

### Add Database Model
```prisma
// Edit prisma/schema.prisma
model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```
```bash
bunx prisma db push
```

### View Database
```bash
bunx prisma studio
```

## Need Help?

- 📖 Check [FAQ.md](./FAQ.md)
- 🐛 Found a bug? Create an Issue
- 💡 Have an idea? Create an Issue with "enhancement" label
- 🤝 Want to contribute? Read [CONTRIBUTING.md](./CONTRIBUTING.md)

## Tech Stack

- **Next.js 15** - React framework
- **Prisma 6** - Database ORM
- **Supabase** - PostgreSQL database
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## Project Structure

```
├── app/
│   ├── (auth)/          # Login & Register
│   ├── actions/         # Server Actions
│   └── dashboard/       # Protected pages
├── components/ui/       # UI components
├── lib/                 # Utilities
├── prisma/              # Database schema
└── middleware.ts        # Route protection
```

## Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## Features to Add

Template ini adalah foundation. Anda bisa tambahkan:

- [ ] Email verification
- [ ] Password reset
- [ ] Profile page
- [ ] User management (admin)
- [ ] File upload
- [ ] Real-time features
- [ ] API endpoints
- [ ] Testing
- [ ] CI/CD

## License

MIT License - Feel free to use for personal or commercial projects!

---

**Ready to build?** Start with [QUICKSTART.md](./QUICKSTART.md) 🚀
