'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mounting, setMounting] = useState(true)

  useEffect(() => {
    setMounting(false)
  }, [])

  useEffect(() => {
    if (!mounting && status !== 'loading') {
      if (session) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [session, status, router, mounting])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-pink-500" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải...</p>
      </div>
    </div>
  )
}
