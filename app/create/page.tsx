import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateForm } from './create-form'

export default function CreatePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg-birthday relative overflow-hidden">
      <div className="celebration-pattern absolute inset-0 pointer-events-none"></div>
      <Card className="w-full max-w-md shadow-2xl border-2 relative z-10 backdrop-blur-sm bg-white/95">
        <CardHeader className="text-center space-y-3">
          <div className="text-6xl mb-2">🎂</div>
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create Birthday Wall
          </CardTitle>
          <CardDescription>
            Create a special page where friends and family can share birthday greetings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateForm />
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Private link
              </span>
              <span>•</span>
              <span>Only people with the link can view</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
