'use client'

import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Shield, Upload, Play, Users, Settings } from "lucide-react"
import { ConnectWallet } from '@/components/ConnectWallet'
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function EmployerPage() {
  const { isConnected } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push('/sign-in')
    }
  }, [isConnected, router])

  const handleWizardClick = () => {
    router.push('/employer/wizard')
  }

  const handleSettingsClick = () => {
    // TODO: Navigate to settings page when created
    console.log('Settings clicked')
  }

  if (!isConnected) {
    return (
      <div className="dark min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking wallet connection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dark min-h-screen bg-black">
      <div className="relative">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6">
          <div className="bg-gray-800 rounded-xl px-5 py-3 flex items-center justify-between shadow-lg">
            <Link href="/" className="flex items-center space-x-3">
              <Shield className="h-7 w-7 text-white" />
              <span className="text-xl font-bold text-white">ShadowPay</span>
              <span className="text-sm text-green-400 font-medium">Employer Portal</span>
            </Link>
            <div className="flex items-center space-x-6">
              <ConnectWallet />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <section className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              <span className="text-white">Employer</span>{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Manage your payroll securely and privately
            </p>
          </div>

          {/* Action Cards */}
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Run Payroll Card */}
              <Card 
                className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 hover:from-green-500/20 hover:via-emerald-500/10 hover:to-teal-500/20 border border-green-400/20 hover:border-green-400/40 p-8 text-center shadow-2xl shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-300 group cursor-pointer"
                onClick={handleWizardClick}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-8 w-8 text-green-400" />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">Run Payroll</h3>
                <div className="h-12 flex items-center justify-center mb-6">
                  <p className="text-gray-400 text-sm text-center">
                    Upload CSV and execute secure payments
                  </p>
                </div>
                
                <div className="text-sm text-green-400 font-medium">
                  Click to Start Wizard →
                </div>
              </Card>

              {/* Settings Card */}
              <Card 
                className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-indigo-500/10 hover:from-blue-500/20 hover:via-cyan-500/10 hover:to-indigo-500/20 border border-blue-400/20 hover:border-blue-400/40 p-8 text-center shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 group cursor-pointer"
                onClick={handleSettingsClick}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Settings className="h-8 w-8 text-blue-400" />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">Settings</h3>
                <div className="h-12 flex items-center justify-center mb-6">
                  <p className="text-gray-400 text-sm text-center">
                    Configure your payroll preferences
                  </p>
                </div>
                
                <div className="text-sm text-blue-400 font-medium">
                  Click to Configure →
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 