'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface CelebrantCarouselProps {
  photos: string[]
  name: string
}

export function CelebrantCarousel({ photos, name }: CelebrantCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (photos.length === 0) return null

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <Card className="overflow-hidden border-2 shadow-lg">
      <div className="relative bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Main Image */}
        <div className="relative aspect-video sm:aspect-[16/9] lg:aspect-[21/9]">
          <img
            src={photos[currentIndex]}
            alt={`${name} - Photo ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
                onClick={goToNext}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Photo Counter */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {currentIndex + 1} / {photos.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {photos.length > 1 && (
          <div className="flex gap-2 p-4 justify-center bg-white/50 backdrop-blur-sm overflow-x-auto">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all ${
                  index === currentIndex
                    ? 'ring-4 ring-purple-500 scale-110'
                    : 'ring-2 ring-gray-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={photo}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
