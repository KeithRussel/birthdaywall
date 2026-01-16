'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Filter } from 'lucide-react'

interface GreetingControlsProps {
  sortBy: string
  filterType: string
  onSortChange: (value: string) => void
  onFilterChange: (value: string) => void
}

export function GreetingControls({
  sortBy,
  filterType,
  onSortChange,
  onFilterChange,
}: GreetingControlsProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="most-liked">Most Liked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={filterType} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filter..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Greetings</SelectItem>
            <SelectItem value="note">Text Only</SelectItem>
            <SelectItem value="photo">Photos Only</SelectItem>
            <SelectItem value="video">Videos Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
