import { Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AppHeader() {
  return (
    <nav className="container mx-auto px-6 py-6">
      <div className="bg-gray-800 rounded-xl px-5 py-3 flex items-center justify-between shadow-lg">
        <Link href="/" className="flex items-center space-x-3">
          <Shield className="h-7 w-7 text-white" />
          <span className="text-xl font-bold text-white">ShadowPay</span>
        </Link>
        <div className="flex items-center space-x-6">
          <a href="/#problem" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Problem</a>
          <a href="/#solution" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Solution</a>
          <a href="/#about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">About</a>
          <Link href="/sign-in">
            <Button className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 font-semibold text-sm rounded-xl">Open App</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
} 