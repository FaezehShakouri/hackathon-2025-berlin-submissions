'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, Copy, LogOut } from "lucide-react"

interface AztecWalletDisplayProps {
  address: string | null;
  disconnect: () => void;
}

export function AztecWalletDisplay({ address, disconnect }: AztecWalletDisplayProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!address) {
    return null;
  }

  return (
    <div className="relative">
      <Card 
        className="h-12 backdrop-blur-xl bg-gradient-to-br from-gray-800/80 via-gray-900/60 to-black/40 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="h-full px-4 flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 animate-pulse`}></div>
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <span className="text-sm text-gray-400 font-medium truncate">
              Aztec Network
            </span>
            <span className="text-sm text-white font-semibold">
              {formatAddress(address)}
            </span>
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
        </div>
      </Card>
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-64 z-50">
          <Card className="backdrop-blur-xl bg-gradient-to-br from-gray-800/90 via-gray-900/80 to-black/60 border border-gray-600/40 shadow-2xl">
            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-medium">Wallet Address</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(address)}
                    className="h-6 w-6 p-0 hover:bg-gray-700/50"
                  >
                    <Copy className="h-3 w-3 text-gray-400" />
                  </Button>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 font-mono text-sm text-white break-all">
                  {address}
                </div>
              </div>
              <div className="pt-2 border-t border-gray-700/50 space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    disconnect()
                    setShowDropdown(false)
                  }}
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
} 