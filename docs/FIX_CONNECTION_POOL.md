# Fix Prisma Connection Pool Timeout

## Error
```
Timed out fetching a new connection from the connection pool.
(Current connection pool timeout: 10, connection limit: 5)
```

## Penyebab

1. **Hot reload di development** membuat instance Prisma baru terus-menerus
2. **Connection pool limit** di Supabase (default 5 connections)
3. **Koneksi tidak di-close** dengan benar saat hot reload

## Solusi

### 1. Update DATABASE_URL (Recommended)

Tambahkan parameter connection pool di `.env`:

```env
# OLD (tanpa pooling parameters)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# NEW (dengan pooling parameters)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5&pool_timeout=10"
```

### 2. Restart Dev Server

```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### 3. Clear Connections (Jika masih error)

**Option A: Via Supabase Dashboard**
1. Buka Supabase Dashboard
2. Klik **Database** > **Connection Pooling**
3. Klik **Reset connections**

**Option B: Via SQL**
```sql
-- Terminate all connections
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'postgres' 
  AND pid <> pg_backend_pid();
```

### 4. Increase Connection Limit (Optional)

Jika masih sering timeout, tingkatkan limit:

```env
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=10&pool_timeout=20"
```

## Penjelasan Parameter

### `connection_limit`
- **Default**: 5
- **Recommended**: 5-10 untuk development
- **Max**: Tergantung Supabase plan
- Jumlah maksimal koneksi simultan

### `pool_timeout`
- **Default**: 10 seconds
- **Recommended**: 10-20 seconds
- Waktu tunggu untuk mendapat koneksi dari pool

### `pgbouncer=true`
- Menggunakan connection pooler Supabase
- **Wajib** untuk production
- Mengurangi overhead koneksi

## Best Practices

### Development
```env
# Gunakan pooled connection (port 6543)
DATABASE_URL="postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5"

# Direct connection untuk migrations (port 5432)
DIRECT_URL="postgresql://...supabase.com:5432/postgres"
```

### Production
```env
# Increase limits untuk production
DATABASE_URL="postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=20&pool_timeout=20"
```

## Troubleshooting

### Error masih muncul setelah restart

1. **Check active connections**:
```sql
SELECT count(*) FROM pg_stat_activity WHERE datname = 'postgres';
```

2. **Kill zombie connections**:
```sql
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' 
  AND state_change < current_timestamp - INTERVAL '5 minutes';
```

3. **Restart Supabase project** (last resort):
   - Supabase Dashboard > Settings > General
   - Pause project → Resume project

### Hot reload terus membuat koneksi baru

- **Normal behavior** di Next.js development
- Prisma singleton sudah handle ini
- Koneksi akan di-reuse, bukan dibuat baru

### Connection limit tercapai

Cek berapa koneksi aktif:
```sql
SELECT 
  datname,
  count(*) as connections,
  max(state) as state
FROM pg_stat_activity 
GROUP BY datname;
```

Jika > 5 connections, ada memory leak atau koneksi tidak di-close.

## Alternative: Supabase Direct Connection

Jika pooling bermasalah, gunakan direct connection (tidak recommended untuk production):

```env
# Direct connection (port 5432)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].supabase.com:5432/postgres"
```

⚠️ **Warning**: Direct connection tidak scalable untuk production!

## Monitoring

### Check connection usage
```sql
SELECT 
  count(*) as total_connections,
  count(*) FILTER (WHERE state = 'active') as active,
  count(*) FILTER (WHERE state = 'idle') as idle
FROM pg_stat_activity 
WHERE datname = 'postgres';
```

### Check slow queries
```sql
SELECT 
  pid,
  now() - query_start as duration,
  state,
  query
FROM pg_stat_activity
WHERE state != 'idle'
  AND now() - query_start > interval '5 seconds'
ORDER BY duration DESC;
```

## Prevention

1. ✅ **Use Prisma singleton** (sudah implemented)
2. ✅ **Use connection pooling** (pgbouncer)
3. ✅ **Set proper timeouts**
4. ✅ **Graceful shutdown** (disconnect on exit)
5. ⚠️ **Don't create multiple Prisma instances**
6. ⚠️ **Close connections in API routes** (optional)

## Summary

**Quick Fix:**
```bash
# 1. Update .env
DATABASE_URL="...?pgbouncer=true&connection_limit=5&pool_timeout=10"

# 2. Restart
npm run dev
```

**If still error:**
```sql
-- Reset connections in Supabase SQL Editor
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'postgres' AND pid <> pg_backend_pid();
```

## Resources

- [Prisma Connection Pool](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-pool)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [PgBouncer](https://www.pgbouncer.org/)
