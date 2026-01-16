'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield } from 'lucide-react'

interface AdminLinkProps {
  token: string
}

export function AdminLink({ token }: AdminLinkProps) {
  const [adminToken, setAdminToken] = useState<string | null>(null)

  useEffect(() => {
    // Check localStorage for admin token
    const stored = localStorage.getItem(`admin_${token}`)
    setAdminToken(stored)
  }, [token])

  if (!adminToken) return null

  return (
    <div className="text-center">
      <Link href={`/admin/${adminToken}`}>
        <Button variant="outline" className="gap-2">
          <Shield className="w-4 h-4" />
          Admin Panel
        </Button>
      </Link>
    </div>
  )
}
