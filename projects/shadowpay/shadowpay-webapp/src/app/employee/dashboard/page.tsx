'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { 
  Shield, 
  Wallet,
  ArrowUpRight, 
  Copy, 
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { EmployeeHeader } from '@/components/EmployeeHeader'
import { AztecWalletDisplay } from '@/components/AztecWalletDisplay'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import { useAccount } from '@nemi-fi/wallet-sdk/react'
import { aztecSdk } from '@/lib/aztec'

interface WithdrawResponse {
    success: boolean;
    txHash?: string;
}

const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

function EmployeeDashboardClient({ isConnected, onWithdraw }: { isConnected: boolean, onWithdraw: (address: string, amount: string) => Promise<WithdrawResponse> }) {
  const [balance, setBalance] = useState(1250.00);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleWithdrawClick = async () => {
    setError(null);
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (amount > balance) {
      setError("Withdrawal amount cannot exceed your balance.");
      return;
    }
    if (!withdrawAddress.startsWith('0x') || withdrawAddress.length !== 42) {
      setError("Please enter a valid Sepolia address.");
      return;
    }

    setIsWithdrawing(true);
    const response = await onWithdraw(withdrawAddress, withdrawAmount);
    
    if (response.success && response.txHash) {
        setBalance(prev => prev - amount);
        setTxHash(response.txHash);
        setShowSuccessModal(true);
        setWithdrawAddress('');
        setWithdrawAmount('');
    } else {
      setError("Withdrawal failed. Please try again later.");
    }
    setIsWithdrawing(false);
  }

  if (!isConnected) {
  return (
        <div className="text-center mt-20">
            <Wallet className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400">
                Please connect your Aztec wallet using the button in the header to view your dashboard.
          </p>
        </div>
    )
  }

  return (
    <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-blue-500/30 text-white p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <Shield className="h-6 w-6" />
                    <h3 className="text-lg font-semibold">Private Balance</h3>
          </div>
                <p className="text-4xl font-bold mb-1">{balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-2xl text-blue-200">sUSDC</span></p>
                <p className="text-blue-200">Your shielded USDC ready for withdrawal.</p>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 p-6">
                 <div className="flex items-center space-x-3 mb-4">
                    <ArrowUpRight className="h-6 w-6 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Withdraw to Sepolia</h3>
          </div>
                <div className="space-y-4">
                     <Input 
                        placeholder="Amount (e.g., 100)"
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        className="bg-gray-900 border-gray-600 text-white"
                        type="number"
                     />
                     <Input 
                        placeholder="Sepolia Address (0x...)" 
                        value={withdrawAddress}
                        onChange={e => setWithdrawAddress(e.target.value)}
                        className="bg-gray-900 border-gray-600 text-white"
                    />
                     <Button onClick={handleWithdrawClick} disabled={isWithdrawing || !withdrawAmount || !withdrawAddress} className="w-full bg-green-600 hover:bg-green-700">
                        {isWithdrawing && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                        Burn Tokens & Withdraw
                    </Button>
                    {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
          </div>
            </Card>
        </div>
        
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
            {showSuccessModal && (
                <Confetti
                    width={typeof window !== 'undefined' ? window.innerWidth : 0}
                    height={typeof window !== 'undefined' ? window.innerHeight : 0}
                    recycle={false}
                    numberOfPieces={500}
                    tweenDuration={10000}
                />
            )}
            <DialogContent className="sm:max-w-md bg-gray-900 border-green-500 text-center">
                <DialogHeader>
                    <DialogTitle className="text-green-400 text-3xl font-bold">Withdrawal Successful!</DialogTitle>
                    <DialogDescription className="text-gray-400 pt-2">
                        Your funds are on the way. You can track the transaction on the blockchain.
                    </DialogDescription>
                </DialogHeader>
                <div className="pt-4">
                     <a 
                        href={`https://sepolia.etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
                      >
                        View on Etherscan
                    </a>
                </div>
            </DialogContent>
        </Dialog>
        </div>
  )
}

export default function EmployeeDashboard() {
    const sdkAccount = useAccount(aztecSdk);
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
        if (sdkAccount) {
            setIsConnected(true);
            setAddress(sdkAccount.address.toString() ?? null);
        } else {
            setIsConnected(false);
            setAddress(null);
        }
    }, [sdkAccount]);

    const connect = async () => {
        setIsConnecting(true);
        try {
            await aztecSdk.connect('azguard');
            // After connection, the `useAccount` hook will update,
            // which will trigger our `useEffect` to update the state.
        } catch (e) {
            console.error("Connection failed:", e);
        } finally {
            setIsConnecting(false);
        }
    }
    
    const disconnect = () => {
        aztecSdk.disconnect();
        setIsConnected(false);
        setAddress(null);
        
        // Remove the specific localStorage keys used by the AzGuard wallet.
        localStorage.removeItem('azguard:session:default');
        localStorage.removeItem('aztec-wallet-current-connector-uuid');

        console.log("Disconnected and cleared AzGuard session data.");
    }

    const handleWithdraw = async (recipient: string, amount: string): Promise<WithdrawResponse> => {
      console.log(`Withdrawing ${amount} tokens to ${recipient} for account ${address}`);
      try {
          const response = await fetch('http://localhost:3001/withdraw', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ recipient, amount }),
          });

          if (!response.ok) {
              const errorText = await response.text();
              console.error('Withdrawal API call failed:', errorText);
              return { success: false };
          }
          
          const data = await response.json();
          console.log('Withdrawal successful:', data);
          return { success: true, txHash: data.txHash };

      } catch (error) {
          console.error('Error during withdrawal:', error);
          return { success: false };
      }
  }

  return (
    <div className="dark min-h-screen bg-black">
            <EmployeeHeader 
                isConnected={isConnected}
                isConnecting={isConnecting}
                address={address}
                connect={connect}
                disconnect={disconnect}
            />

            <div className="container mx-auto px-4 py-6 max-w-4xl pt-12">
                <EmployeeDashboardClient 
                    isConnected={isConnected}
                    onWithdraw={handleWithdraw}
                />
      </div>
    </div>
  )
} 