# Database Connection Best Practices

Panduan lengkap design patterns dan best practices untuk koneksi database Supabase dengan Prisma.

## Design Patterns Implemented

### 1. Singleton Pattern ✅

**Problem**: Hot reload Next.js membuat instance Prisma baru terus-menerus

**Solution**: Reuse instance yang sama

```typescript
// lib/db.ts
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
```

**Benefits**:
- Satu instance untuk semua requests
- Reuse connection pool
- Tidak ada memory leak

### 2. Graceful Shutdown Pattern ✅

**Problem**: Koneksi tidak di-close saat process exit

**Solution**: Disconnect otomatis

```typescript
const gracefulShutdown = async () => {
  await prisma.$disconnect()
  process.exit(0)
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
```

**Benefits**:
- Clean shutdown
- Tidak ada hanging connections
- Resource cleanup

### 3. Retry Pattern dengan Exponential Backoff ✅

**Problem**: Transient errors (timeout, network issues)

**Solution**: Retry dengan delay yang meningkat

```typescript
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (!isRetryableError(error)) throw error
      
      const delay = baseDelay * Math.pow(2, i) // 1s, 2s, 4s
      await sleep(delay)
    }
  }
}
```

**Usage**:
```typescript
const user = await withRetry(() => 
  prisma.user.findUnique({ where: { email } })
)
```

**Benefits**:
- Handle transient errors
- Tidak langsung fail
- Exponential backoff mencegah overload

### 4. Connection Pool Configuration ✅

**Problem**: Default pool terlalu kecil atau timeout terlalu pendek

**Solution**: Optimize parameters

```env
# Development
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=5&pool_timeout=10"

# Production
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=20&pool_timeout=20"
```

**Parameters**:
- `connection_limit`: Max concurrent connections
- `pool_timeout`: Timeout untuk dapat connection (seconds)
- `pgbouncer=true`: Use Supabase connection pooler

### 5. Health Check Pattern ✅

**Problem**: Tidak tahu status koneksi database

**Solution**: Health check endpoint

```typescript
export async function checkDatabaseHealth() {
  const start = Date.now()
  
  try {
    await prisma.$queryRaw`SELECT 1`
    return { healthy: true, latency: Date.now() - start }
  } catch (error) {
    return { healthy: false, error: error.message }
  }
}
```

**Usage**: Buat API endpoint `/api/health`

### 6. Transaction Pattern dengan Timeout ✅

**Problem**: Long-running transactions block connections

**Solution**: Set timeout untuk transactions

```typescript
export async function withTransaction<T>(
  fn: (tx: PrismaClient) => Promise<T>,
  timeout = 5000
): Promise<T> {
  return prisma.$transaction(fn, {
    maxWait: timeout,
    timeout: timeout,
  })
}
```

**Usage**:
```typescript
await withTransaction(async (tx) => {
  await tx.user.create({ data: userData })
  await tx.profile.create({ data: profileData })
})
```

## Environment Configuration

### Development

```env
# Pooled connection (recommended)
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5&pool_timeout=10"

# Direct connection (migrations only)
DIRECT_URL="postgresql://postgres.[REF]:[PASS]@[REGION].supabase.com:5432/postgres"
```

### Production

```env
# Increase limits untuk production
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=20&pool_timeout=20&connect_timeout=10"

DIRECT_URL="postgresql://postgres.[REF]:[PASS]@[REGION].supabase.com:5432/postgres"
```

## Usage Examples

### Basic Query dengan Retry

```typescript
import prisma, { withRetry } from '@/lib/db'

// Tanpa retry
const user = await prisma.user.findUnique({ 
  where: { email } 
})

// Dengan retry (recommended untuk critical queries)
const user = await withRetry(() =>
  prisma.user.findUnique({ where: { email } })
)
```

### Transaction dengan Timeout

```typescript
import { withTransaction } from '@/lib/db'

await withTransaction(async (tx) => {
  const user = await tx.user.create({ data: userData })
  await tx.profile.create({ 
    data: { ...profileData, userId: user.id } 
  })
}, 5000) // 5 second timeout
```

### Health Check API

```typescript
// app/api/health/route.ts
import { checkDatabaseHealth } from '@/lib/db'

export async function GET() {
  const health = await checkDatabaseHealth()
  
  return Response.json(health, {
    status: health.healthy ? 200 : 503
  })
}
```

