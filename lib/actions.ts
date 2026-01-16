'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

// Generate a secure random token
function generateToken(): string {
  return crypto.randomBytes(16).toString('hex')
}

// Create a new birthday page
export async function createBirthdayPage(formData: FormData) {
  const name = formData.get('name') as string
  const title = formData.get('title') as string | null

  if (!name) {
    return { error: 'Name is required' }
  }

  const token = generateToken()

  const birthdayPage = await prisma.birthdayPage.create({
    data: {
      name,
      title: title || undefined,
      token,
    },
  })

  redirect(`/b/${birthdayPage.token}`)
}

// Submit a greeting
export async function submitGreeting(
  token: string,
  formData: FormData
) {
  const type = formData.get('type') as string
  const content = formData.get('content') as string
  const senderName = formData.get('senderName') as string | null

  if (!type || !content) {
    return { error: 'Type and content are required' }
  }

  // Verify birthday page exists
  const birthdayPage = await prisma.birthdayPage.findUnique({
    where: { token },
  })

  if (!birthdayPage) {
    return { error: 'Birthday page not found' }
  }

  await prisma.greeting.create({
    data: {
      birthdayPageId: birthdayPage.id,
      type,
      content,
      senderName: senderName || undefined,
    },
  })

  return { success: true }
}
