'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

type Profile = {
  id: string
  fotoProfil: string | null
} | null

export default function ProfileForm({ 
  profile, 
  userEmail 
}: { 
  profile: Profile
  userEmail: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [previewImage, setPreviewImage] = useState(profile?.fotoProfil || '')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setError('Tipe file tidak valid. Hanya JPEG, PNG, WebP, dan GIF yang diperbolehkan.')
      return
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran file melebihi 2MB.')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('Foto berhasil diupload!')
        setPreviewImage(result.url)
        router.refresh()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Terjadi kesalahan saat upload foto.')
    }

    setUploading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto profil?')) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fotoProfil: null }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('Foto profil berhasil dihapus!')
        setPreviewImage('')
        router.refresh()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Terjadi kesalahan saat menghapus foto.')
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md">
              {success}
            </div>
          )}

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">Email</label>
            <Input value={userEmail} disabled className="bg-gray-50" />
          </div>

          {/* Foto Profil Preview - Centered */}
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="relative">
              {previewImage ? (
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                  <Image
                    src={previewImage}
                    alt="Profile"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-4 border-gray-200 shadow-lg">
                  <span className="text-6xl font-bold text-white">
                    {userEmail.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{userEmail}</p>
              <p className="text-sm text-gray-500">Foto Profil</p>
            </div>
          </div>

          {/* Upload File */}
          <div className="space-y-2">
            <label htmlFor="fileUpload" className="text-sm font-medium">
              Upload Foto Profil
            </label>
            <Input
              id="fileUpload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileUpload}
              disabled={uploading}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500">
              Format: JPEG, PNG, WebP, GIF. Maksimal 2MB.
            </p>
            {uploading && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Uploading...</span>
              </div>
            )}
          </div>

          {/* Delete Button */}
          {profile?.fotoProfil && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={loading || uploading}
              className="w-full"
            >
              {loading ? 'Menghapus...' : 'Hapus Foto Profil'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
