import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import CreateUserForm from './CreateUserForm'
import UserList from './UserList'

export default async function UsersPage() {
  const session = await verifySession()

  // Only ADMIN can access this page
  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create User Form */}
          <div>
            <CreateUserForm />
          </div>

          {/* User List */}
          <div>
            <UserList users={users} />
          </div>
        </div>
      </div>
    </div>
  )
}
