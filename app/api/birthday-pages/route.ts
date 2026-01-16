import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const name = formData.get('name') as string
    const title = formData.get('title') as string | null
    const birthdayDate = formData.get('birthdayDate') as string

    if (!name || !birthdayDate) {
      return NextResponse.json(
        { error: 'Name and birthday date are required' },
        { status: 400 }
      )
    }

    // Generate unique tokens
    const token = nanoid(10)
    const adminToken = nanoid(16) // Longer for security

    // Handle photo uploads
    const photoUrls: string[] = []
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'celebrants', token)

    // Create upload directory
    await mkdir(uploadDir, { recursive: true })

    // Process up to 5 photos
    for (let i = 0; i < 5; i++) {
      const file = formData.get(`photo-${i}`) as File | null
      if (!file) continue

      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        continue
      }

      // Generate unique filename
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `${nanoid(8)}.${ext}`
      const filepath = join(uploadDir, filename)

      // Save file
      await writeFile(filepath, buffer)
      photoUrls.push(`/uploads/celebrants/${token}/${filename}`)
    }

    // Create birthday page
    const birthdayPage = await prisma.birthdayPage.create({
      data: {
        name,
        title: title || null,
        token,
        adminToken,
        birthdayDate: new Date(birthdayDate),
        celebrantPhotos: photoUrls.length > 0 ? JSON.stringify(photoUrls) : null,
      },
    })

    return NextResponse.json({
      token: birthdayPage.token,
      adminToken: birthdayPage.adminToken,
      id: birthdayPage.id,
    })
  } catch (error) {
    console.error('Error creating birthday page:', error)
    return NextResponse.json(
      { error: 'Failed to create birthday page' },
      { status: 500 }
    )
  }
}
