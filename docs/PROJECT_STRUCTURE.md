# Project Structure

Dokumentasi lengkap struktur folder dan file dalam template ini.

## Root Directory

```
.
├── app/                    # Next.js App Router
├── components/             # React components
├── lib/                    # Utility functions & configs
├── prisma/                 # Database schema
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── middleware.ts           # Next.js middleware (route protection)
├── next.config.mjs         # Next.js configuration
├── package.json            # Dependencies & scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Main documentation
```

## App Directory (`app/`)

Next.js App Router dengan file-based routing.

```
app/
├── (auth)/                 # Auth route group (no layout)
│   ├── login/
│   │   └── page.tsx        # Login page
│   ├── register/
│   │   └── page.tsx        # Register page
│   └── layout.tsx          # Auth layout (minimal)
│
├── actions/                # Server Actions
│   └── auth-actions.ts     # Login, register, logout actions
│
├── dashboard/              # Protected dashboard routes
│   ├── layout.tsx          # Dashboard layout (navbar, sidebar)
│   └── page.tsx            # Dashboard home page
│
├── globals.css             # Global styles & Tailwind
├── layout.tsx              # Root layout
└── page.tsx                # Landing page (redirects to /login)
```

### Route Groups

- `(auth)`: Routes tanpa dashboard layout (login, register)
- `dashboard`: Protected routes dengan layout lengkap

## Components Directory (`components/`)

Reusable React components.

```
components/
└── ui/                     # shadcn/ui components
    ├── avatar.tsx          # Avatar component
    ├── badge.tsx           # Badge component
    ├── button.tsx          # Button component
    ├── card.tsx            # Card component
    ├── input.tsx           # Input component
    └── scroll-area.tsx     # Scroll area component
```

### Adding New Components

```bash
# Using shadcn/ui CLI
npx shadcn-ui@latest add [component-name]
```

## Lib Directory (`lib/`)

Utility functions dan konfigurasi.

```
lib/
├── prisma.ts               # Prisma Client singleton
├── session.ts              # Session management (JWT)
└── utils.ts                # Utility functions (cn, getInitials)
```

### Key Files

**`prisma.ts`**
- Prisma Client singleton
- Prevents multiple instances in development
- Auto-reconnect on hot reload

**`session.ts`**
- JWT-based session management
- Create, verify, delete sessions
- Uses jose library for JWT
- 7 days expiration

**`utils.ts`**
- `cn()`: Merge Tailwind classes
- `getInitials()`: Get user initials from name

## Prisma Directory (`prisma/`)

Database schema dan migrations.

```
prisma/
└── schema.prisma           # Database schema definition
```

### Schema Overview

```prisma
// User model
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // Hashed with bcryptjs
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Role enum
enum Role {
  ADMIN
  USER
}
```

## Configuration Files

### `middleware.ts`

Next.js middleware untuk route protection.

**Features:**
- Protect `/dashboard/*` routes
- Redirect to `/login` if not authenticated
- Skip middleware for API routes, static files, auth pages

### `next.config.mjs`

Next.js configuration.

**Default settings:**
- React strict mode enabled
- No custom webpack config

### `tailwind.config.ts`

Tailwind CSS configuration.

**Includes:**
- Custom colors from CSS variables
- Border radius utilities
- Animation keyframes
- Dark mode support

### `tsconfig.json`

TypeScript configuration.

**Key settings:**
- Strict mode enabled
- Path aliases: `@/*` → `./`
- Target: ES2017
- Module: ESNext

## Environment Variables

### `.env.example`

Template untuk environment variables.

**Required variables:**
```env
DATABASE_URL          # Supabase connection string (pooled)
DIRECT_URL            # Supabase connection string (direct)
SESSION_SECRET        # JWT secret (min 32 chars)
```

## Documentation Files

```
├── README.md               # Main documentation
├── SETUP.md                # Detailed setup guide
├── QUICKSTART.md           # 5-minute quick start
├── FAQ.md                  # Frequently asked questions
├── CONTRIBUTING.md         # Contribution guidelines
├── CHANGELOG.md            # Version history
├── LICENSE                 # MIT License
└── PROJECT_STRUCTURE.md    # This file
```

## Key Concepts

### Authentication Flow

1. User submits login form
2. `loginAction` validates credentials
3. If valid, `createSession` creates JWT
4. JWT stored in httpOnly cookie
5. Middleware checks session on protected routes
6. If invalid/missing, redirect to login

### Route Protection

```typescript
// middleware.ts
if (pathname.startsWith('/dashboard')) {
  const session = await verifySession()
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

### Database Access

```typescript
// Using Prisma Client
import prisma from '@/lib/prisma'

const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
})
```

### Session Management

```typescript
// Create session
await createSession({
  userId: user.id,
  email: user.email,
  role: user.role
})

// Verify session
const session = await verifySession()

// Delete session
await deleteSession()
```

## Adding New Features

### Add New Page

1. Create folder in `app/dashboard/`
2. Add `page.tsx`:
```typescript
export default function NewPage() {
  return <div>New Page</div>
}
```
3. Access at `/dashboard/new-page`

### Add New Model

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

### Add New API Route

1. Create `app/api/[route]/route.ts`:
```typescript
export async function GET(request: Request) {
  return Response.json({ data: 'Hello' })
}
```
2. Access at `/api/[route]`

## Best Practices

### File Naming

- Components: PascalCase (`Button.tsx`)
- Utilities: camelCase (`utils.ts`)
- Pages: lowercase (`page.tsx`)
- API routes: lowercase (`route.ts`)

### Folder Structure

- Group related files in folders
- Use route groups `()` for layout control
- Keep components modular and reusable

### Code Organization

- Server Actions in `app/actions/`
- Utilities in `lib/`
- Types in same file or `types/`
- Components in `components/`

### Security

- Never commit `.env` to git
- Use environment variables for secrets
- Hash passwords with bcryptjs
- Use httpOnly cookies for sessions
- Validate all user inputs with Zod

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Make changes**: Edit files, auto-reload
3. **Check types**: `npm run build` (includes type check)
4. **View database**: `bunx prisma studio`
5. **Update schema**: Edit `schema.prisma` → `bunx prisma db push`

## Production Deployment

1. **Build**: `npm run build`
2. **Set env vars**: In hosting platform
3. **Deploy**: Push to hosting
4. **Verify**: Test all features

---

**Need more details?**
- Setup: [SETUP.md](./SETUP.md)
- Quick start: [QUICKSTART.md](./QUICKSTART.md)
- FAQ: [FAQ.md](./FAQ.md)
