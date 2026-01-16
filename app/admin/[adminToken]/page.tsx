import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield } from 'lucide-react'
import { AdminGreetingsGrid } from './admin-greetings-grid'

interface PageProps {
  params: Promise<{
    adminToken: string
  }>
}

export default async function AdminPage({ params }: PageProps) {
  const { adminToken } = await params

  const birthdayPage = await prisma.birthdayPage.findFirst({
    where: {
      adminToken,
    },
    include: {
      greetings: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!birthdayPage) {
    notFound()
  }

  return (
    <div className="min-h-screen gradient-bg-birthday relative overflow-hidden p-4">
      <div className="celebration-pattern absolute inset-0 pointer-events-none"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <Card className="mb-6 shadow-xl border-2 backdrop-blur-sm bg-white/95">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Admin Panel</CardTitle>
                  <CardDescription>
                    Manage greetings for {birthdayPage.name}&apos;s birthday wall
                  </CardDescription>
                </div>
              </div>
              <Link href={`/b/${birthdayPage.token}`}>
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Wall
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {birthdayPage.greetings.length}
                </div>
                <div className="text-sm text-gray-600">Total Greetings</div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-pink-600">
                  {birthdayPage.greetings.filter((g) => g.type === 'note').length}
                </div>
                <div className="text-sm text-gray-600">Text Notes</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {birthdayPage.greetings.filter((g) => g.type === 'photo').length}
                </div>
                <div className="text-sm text-gray-600">Photos</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {birthdayPage.greetings.filter((g) => g.type === 'video').length}
                </div>
                <div className="text-sm text-gray-600">Videos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {birthdayPage.greetings.length > 0 ? (
          <AdminGreetingsGrid
            greetings={birthdayPage.greetings}
            adminToken={adminToken}
          />
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold mb-2">No Greetings Yet</h3>
              <p className="text-muted-foreground">
                No one has submitted a greeting yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
