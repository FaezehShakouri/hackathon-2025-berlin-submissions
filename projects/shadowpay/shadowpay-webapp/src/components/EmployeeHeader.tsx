'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AztecWalletDisplay } from '@/components/AztecWalletDisplay'

interface EmployeeHeaderProps {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
}

export function EmployeeHeader({ isConnected, isConnecting, address, connect, disconnect }: EmployeeHeaderProps) {
  return (
    <nav className="container mx-auto px-6 py-6">
      <div className="bg-gray-800 rounded-xl px-5 py-3 flex items-center justify-between shadow-lg">
        <Link href="/" className="flex items-center space-x-3">
          <Shield className="h-7 w-7 text-white" />
          <span className="text-xl font-bold text-white">ShadowPay</span>
        </Link>
        <div className="flex items-center space-x-6">
          {isConnected ? (
             <AztecWalletDisplay address={address} disconnect={disconnect} />
          ) : (
            <Button
              onClick={connect}
              disabled={isConnecting}
              className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 font-semibold text-sm rounded-xl"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
} 