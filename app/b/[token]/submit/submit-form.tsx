'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle2, Sparkles, Eye, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import confetti from 'canvas-confetti'
import Link from 'next/link'

interface SubmitFormProps {
  token: string
}

export function SubmitForm({ token }: SubmitFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [greetingType, setGreetingType] = useState<'note' | 'photo' | 'video'>('note')
  const [textContent, setTextContent] = useState('')
  const [senderName, setSenderName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (greetingType === 'photo' && !file.type.startsWith('image/')) {
      const errorMsg = 'Please select an image file (JPG, PNG, etc.)'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }
    if (greetingType === 'video' && !file.type.startsWith('video/')) {
      const errorMsg = 'Please select a video file (MP4, MOV, etc.)'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      const errorMsg = 'File size must be less than 50MB. Please choose a smaller file.'
      setError(errorMsg)
      toast.error('File too large', { description: errorMsg })
      return
    }

    setSelectedFile(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setFilePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('type', greetingType)
      formData.append('senderName', senderName)

      if (greetingType === 'note') {
        if (!textContent.trim()) {
          setError('Please enter a message')
          setIsLoading(false)
          return
        }
        formData.append('content', textContent)
      } else {
        if (!selectedFile) {
          setError(`Please select a ${greetingType}`)
          setIsLoading(false)
          return
        }
        formData.append('file', selectedFile)
      }

      // Simulate upload progress for better UX
      if (selectedFile) {
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 200)
      }

      const response = await fetch(`/api/greetings/${token}`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit greeting')
      }

      setUploadProgress(100)
      setSuccess(true)

      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        })
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        })
      }, 250)

      toast.success('Greeting submitted! 🎉', {
        description: 'Your birthday wish has been added to the wall',
      })

      setTimeout(() => {
        router.push(`/b/${token}`)
      }, 2000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit greeting. Please try again.'
      setError(errorMsg)
      toast.error('Submission failed', {
        description: errorMsg,
      })
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="relative">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto animate-in zoom-in duration-300" />
            <Sparkles className="w-6 h-6 text-yellow-500 absolute top-0 right-1/3 animate-pulse" />
            <Sparkles className="w-4 h-4 text-yellow-400 absolute bottom-0 left-1/3 animate-pulse delay-150" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-900">
              🎉 Greeting Submitted!
            </h3>
            <p className="text-green-700 mt-2">
              Your birthday wish has been added to the wall
            </p>
          </div>
          <Link href={`/b/${token}`}>
            <Button className="w-full gap-2 mt-4">
              <Eye className="w-4 h-4" />
              View All Greetings
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link href={`/b/${token}`}>
        <Button
          type="button"
          variant="ghost"
          className="gap-2 -ml-2 mb-2"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Wall
        </Button>
      </Link>

      <div className="space-y-2">
        <Label htmlFor="senderName">Your Name (optional)</Label>
        <Input
          id="senderName"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="Enter your name"
          disabled={isLoading}
        />
      </div>

      <Tabs
        value={greetingType}
        onValueChange={(value) => {
          setGreetingType(value as 'note' | 'photo' | 'video')
          setSelectedFile(null)
          setFilePreview(null)
          setError(null)
        }}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="note">Text Note</TabsTrigger>
          <TabsTrigger value="photo">Photo</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
        </TabsList>

        <TabsContent value="note" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Write your birthday wishes..."
              disabled={isLoading}
              className="min-h-[120px] sm:min-h-[160px]"
              required
            />
          </div>
        </TabsContent>

        <TabsContent value="photo" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo">Upload Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              disabled={isLoading}
              required
            />
            {filePreview && (
              <div className="mt-4 relative w-full h-64">
                <Image
                  src={filePreview}
                  alt="Preview"
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="video" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video">Upload Video (max 30 seconds)</Label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              capture="user"
              onChange={handleFileChange}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">
              Please keep videos under 30 seconds and 50MB
            </p>
            {filePreview && (
              <div className="mt-4">
                <video
                  src={filePreview}
                  controls
                  className="max-w-full h-auto rounded-lg max-h-64 mx-auto"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isLoading && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {uploadProgress > 0 && uploadProgress < 100 ? `Uploading ${uploadProgress}%` : 'Submitting...'}
          </>
        ) : (
          'Submit Greeting'
        )}
      </Button>
    </form>
  )
}
