'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MessageSquare, Image as ImageIcon, Video, Heart, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface Greeting {
  id: string
  type: string
  content: string
  senderName: string | null
  reactions: number
  createdAt: Date
}

interface AdminGreetingsGridProps {
  greetings: Greeting[]
  adminToken: string
}

export function AdminGreetingsGrid({ greetings: initialGreetings, adminToken }: AdminGreetingsGridProps) {
  const [selectedGreeting, setSelectedGreeting] = useState<Greeting | null>(null)
  const [greetingToDelete, setGreetingToDelete] = useState<string | null>(null)
  const [greetings, setGreetings] = useState<Greeting[]>(initialGreetings)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (greetingId: string) => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/greetings/delete/${greetingId}?adminToken=${adminToken}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete greeting')
      }

      // Remove from local state
      setGreetings((prev) => prev.filter((g) => g.id !== greetingId))

      toast.success('Greeting deleted successfully')
      setGreetingToDelete(null)
      setSelectedGreeting(null)
    } catch (error) {
      toast.error('Failed to delete greeting')
    } finally {
      setIsDeleting(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <ImageIcon className="w-8 h-8" />
      case 'video':
        return <Video className="w-8 h-8" />
      default:
        return <MessageSquare className="w-8 h-8" />
    }
  }

  const getPreview = (greeting: Greeting) => {
    if (greeting.type === 'note') {
      return (
        <p className="text-sm text-muted-foreground line-clamp-3">
          {greeting.content}
        </p>
      )
    }
    return null
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {greetings.map((greeting) => (
          <Card
            key={greeting.id}
            className="bg-gradient-to-br from-white to-purple-50/30 border-2 shadow-md relative overflow-hidden"
          >
            <CardContent className="p-4 sm:p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-primary bg-purple-100 p-2 rounded-full">{getIcon(greeting.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {greeting.senderName || 'Anonymous'}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {greeting.type}
                  </p>
                </div>
              </div>
              {getPreview(greeting)}
              <div className="flex items-center justify-between pt-2 border-t gap-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  <span className="text-xs">{greeting.reactions || 0}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedGreeting(greeting)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setGreetingToDelete(greeting.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic">
                {new Date(greeting.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Dialog */}
      <Dialog
        open={!!selectedGreeting}
        onOpenChange={(open) => {
          if (!open) {
            const videos = document.querySelectorAll('video')
            videos.forEach((video) => {
              video.pause()
              video.currentTime = 0
            })
            setSelectedGreeting(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedGreeting && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedGreeting.senderName || 'Anonymous'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedGreeting.type === 'note' && (
                  <p className="whitespace-pre-wrap">{selectedGreeting.content}</p>
                )}
                {selectedGreeting.type === 'photo' && (
                  <div className="relative w-full aspect-video">
                    <Image
                      src={selectedGreeting.content}
                      alt="Greeting"
                      fill
                      className="object-contain rounded-lg"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </div>
                )}
                {selectedGreeting.type === 'video' && (
                  <video
                    src={selectedGreeting.content}
                    controls
                    className="w-full rounded-lg"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    {selectedGreeting.reactions} reactions
                  </span>
                  <span>{new Date(selectedGreeting.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!greetingToDelete}
        onOpenChange={(open) => !open && setGreetingToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Greeting?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this greeting? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => greetingToDelete && handleDelete(greetingToDelete)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
