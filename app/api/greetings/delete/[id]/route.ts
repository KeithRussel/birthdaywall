import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const adminToken = searchParams.get('adminToken')

    if (!adminToken) {
      return NextResponse.json(
        { error: 'Admin token required' },
        { status: 401 }
      )
    }

    // Get greeting and verify admin token
    const greeting = await prisma.greeting.findUnique({
      where: { id },
      include: { birthdayPage: true },
    })

    if (!greeting) {
      return NextResponse.json(
        { error: 'Greeting not found' },
        { status: 404 }
      )
    }

    if (greeting.birthdayPage.adminToken !== adminToken) {
      return NextResponse.json(
        { error: 'Invalid admin token' },
        { status: 403 }
      )
    }

    // Delete file if it's a photo or video
    if (greeting.type === 'photo' || greeting.type === 'video') {
      try {
        const filePath = join(process.cwd(), 'public', greeting.content)
        await unlink(filePath)
      } catch (error) {
        console.error('Error deleting file:', error)
        // Continue even if file deletion fails
      }
    }

    // Delete greeting from database
    await prisma.greeting.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting greeting:', error)
    return NextResponse.json(
      { error: 'Failed to delete greeting' },
      { status: 500 }
    )
  }
}
