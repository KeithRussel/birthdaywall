'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Cake, Calendar, Clock } from 'lucide-react'

interface CountdownTimerProps {
  birthdayDate: Date
  name: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({ birthdayDate, name }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [isBirthday, setIsBirthday] = useState(false)
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const birthday = new Date(birthdayDate)

      // Set birthday to this year
      birthday.setFullYear(now.getFullYear())

      // If birthday has passed this year, set to next year
      if (birthday < now) {
        birthday.setFullYear(now.getFullYear() + 1)
      }

      // Check if today is the birthday
      const isToday =
        now.getDate() === birthday.getDate() &&
        now.getMonth() === birthday.getMonth()

      if (isToday) {
        setIsBirthday(true)
        setIsPast(false)
        return null
      }

      const difference = birthday.getTime() - now.getTime()

      if (difference < 0) {
        setIsPast(true)
        return null
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      return { days, hours, minutes, seconds }
    }

    // Calculate immediately
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [birthdayDate])

  if (isBirthday) {
    return (
      <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 shadow-xl">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Cake className="w-16 h-16 text-pink-600 animate-bounce" />
              <div className="absolute -top-2 -right-2">
                <span className="text-4xl animate-pulse">🎉</span>
              </div>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Happy Birthday, {name}! 🎂
          </h2>
          <p className="text-lg text-gray-700">
            Today is the special day! 🎊
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isPast || !timeLeft) {
    return null
  }

  const formatDate = new Date(birthdayDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })

  return (
    <Card className="border-2 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Countdown to {name}&apos;s Birthday
            </h3>
          </div>
          <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
            <Cake className="w-4 h-4" />
            {formatDate}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-md">
            <div className="text-2xl sm:text-4xl font-bold text-purple-600">
              {timeLeft.days}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">
              {timeLeft.days === 1 ? 'Day' : 'Days'}
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-md">
            <div className="text-2xl sm:text-4xl font-bold text-pink-600">
              {timeLeft.hours}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">
              {timeLeft.hours === 1 ? 'Hour' : 'Hours'}
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-md">
            <div className="text-2xl sm:text-4xl font-bold text-purple-600">
              {timeLeft.minutes}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">
              {timeLeft.minutes === 1 ? 'Min' : 'Mins'}
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-md">
            <div className="text-2xl sm:text-4xl font-bold text-pink-600">
              {timeLeft.seconds}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">
              {timeLeft.seconds === 1 ? 'Sec' : 'Secs'}
            </div>
          </div>
        </div>

        {timeLeft.days <= 7 && (
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-purple-600 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4" />
              The big day is coming soon! 🎉
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
