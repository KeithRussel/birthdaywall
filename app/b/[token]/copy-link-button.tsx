'use client'

import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

interface CopyLinkButtonProps {
  url: string
}

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!', {
        description: 'Share it with friends and family',
      })
    } catch (error) {
      toast.error('Failed to copy link', {
        description: 'Please try again',
      })
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
    >
      <Copy className="w-4 h-4 mr-2" />
      Copy Link
    </Button>
  )
}
