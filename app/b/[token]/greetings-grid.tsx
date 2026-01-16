'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MessageSquare, Image as ImageIcon, Video, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { GreetingControls } from './greeting-controls'
import { useMemo } from 'react'

interface Greeting {
  id: string
  type: string
  content: string
  senderName: string | null
  reactions: number
  createdAt: Date
}

interface GreetingsGridProps {
  greetings: Greeting[]
}

export function GreetingsGrid({ greetings: initialGreetings }: GreetingsGridProps) {
  const [selectedGreeting, setSelectedGreeting] = useState<Greeting | null>(null)
  const [greetings, setGreetings] = useState<Greeting[]>(initialGreetings)
  const [sortBy, setSortBy] = useState('newest')
  const [filterType, setFilterType] = useState('all')
  const [reactedGreetings, setReactedGreetings] = useState<Set<string>>(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('reactedGreetings')
      return stored ? new Set(JSON.parse(stored)) : new Set()
    }
    return new Set()
  })

  // Apply sorting and filtering
  const filteredAndSortedGreetings = useMemo(() => {
    let result = [...greetings]

    // Filter
    if (filterType !== 'all') {
      result = result.filter((g) => g.type === filterType)
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'most-liked':
          return (b.reactions || 0) - (a.reactions || 0)
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return result
  }, [greetings, sortBy, filterType])

  const handleReaction = async (greetingId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening the dialog

    // Check if already reacted
    if (reactedGreetings.has(greetingId)) {
      toast.info('You already reacted to this greeting!')
      return
    }

    try {
      const response = await fetch('/api/greetings/react', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ greetingId }),
      })

      if (!response.ok) throw new Error('Failed to add reaction')

      const data = await response.json()

      // Update local state
      setGreetings((prev) =>
        prev.map((g) =>
          g.id === greetingId ? { ...g, reactions: data.reactions } : g
        )
      )

      // Mark as reacted and save to localStorage
      const newReactedSet = new Set(reactedGreetings)
      newReactedSet.add(greetingId)
      setReactedGreetings(newReactedSet)
      localStorage.setItem('reactedGreetings', JSON.stringify(Array.from(newReactedSet)))

      toast.success('❤️ Reaction added!')
    } catch (error) {
      toast.error('Failed to add reaction')
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
      <GreetingControls
        sortBy={sortBy}
        filterType={filterType}
        onSortChange={setSortBy}
        onFilterChange={setFilterType}
      />
      {filteredAndSortedGreetings.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No greetings match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedGreetings.map((greeting) => (
          <Card
            key={greeting.id}
            className="cursor-pointer card-hover-effect bg-gradient-to-br from-white to-purple-50/30 border-2 shadow-md"
            onClick={() => setSelectedGreeting(greeting)}
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
              <div className="flex items-center justify-between pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleReaction(greeting.id, e)}
                  className={`gap-1 transition-colors ${
                    reactedGreetings.has(greeting.id)
                      ? 'text-red-500'
                      : 'text-muted-foreground hover:text-red-500'
                  }`}
                  disabled={reactedGreetings.has(greeting.id)}
                >
                  <Heart className={`w-4 h-4 ${reactedGreetings.has(greeting.id) ? 'fill-red-500' : ''}`} />
                  <span className="text-xs">{greeting.reactions || 0}</span>
                </Button>
                <span className="text-xs text-muted-foreground italic">Click to view</span>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      <Dialog
        open={!!selectedGreeting}
        onOpenChange={(open) => {
          if (!open) {
            // Stop video playback when dialog closes
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
                    onEnded={(e) => {
                      e.currentTarget.currentTime = 0
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(selectedGreeting.createdAt).toLocaleString()}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
