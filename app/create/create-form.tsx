'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Calendar, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function CreateForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    // Limit to 5 photos
    if (selectedPhotos.length + files.length > 5) {
      toast.error('Maximum 5 photos allowed')
      return
    }

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`)
        return false
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`)
        return false
      }
      return true
    })

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })

    setSelectedPhotos((prev) => [...prev, ...validFiles])
  }

  const removePhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index))
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Add photos to form data
      selectedPhotos.forEach((photo, index) => {
        formData.append(`photo-${index}`, photo)
      })

      const response = await fetch('/api/birthday-pages', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create birthday wall')
      }

      toast.success('Birthday wall created! 🎉')
      // Store admin token in localStorage for this session
      localStorage.setItem(`admin_${result.token}`, result.adminToken)
      router.push(`/b/${result.token}`)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create birthday wall'
      toast.error(errorMsg)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Birthday Person&apos;s Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter name"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthdayDate" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Birthday Date *
        </Label>
        <Input
          id="birthdayDate"
          name="birthdayDate"
          type="date"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Optional Title/Message</Label>
        <Textarea
          id="title"
          name="title"
          placeholder="e.g., Happy 30th Birthday!"
          disabled={isLoading}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photos" className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Celebrant Photos (up to 5)
        </Label>
        <Input
          id="photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          disabled={isLoading}
          className="cursor-pointer"
        />
        <p className="text-xs text-muted-foreground">
          Add photos of the birthday person to personalize their wall
        </p>

        {photoPreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {photoPreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isLoading}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Birthday Wall'}
      </Button>
    </form>
  )
}
