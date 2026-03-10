'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type User = {
  id: string
  email: string
  role: string
  createdAt: Date
}

export default function UserList({ users }: { users: User[] }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editEmail, setEditEmail] = useState('')
  const [editRole, setEditRole] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-700'
      case 'USER':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleEdit = (user: User) => {
    setEditingId(user.id)
    setEditEmail(user.email)
    setEditRole(user.role)
    setEditPassword('')
    setError('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditEmail('')
    setEditRole('')
    setEditPassword('')
    setError('')
  }

  const handleSaveEdit = async (userId: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: editEmail,
          role: editRole,
          password: editPassword || undefined,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setEditingId(null)
        router.refresh()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Terjadi kesalahan saat update user.')
    }

    setLoading(false)
  }

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus user ${email}?`)) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      const result = await response.json()

      if (result.success) {
        router.refresh()
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menghapus user.')
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar User ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Belum ada user
            </p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="p-3 bg-gray-50 rounded-lg space-y-3"
              >
                {editingId === user.id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    {error && (
                      <div className="bg-destructive/10 text-destructive text-xs p-2 rounded">
                        {error}
                      </div>
                    )}
                    
                    <div>
                      <label className="text-xs font-medium">Email</label>
                      <Input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium">
                        Password Baru (kosongkan jika tidak ingin mengubah)
                      </label>
                      <Input
                        type="password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="••••••••"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium">Role</label>
                      <div className="flex gap-2 mt-1">
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input
                            type="radio"
                            value="USER"
                            checked={editRole === 'USER'}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="w-3 h-3"
                          />
                          <span className="text-xs">User</span>
                        </label>
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input
                            type="radio"
                            value="ADMIN"
                            checked={editRole === 'ADMIN'}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="w-3 h-3"
                          />
                          <span className="text-xs">Admin</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(user.id)}
                        disabled={loading}
                        className="flex-1"
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(user)}
                        disabled={loading}
                        className="flex-1 text-xs"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(user.id, user.email)}
                        disabled={loading}
                        className="flex-1 text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
