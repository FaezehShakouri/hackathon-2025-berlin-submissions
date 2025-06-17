import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, FileCheck, Users, Zap, Lock, CheckCircle, Upload, Play, Sparkles, Smartphone, Scan, FileText, Clipboard, EyeOff } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/AppHeader"

export default function Home() {
  return (
    <div className="dark min-h-screen bg-black">
      <div className="relative">
      {/* Navigation */}
      <AppHeader />

      {/* Hero Section */}
      <section className="flex pt-30 pb-30 justify-center">
        <div className="container mx-auto px-6 text-center">
        <Badge className="mb-8 px-4 py-2 bg-gradient-to-r from-blue-900/30 to-purple-900/30 text-blue-200 border border-blue-700/30">
          🚀 &nbsp; Proper Crypto Payroll
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="text-white">Get Them Paid.</span>{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Keep It Private.</span>
        </h1>
        <h2 className="text-2xl md:text-3xl text-gray-400 font-normal mb-12">
          Payroll that feels like a banking app but speaks blockchain
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-in">
            <Button className="!h-12 !bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-700 hover:!to-purple-700 !text-white !px-12 !font-semibold !text-sm !rounded-xl !shadow-lg hover:!shadow-xl !transition-all !duration-200 !inline-flex !items-center !justify-center !gap-2">
              <Zap className="h-4 w-4" />
              Open App
            </Button>
          </Link>
          <Button variant="outline" className="!h-12 !border-gray-600 !text-gray-300 hover:!bg-gray-900 hover:!text-white !px-12 !font-semibold !text-sm !rounded-xl !transition-all !duration-200 !inline-flex !items-center !justify-center !gap-2">
            <FileCheck className="h-4 w-4" />
            Learn More
          </Button>
        </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            The Problem with Crypto Payroll
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Traditional crypto payments expose sensitive salary data on public blockchains
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <Eye className="h-6 w-6 text-red-400 mr-3" />
            <h3 className="text-2xl font-bold text-white">Everyone Can See Your Payroll</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card className="backdrop-blur-xl bg-gradient-to-br from-red-500/10 via-rose-500/5 to-pink-500/10 hover:from-red-500/20 hover:via-rose-500/10 hover:to-pink-500/20 border border-red-400/20 hover:border-red-400/40 p-8 text-center shadow-2xl shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400/20 to-rose-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Workplace Tension</h3>
              <p className="text-gray-400 mb-6">Colleagues discover salary differences, causing internal conflicts and damaging team dynamics</p>
            </Card>
            
            <Card className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-orange-500/10 hover:from-yellow-500/20 hover:via-amber-500/10 hover:to-orange-500/20 border border-yellow-400/20 hover:border-yellow-400/40 p-8 text-center shadow-2xl shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Legal Compliance</h3>
              <p className="text-gray-400 mb-6">GDPR and privacy regulations require strict salary confidentiality protection</p>
            </Card>
            
            <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-indigo-500/10 hover:from-blue-500/20 hover:via-cyan-500/10 hover:to-indigo-500/20 border border-blue-400/20 hover:border-blue-400/40 p-8 text-center shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Eye className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Competitive Intelligence</h3>
              <p className="text-gray-400 mb-6">Competitors analyze your compensation strategy and talent acquisition costs</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Our Solution: Privacy-First Payroll
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Bundle, encrypt, and verify payments while maintaining complete privacy
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-cyan-500/10 hover:from-blue-500/20 hover:via-indigo-500/10 hover:to-cyan-500/20 border border-blue-400/20 hover:border-blue-400/40 p-8 text-center shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Bundle & Encrypt</h3>
            <p className="text-gray-400 mb-6">Secure hardware enclaves process payments privately, sending to one-time addresses only employees can access.</p>
          </Card>

          <Card className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 hover:from-green-500/20 hover:via-emerald-500/10 hover:to-teal-500/20 border border-green-400/20 hover:border-green-400/40 p-8 text-center shadow-2xl shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Prove Compliance</h3>
            <p className="text-gray-400 mb-6">Zero-knowledge proofs verify total amounts and legal compliance while keeping individual salaries private.</p>
          </Card>

          <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-fuchsia-500/10 hover:from-purple-500/20 hover:via-violet-500/10 hover:to-fuchsia-500/20 border border-purple-400/20 hover:border-purple-400/40 p-8 text-center shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Simple Experience</h3>
            <p className="text-gray-400 mb-6">Upload CSV, scan for payments, verify proofs - all with intuitive interfaces that hide complexity.</p>
          </Card>
        </div>
      </section>

      {/* User Types Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Three Portals, One Solution
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Role-specific interfaces that make privacy-preserving payroll effortless
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 hover:from-green-500/20 hover:via-emerald-500/10 hover:to-teal-500/20 border border-green-400/20 hover:border-green-400/40 p-8 text-center shadow-2xl shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">HR Staff</h3>
            <p className="text-gray-400 mb-6">Drag, drop, done</p>
            <div className="space-y-3 text-left">
              <div className="flex items-center text-gray-300 text-sm">
                <Upload className="h-4 w-4 text-blue-400 mr-3 flex-shrink-0" />
                Upload salary spreadsheet
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Play className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                Click "Run Payroll"
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Shield className="h-4 w-4 text-purple-400 mr-3 flex-shrink-0" />
                Get secure vault confirmation
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Sparkles className="h-4 w-4 text-yellow-400 mr-3 flex-shrink-0" />
                Celebrate with confetti! 🎉
              </div>
            </div>
          </Card>

          <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-indigo-500/10 hover:from-blue-500/20 hover:via-cyan-500/10 hover:to-indigo-500/20 border border-blue-400/20 hover:border-blue-400/40 p-8 text-center shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Zap className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Employees</h3>
            <p className="text-gray-400 mb-6">Scan, view, withdraw</p>
            <div className="space-y-3 text-left">
              <div className="flex items-center text-gray-300 text-sm">
                <Smartphone className="h-4 w-4 text-blue-400 mr-3 flex-shrink-0" />
                Open mobile-friendly wallet
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Scan className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                Tap "Scan for salary"
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Eye className="h-4 w-4 text-purple-400 mr-3 flex-shrink-0" />
                See private payment amount
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <FileText className="h-4 w-4 text-yellow-400 mr-3 flex-shrink-0" />
                Generate income proofs
              </div>
            </div>
          </Card>

          <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-fuchsia-500/10 hover:from-purple-500/20 hover:via-violet-500/10 hover:to-fuchsia-500/20 border border-purple-400/20 hover:border-purple-400/40 p-8 text-center shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileCheck className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Auditors</h3>
            <p className="text-gray-400 mb-6">Paste, verify, confirm</p>
            <div className="space-y-3 text-left">
              <div className="flex items-center text-gray-300 text-sm">
                <Clipboard className="h-4 w-4 text-blue-400 mr-3 flex-shrink-0" />
                Paste proof code
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Zap className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                Instant verification
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <CheckCircle className="h-4 w-4 text-purple-400 mr-3 flex-shrink-0" />
                See compliance confirmation
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <EyeOff className="h-4 w-4 text-yellow-400 mr-3 flex-shrink-0" />
                No individual salary exposure
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-indigo-400" />
            <span className="text-xl font-bold text-slate-100">ShadowPay</span>
          </div>
          <p className="text-slate-400">
            Privacy-first crypto payroll for the modern workplace
          </p>
        </div>
      </footer>
      </div>
    </div>
  )
}
