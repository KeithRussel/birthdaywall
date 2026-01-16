import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { greetingId } = body

    if (!greetingId) {
      return NextResponse.json(
        { error: 'Greeting ID is required' },
        { status: 400 }
      )
    }

    // Increment reaction count
    const greeting = await prisma.greeting.update({
      where: { id: greetingId },
      data: {
        reactions: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ reactions: greeting.reactions })
  } catch (error) {
    console.error('Error updating reactions:', error)
    return NextResponse.json(
      { error: 'Failed to update reactions' },
      { status: 500 }
    )
  }
}
