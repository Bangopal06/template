import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { uploadAvatar, deleteAvatar, getFileNameFromUrl } from '@/lib/supabase'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 2MB limit.' },
        { status: 400 }
      )
    }

    // Check if profile exists and has old photo
    let profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
    })

    // Delete old photo from storage if exists
    if (profile?.fotoProfil) {
      console.log('Old photo URL:', profile.fotoProfil)
      const oldFileName = getFileNameFromUrl(profile.fotoProfil)
      console.log('Extracted filename:', oldFileName)
      
      if (oldFileName) {
        const deleteResult = await deleteAvatar(oldFileName)
        console.log('Delete result:', deleteResult)
      }
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${session.userId}-${Date.now()}.${fileExt}`

    console.log('Uploading new file:', fileName)

    // Upload to Supabase Storage (server-side with admin client)
    const uploadResult = await uploadAvatar(buffer, fileName, file.type)

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, message: uploadResult.error },
        { status: 400 }
      )
    }

    console.log('Upload successful, new URL:', uploadResult.url)

    // Update profile with new photo URL
    if (profile) {
      profile = await prisma.profile.update({
        where: { userId: session.userId },
        data: { fotoProfil: uploadResult.url },
      })
    } else {
      profile = await prisma.profile.create({
        data: {
          userId: session.userId,
          fotoProfil: uploadResult.url,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Photo uploaded successfully',
      url: uploadResult.url,
      profile,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to upload photo' },
      { status: 500 }
    )
  }
}
