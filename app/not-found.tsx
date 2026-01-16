import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Page Not Found</CardTitle>
          <CardDescription>
            The birthday wall you&apos;re looking for doesn&apos;t exist or the link is invalid.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/create">
            <Button className="w-full">Create a Birthday Wall</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