## Monitoring & Debugging

### Check Active Connections

```sql
SELECT 
  count(*) as total,
  count(*) FILTER (WHERE state = 'active') as active,
  count(*) FILTER (WHERE state = 'idle') as idle
FROM pg_stat_activity 
WHERE datname = 'postgres';
```

### Kill Idle Connections

```sql
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' 
  AND state_change < current_timestamp - INTERVAL '5 minutes';
```

### Check Slow Queries

```sql
SELECT 
  pid,
  now() - query_start as duration,
  state,
  left(query, 100) as query
FROM pg_stat_activity
WHERE state != 'idle'
  AND now() - query_start > interval '2 seconds'
ORDER BY duration DESC;
```

## Common Pitfalls & Solutions

### ❌ Multiple Prisma Instances

```typescript
// BAD: Creates new instance every time
export function getPrisma() {
  return new PrismaClient()
}

// GOOD: Reuse singleton
import prisma from '@/lib/db'
```

### ❌ Not Closing Connections

```typescript
// BAD: No cleanup
const prisma = new PrismaClient()
// ... use prisma

// GOOD: Graceful shutdown handled automatically
import prisma from '@/lib/db'
// Cleanup handled by shutdown handlers
```

### ❌ Long-Running Queries

```typescript
// BAD: No timeout
await prisma.user.findMany() // Could hang forever

// GOOD: With timeout
await Promise.race([
  prisma.user.findMany(),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), 5000)
  )
])
```

### ❌ Ignoring Connection Errors

```typescript
// BAD: No error handling
const user = await prisma.user.findUnique({ where: { email } })

// GOOD: With retry
const user = await withRetry(() =>
  prisma.user.findUnique({ where: { email } })
)
```

## Performance Tips

### 1. Use Select untuk Limit Fields

```typescript
// BAD: Fetch all fields
const user = await prisma.user.findUnique({ where: { id } })

// GOOD: Only needed fields
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, role: true }
})
```

### 2. Use Indexes

```prisma
model User {
  id    String @id @default(uuid())
  email String @unique // Index otomatis
  
  @@index([createdAt]) // Custom index
}
```

### 3. Batch Operations

```typescript
// BAD: Multiple queries
for (const email of emails) {
  await prisma.user.create({ data: { email } })
}

// GOOD: Single batch query
await prisma.user.createMany({
  data: emails.map(email => ({ email }))
})
```

### 4. Use Connection Pooling

```env
# ALWAYS use pooled connection
DATABASE_URL="...pooler.supabase.com:6543/...?pgbouncer=true"
```

## Migration to New Pattern

### Step 1: Replace Imports

```typescript
// OLD
import prisma from '@/lib/prisma'

// NEW
import prisma from '@/lib/db'
```

### Step 2: Add Retry untuk Critical Queries

```typescript
import prisma, { withRetry } from '@/lib/db'

// Critical queries (login, payment, etc)
const user = await withRetry(() =>
  prisma.user.findUnique({ where: { email } })
)
```

### Step 3: Use Transactions dengan Timeout

```typescript
import { withTransaction } from '@/lib/db'

await withTransaction(async (tx) => {
  // Multiple operations
})
```

### Step 4: Add Health Check

```typescript
// app/api/health/route.ts
import { checkDatabaseHealth } from '@/lib/db'

export async function GET() {
  const health = await checkDatabaseHealth()
  return Response.json(health)
}
```

## Testing

```typescript
// Test health check
const health = await checkDatabaseHealth()
console.log('Database health:', health)

// Test retry
const user = await withRetry(() =>
  prisma.user.findFirst()
)
console.log('User fetched with retry:', user)

// Test transaction
await withTransaction(async (tx) => {
  const count = await tx.user.count()
  console.log('User count in transaction:', count)
})
```

## Summary

✅ **Singleton Pattern** - Reuse Prisma instance
✅ **Graceful Shutdown** - Clean disconnect
✅ **Retry Pattern** - Handle transient errors
✅ **Connection Pooling** - Optimize parameters
✅ **Health Checks** - Monitor database status
✅ **Transaction Timeouts** - Prevent hanging
✅ **Error Handling** - Proper error classification

**Result**: Stable, scalable, production-ready database layer!
