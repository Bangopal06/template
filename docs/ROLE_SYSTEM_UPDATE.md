# Role System Update - ADMIN & USER Only

## Changes Made

Sistem role telah disederhanakan dari 3 role (ADMIN, KARYAWAN, MAHASISWA) menjadi 2 role (ADMIN, USER).

## Updated Files

### 1. Database Schema
- **File**: `prisma/schema.prisma`
- **Change**: Enum Role hanya ADMIN dan USER
- **Default**: ADMIN

### 2. User Management Forms
- **File**: `app/dashboard/users/CreateUserForm.tsx`
- **Change**: Radio buttons hanya USER dan ADMIN
- **Default**: USER

### 3. User List Component
- **File**: `app/dashboard/users/UserList.tsx`
- **Changes**:
  - Edit form hanya USER dan ADMIN
  - Badge colors: ADMIN (red), USER (blue)

### 4. API Endpoints
- **File**: `app/api/users/create/route.ts`
- **Change**: Validation schema `z.enum(['ADMIN', 'USER'])`

- **File**: `app/api/users/update/route.ts`
- **Change**: Validation schema `z.enum(['ADMIN', 'USER'])`

### 5. Auth Actions
- **File**: `app/actions/auth-actions.ts`
- **Change**: Register schema `z.enum(['ADMIN', 'USER'])`
- **Default**: ADMIN

## Role Definitions

### ADMIN
- Full access to all features
- Can manage users (create, edit, delete)
- Can access user management page
- Default role for new registrations

### USER
- Standard user access
- Can access dashboard
- Can manage own profile
- Cannot access user management

## Migration Steps

1. ✅ Update existing data (MAHASISWA & KARYAWAN → USER)
2. ✅ Drop old enum values
3. ✅ Update schema
4. ✅ Update forms
5. ✅ Update API validation
6. ✅ Update auth actions

## Testing Checklist

- [ ] Create new user with USER role
- [ ] Create new user with ADMIN role
- [ ] Edit existing user role
- [ ] Login as USER
- [ ] Login as ADMIN
- [ ] Check user management access (ADMIN only)
- [ ] Check profile access (all users)
- [ ] Verify badge colors in user list

## UI Changes

### Create User Form
```
Role:
○ User (default)
○ Admin
```

### Edit User Form
```
Role:
○ User
○ Admin
```

### User List Badge Colors
- ADMIN: Red badge
- USER: Blue badge

## Access Control

| Feature | ADMIN | USER |
|---------|-------|------|
| Dashboard | ✅ | ✅ |
| Profile | ✅ | ✅ |
| User Management | ✅ | ❌ |
| Create User | ✅ | ❌ |
| Edit User | ✅ | ❌ |
| Delete User | ✅ | ❌ |

## Code Examples

### Create User (ADMIN only)
```typescript
// Default role: USER
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    password: hashedPassword,
    role: 'USER', // or 'ADMIN'
  }
})
```

### Check Role
```typescript
// In middleware or API
if (session.role === 'ADMIN') {
  // Admin-only logic
}
```

### Register (Default ADMIN)
```typescript
// Registration with token
const user = await prisma.user.create({
  data: {
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'ADMIN', // Default
  }
})
```

## Future Considerations

Jika perlu menambah role baru:

1. Update `prisma/schema.prisma` enum Role
2. Run migration SQL untuk update enum
3. Update semua forms (CreateUserForm, UserList)
4. Update API validation schemas
5. Update auth-actions validation
6. Update badge colors
7. Update access control logic
8. Test thoroughly

## Rollback

Jika perlu rollback ke 3 roles:

```sql
-- Add back old roles
ALTER TYPE "Role" RENAME TO "Role_new";
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'KARYAWAN', 'MAHASISWA');
ALTER TABLE users ALTER COLUMN role TYPE "Role" USING role::text::"Role";
DROP TYPE "Role_new";
```

Then revert all code changes.
