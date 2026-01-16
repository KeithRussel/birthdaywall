import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { GreetingsGrid } from './greetings-grid'
import { CopyLinkButton } from './copy-link-button'
import { ShareDialog } from './share-dialog'
import { CelebrantCarousel } from './celebrant-carousel'
import { CountdownTimer } from './countdown-timer'
import { AdminLink } from './admin-link'

interface PageProps {
  params: Promise<{
    token: string
  }>
}

export default async function BirthdayWallPage({ params }: PageProps) {
  const { token } = await params

  const birthdayPage = await prisma.birthdayPage.findUnique({
    where: { token },
    include: {
      greetings: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!birthdayPage) {
    notFound()
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/b/${token}/submit`

  // Parse celebrant photos
  const celebrantPhotos = birthdayPage.celebrantPhotos
    ? JSON.parse(birthdayPage.celebrantPhotos)
    : []

  return (
    <div className="min-h-screen gradient-bg-birthday relative overflow-hidden p-4">
      <div className="celebration-pattern absolute inset-0 pointer-events-none"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Celebrant Photo Carousel */}
        {celebrantPhotos.length > 0 && (
          <div className="mb-6">
            <CelebrantCarousel photos={celebrantPhotos} name={birthdayPage.name} />
          </div>
        )}

        {/* Countdown Timer */}
        {birthdayPage.birthdayDate && (
          <div className="mb-6">
            <CountdownTimer
              birthdayDate={birthdayPage.birthdayDate}
              name={birthdayPage.name}
            />
          </div>
        )}

        <Card className="mb-8 shadow-xl border-2 backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-4">
            <div className="text-center">
              <div className="text-5xl mb-3">🎉</div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {birthdayPage.title || `${birthdayPage.name}'s Birthday Wall`}
              </CardTitle>
            </div>
            {birthdayPage.title && (
              <p className="text-center text-muted-foreground text-lg sm:text-xl">
                {birthdayPage.name}
              </p>
            )}
            {birthdayPage.greetings.length > 0 && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                {birthdayPage.greetings.length} {birthdayPage.greetings.length === 1 ? 'greeting' : 'greetings'} shared
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Share this link with friends and family to collect greetings:
              </p>
              <div className="flex gap-2 items-center justify-center flex-wrap">
                <code className="bg-muted px-3 py-1 rounded text-sm break-all">
                  {shareUrl}
                </code>
                <CopyLinkButton url={shareUrl} />
                <ShareDialog url={shareUrl} name={birthdayPage.name} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <Link href={`/b/${token}/submit`}>
                <Button>Add Your Greeting</Button>
              </Link>
              <AdminLink token={token} />
            </div>
          </CardContent>
        </Card>

        {birthdayPage.greetings.length > 0 ? (
          <GreetingsGrid greetings={birthdayPage.greetings} />
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold mb-2">No Greetings Yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to make {birthdayPage.name}&apos;s day special!
              </p>
              <Link href={`/b/${token}/submit`}>
                <Button size="lg">✨ Add First Greeting</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
