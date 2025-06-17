'use client'

import { useAccount, useDisconnect, useEnsName } from 'wagmi'
import { useConnectModal, useChainModal } from '@rainbow-me/rainbowkit'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from "lucide-react"
import { useState } from 'react'

export function ConnectWallet() {
  const { address, isConnected, chain } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
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

  const getNetworkColor = (chainId?: number) => {
    switch (chainId) {
      case 1: // Ethereum Mainnet
        return 'from-blue-400 to-blue-600'
      case 137: // Polygon
        return 'from-purple-400 to-purple-600'
      case 80001: // Polygon Mumbai
        return 'from-purple-300 to-purple-500'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  if (!isConnected) {
    return (
      <Button
        onClick={openConnectModal}
        className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
      >
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </Button>
    )
  }

  return (
    <div className="relative">
      <Card 
        className="h-12 backdrop-blur-xl bg-gradient-to-br from-gray-800/80 via-gray-900/60 to-black/40 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="h-full px-4 flex items-center space-x-3">
          {/* Network Indicator */}
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getNetworkColor(chain?.id)} animate-pulse`}></div>
          
          {/* Address/Network Info */}
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <span className="text-sm text-gray-400 font-medium truncate">
              {chain?.name || 'Unknown'}
            </span>
            <span className="text-sm text-white font-semibold">
              {ensName || formatAddress(address!)}
            </span>
          </div>

          {/* Dropdown Arrow */}
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
        </div>
      </Card>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-64 z-50">
          <Card className="backdrop-blur-xl bg-gradient-to-br from-gray-800/90 via-gray-900/80 to-black/60 border border-gray-600/40 shadow-2xl">
            <div className="p-4 space-y-4">
              {/* Address Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-medium">Wallet Address</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(address!)}
                    className="h-6 w-6 p-0 hover:bg-gray-700/50"
                  >
                    <Copy className="h-3 w-3 text-gray-400" />
                  </Button>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 font-mono text-sm text-white break-all">
                  {address}
                </div>
              </div>

              {/* Network Section */}
              <div>
                <span className="text-xs text-gray-400 font-medium">Network</span>
                <Button
                  variant="ghost"
                  onClick={openChainModal}
                  className="w-full mt-1 justify-start bg-gray-800/50 hover:bg-gray-700/50 text-white"
                >
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getNetworkColor(chain?.id)} mr-2`}></div>
                  {chain?.name || 'Unknown Network'}
                  <ChevronDown className="h-3 w-3 ml-auto" />
                </Button>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-gray-700/50 space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
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

      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
} 