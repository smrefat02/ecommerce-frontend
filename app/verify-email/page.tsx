"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { verifyEmail } from "@/lib/auth"
import Link from "next/link"
import { getVerificationCodes } from "@/lib/storage"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [displayCode, setDisplayCode] = useState("")

  useState(() => {
    if (email) {
      const codes = getVerificationCodes()
      if (codes[email]) {
        setDisplayCode(codes[email])
      }
    }
  }, [email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!code) {
      setError("Please enter the verification code")
      return
    }

    setLoading(true)
    const result = verifyEmail(email, code)

    if (result.success) {
      setVerified(true)
    } else {
      setError(result.error || "Verification failed")
    }

    setLoading(false)
  }

  if (verified) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">Email Verified!</h1>

            <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded mb-6">
              <p className="text-center font-semibold">Sign up created successfully!</p>
              <p className="text-center text-sm mt-2">
                Your email has been verified. You can now sign in with your credentials.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition text-center block"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Verify Email</h1>

          <p className="text-slate-300 text-center mb-6">
            Enter the verification code sent to <span className="font-semibold">{email}</span>
          </p>

          {error && <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">{error}</div>}

          {displayCode && (
            <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded mb-4">
              <p className="text-sm text-center">
                <strong>Your Verification Code:</strong>
              </p>
              <p className="text-center text-2xl font-bold tracking-widest mt-2">{displayCode}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-2">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-2 rounded transition"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <p className="text-slate-400 text-center mt-6">
            Already verified?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
