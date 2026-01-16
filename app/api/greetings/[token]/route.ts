import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const formData = await request.formData()

    const type = formData.get('type') as string
    const senderName = formData.get('senderName') as string | null
    const file = formData.get('file') as File | null
    const textContent = formData.get('content') as string | null

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      )
    }

    // Verify birthday page exists
    const birthdayPage = await prisma.birthdayPage.findUnique({
      where: { token },
    })

    if (!birthdayPage) {
      return NextResponse.json(
        { error: 'Birthday page not found' },
        { status: 404 }
      )
    }

    let content: string

    if (type === 'note') {
      if (!textContent) {
        return NextResponse.json(
          { error: 'Content is required for text notes' },
          { status: 400 }
        )
      }
      content = textContent
    } else {
      if (!file) {
        return NextResponse.json(
          { error: `File is required for ${type}` },
          { status: 400 }
        )
      }

      // Validate file size (50MB max)
      const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File size must be less than 50MB' },
          { status: 400 }
        )
      }

      // Validate file type
      if (type === 'photo' && !file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Invalid file type for photo. Please upload an image file.' },
          { status: 400 }
        )
      }
      if (type === 'video' && !file.type.startsWith('video/')) {
        return NextResponse.json(
          { error: 'Invalid file type for video. Please upload a video file.' },
          { status: 400 }
        )
      }

      // Validate specific image formats
      const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (type === 'photo' && !allowedImageTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Only JPEG, PNG, GIF, and WebP images are supported' },
          { status: 400 }
        )
      }

      // Validate specific video formats
      const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo']
      if (type === 'video' && !allowedVideoTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Only MP4, MOV, WebM, and AVI videos are supported' },
          { status: 400 }
        )
      }

      // Create uploads directory if it doesn't exist
      const uploadDir = join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split('.').pop()
      const filename = `${timestamp}-${randomString}.${extension}`
      const filepath = join(uploadDir, filename)

      // Save file
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)

      content = `/uploads/${filename}`
    }

    // Create greeting
    const greeting = await prisma.greeting.create({
      data: {
        birthdayPageId: birthdayPage.id,
        type,
        content,
        senderName: senderName || undefined,
      },
    })

    return NextResponse.json({ success: true, greeting })
  } catch (error) {
    console.error('Error submitting greeting:', error)
    return NextResponse.json(
      { error: 'Failed to submit greeting' },
      { status: 500 }
    )
  }
}
