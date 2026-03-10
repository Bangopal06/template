import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { deleteAvatar, getFileNameFromUrl } from '@/lib/supabase'

export async function PUT(request: Request) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Only accept null (for delete operation)
    if (body.fotoProfil !== null) {
      return NextResponse.json(
        { success: false, message: 'Invalid operation. Use upload endpoint for new photos.' },
        { status: 400 }
      )
    }

    // Check if profile exists
    let profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
    })

    // Delete old file from storage
    if (profile?.fotoProfil) {
      console.log('Deleting photo:', profile.fotoProfil)
      const oldFileName = getFileNameFromUrl(profile.fotoProfil)
      console.log('Extracted filename:', oldFileName)
      
      if (oldFileName) {
        const deleteResult = await deleteAvatar(oldFileName)
        console.log('Delete result:', deleteResult)
      }
    }

    if (profile) {
      // Update existing profile - set to null
      profile = await prisma.profile.update({
        where: { userId: session.userId },
        data: {
          fotoProfil: null,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Foto profil berhasil dihapus',
      profile,
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
