'use client'

import { useState, useCallback } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Shield, Upload, Download, ArrowLeft, ArrowRight, Check, Calculator, Users, DollarSign } from "lucide-react"
import { ConnectWallet } from '@/components/ConnectWallet'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { parseUnits, formatUnits } from 'viem'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { config } from '@/app/providers'

interface PayoutData {
  employeeId: string
  metaAddress: string
  netPay: number
  memo: string
}

const SAMPLE_CSV_DATA = `employee_id,meta_address,net_pay,memo
E-1027,0x1234abCD5678ef90123456ABcdef7890ABcD.meta,4500.00,May-2025 salary
E-2049,0x98Fa3210bCdE4567aBcDEf0987654321abcd.meta,3800.50,May-2025 salary
E-3051,0x5678EfGh9012IjKl3456MnOp7890QrSt1234.meta,5200.75,May-2025 salary`

const USDC_CONTRACT_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
const PAYROLL_CONTRACT_ADDRESS = '0xb0F3d814b4837Fe618C7441BD9a7B628fB0557Fd' 

const USDC_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const

const PAYROLL_ABI = [
    {
    "inputs": [
      { "internalType": "uint256", "name": "jobId", "type": "uint256" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

export default function EmployerWizardPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [payoutData, setPayoutData] = useState<PayoutData[]>([])
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { writeContractAsync } = useWriteContract()

  useEffect(() => {
    if (!isConnected) {
      router.push('/sign-in')
    }
  }, [isConnected, router])

  const downloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_DATA], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'payroll_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setCsvFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',')
      
      const data: PayoutData[] = lines.slice(1).map(line => {
        const values = line.split(',')
        return {
          employeeId: values[0]?.trim() || '',
          metaAddress: values[1]?.trim() || '',
          netPay: parseFloat(values[2]) || 0,
          memo: values[3]?.trim() || ''
        }
      }).filter(item => item.metaAddress && item.netPay > 0)

      setPayoutData(data)
    }
    reader.readAsText(file)
  }, [])

  const calculateTotals = () => {
    const totalAmount = payoutData.reduce((sum, payout) => sum + payout.netPay, 0)
    const estimatedFees = totalAmount * 0.003 
    return { totalAmount, estimatedFees, totalWithFees: totalAmount + estimatedFees }
  }

  const handleConfirmTransaction = async () => {
    if (!address) {
      alert('Could not find wallet address. Please reconnect.')
      setIsProcessing(false)
      return
    }

    setIsProcessing(true)
    try {
      // 1. Prepare data and call backend to get a job ID
      const recipients = payoutData.map(payout => ({
        address: payout.metaAddress,
        amount: payout.netPay.toString(),
      }));

      console.log('Sending payout data to backend:', { recipients })
      const response = await fetch('http://localhost:3001/payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipients }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create payout job: ${response.status} ${errorData}`);
      }
      
      const { jobId } = await response.json();
      console.log('Received jobId from backend:', jobId)

      if (typeof jobId !== 'number') {
        throw new Error('Invalid jobId received from backend.');
      }

      const { totalWithFees } = calculateTotals()
      // USDC on Sepolia has 6 decimals
      const amountInBaseUnits = parseUnits(totalWithFees.toFixed(2), 6)

      // Check current allowance
      console.log('Checking USDC allowance...')
      const currentAllowance = await readContract(config, {
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: 'allowance',
        args: [address, PAYROLL_CONTRACT_ADDRESS],
      });
      console.log(`Current allowance is ${formatUnits(currentAllowance, 6)} USDC`)

      // 2. Approve USDC transfer to our payroll contract if needed
      if (currentAllowance < amountInBaseUnits) {
        console.log(`Approving ${totalWithFees} USDC for spender: ${PAYROLL_CONTRACT_ADDRESS}`)
        const approveHash = await writeContractAsync({
          address: USDC_CONTRACT_ADDRESS,
          abi: USDC_ABI,
          functionName: 'approve',
          args: [PAYROLL_CONTRACT_ADDRESS, amountInBaseUnits],
        })
        await waitForTransactionReceipt(config, {
          hash: approveHash,
        })
        console.log('Approval transaction hash:', approveHash)
      } else {
        console.log('Sufficient allowance already exists. Skipping approval.')
      }
      
      // 3. Call deposit function on the payroll contract
      // wait until allowance tx is mined


      console.log(`Depositing for job ID ${jobId} with amount ${totalWithFees} USDC`)
      const depositHash = await writeContractAsync({
        address: PAYROLL_CONTRACT_ADDRESS,
        abi: PAYROLL_ABI,
        functionName: 'deposit',
        args: [BigInt(jobId), amountInBaseUnits],
      })
      console.log('Deposit transaction hash:', depositHash)

      alert('Payroll transaction initiated successfully! Check your wallet and the console for transaction details.')
      router.push('/employer')

    } catch (error) {
      console.error('Transaction failed:', error)
      alert(`Transaction failed. Check the console for details.`)
    } finally {
      setIsProcessing(false)
    }
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

  const { totalAmount, estimatedFees, totalWithFees } = calculateTotals()

  return (
    <div className="dark min-h-screen bg-black">
      <div className="relative">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6">
          <div className="bg-gray-800 rounded-xl px-5 py-3 flex items-center justify-between shadow-lg">
            <Link href="/employer" className="flex items-center space-x-3">
              <ArrowLeft className="h-5 w-5 text-gray-400" />
              <Shield className="h-7 w-7 text-white" />
              <span className="text-xl font-bold text-white">ShadowPay</span>
              <span className="text-sm text-green-400 font-medium">Payroll Wizard</span>
            </Link>
            <div className="flex items-center space-x-6">
              <ConnectWallet />
            </div>
          </div>
        </nav>

        {/* Progress Steps */}
        <section className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-12">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {currentStep > step ? <Check className="h-5 w-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-4 ${
                      currentStep > step ? 'bg-green-500' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            {currentStep === 1 && (
              <Card className="backdrop-blur-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Upload Payroll Data</h2>
                  <p className="text-gray-400">Upload your CSV file to get started</p>
                </div>

                {/* Upload Section */}
                <div className="max-w-xl mx-auto">
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-green-400 transition-colors flex flex-col items-center justify-center min-h-[140px]">
                    <Upload className="h-10 w-10 text-gray-400 mb-3" />
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center justify-center">
                      <span className="text-white font-medium block mb-1">Click to upload CSV</span>
                      <p className="text-gray-400 text-sm">or drag and drop your file here</p>
                    </Label>
                  </div>
                  {csvFile && (
                    <div className="flex items-center justify-center space-x-2 text-green-400 mt-4">
                      <Check className="h-4 w-4" />
                      <span className="text-sm">{csvFile.name} uploaded successfully</span>
                    </div>
                  )}
                </div>

                {/* Template Link Inside Card */}
                <div className="text-center mt-6 pt-4 border-t border-gray-700">
                  <button 
                    onClick={downloadTemplate}
                    className="text-green-400 hover:text-green-300 underline text-sm transition-colors"
                  >
                    Need a template? Download sample CSV
                  </button>
                </div>

                <div className="flex justify-end mt-8">
                  <Button 
                    onClick={() => setCurrentStep(2)}
                    disabled={payoutData.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 2 && (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Payout Grid */}
                <div className="lg:col-span-2">
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Payout Details</h2>
                    <div className="max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-gray-300">Employee ID</TableHead>
                            <TableHead className="text-gray-300">Meta Address</TableHead>
                            <TableHead className="text-gray-300">Net Pay</TableHead>
                            <TableHead className="text-gray-300">Memo</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payoutData.map((payout, index) => (
                            <TableRow key={index}>
                              <TableCell className="text-white font-mono">{payout.employeeId}</TableCell>
                              <TableCell className="text-gray-400 font-mono text-xs">
                                {payout.metaAddress.slice(0, 8)}...{payout.metaAddress.slice(-8)}
                              </TableCell>
                              <TableCell className="text-white">${payout.netPay.toLocaleString()}</TableCell>
                              <TableCell className="text-gray-400 text-sm">{payout.memo}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </Card>
                </div>

                {/* Summary */}
                <div className="space-y-6">
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20 p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <Calculator className="h-5 w-5 mr-2 text-green-400" />
                      Payment Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          Employees
                        </span>
                        <span className="text-white font-medium">{payoutData.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Amount</span>
                        <span className="text-white font-medium">${totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Estimated Fees</span>
                        <span className="text-white font-medium">${estimatedFees.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-green-400 font-medium flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Total to Pay
                          </span>
                          <span className="text-green-400 font-bold text-lg">${totalWithFees.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div className="flex flex-col space-y-3">
                    <Button 
                      onClick={() => setCurrentStep(3)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Review & Confirm
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="border-gray-600 text-gray-400 hover:bg-gray-800"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <Card className="backdrop-blur-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Confirm Transaction</h2>
                  <p className="text-gray-400">Review your payroll details before initiating the transaction</p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-white font-medium mb-4">Transaction Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Recipients:</span>
                          <span className="text-white">{payoutData.length} employees</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Amount:</span>
                          <span className="text-white">${totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Network Fees:</span>
                          <span className="text-white">${estimatedFees.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t border-gray-600">
                          <span className="text-green-400">Total:</span>
                          <span className="text-green-400">${totalWithFees.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-4">Security Notice</h3>
                      <div className="text-sm text-gray-400 space-y-2">
                        <p>• All transactions are processed securely on-chain</p>
                        <p>• Employee privacy is protected through zero-knowledge proofs</p>
                        <p>• Transaction cannot be reversed once confirmed</p>
                        <p>• You will be prompted to sign the transaction in your wallet</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    className="border-gray-600 text-gray-400 hover:bg-gray-800"
                    disabled={isProcessing}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleConfirmTransaction}
                    className="bg-green-600 hover:bg-green-700 text-white px-8"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Confirm & Send
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}