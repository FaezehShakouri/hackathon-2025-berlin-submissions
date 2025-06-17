'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// This page now acts as a simple entry point to the employee dashboard.
export default function EmployeePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/employee/dashboard')
  }, [router])

    return (
      <div className="dark min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
        <p className="text-gray-400">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
} 