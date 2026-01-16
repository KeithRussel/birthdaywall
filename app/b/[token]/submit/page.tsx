import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SubmitForm } from './submit-form'

interface PageProps {
  params: Promise<{
    token: string
  }>
}

export default async function SubmitGreetingPage({ params }: PageProps) {
  const { token } = await params

  const birthdayPage = await prisma.birthdayPage.findUnique({
    where: { token },
  })

  if (!birthdayPage) {
    notFound()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg-birthday relative overflow-hidden">
      <div className="celebration-pattern absolute inset-0 pointer-events-none"></div>
      <Card className="w-full max-w-2xl shadow-2xl border-2 relative z-10 backdrop-blur-sm bg-white/95">
        <CardHeader className="text-center space-y-3">
          <div className="text-5xl mb-2">💝</div>
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Share Your Birthday Greeting
          </CardTitle>
          <CardDescription>
            Leave a special message, photo, or video for {birthdayPage.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubmitForm token={token} />
        </CardContent>
      </Card>
    </div>
  )
}
