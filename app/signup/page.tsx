"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")

  if (!name.trim()) {
    setError("Name is required")
    return
  }

  if (!email.trim()) {
    setError("Email is required")
    return
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match")
    return
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters")
    return
  }

  setLoading(true)
  try {
    const nameParts = name.trim().split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "User"

    const response = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: name,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
      }),
    })

    const data = await response.json()
    
    if (response.ok) {
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("user", JSON.stringify({
        email: data.email,
        username: data.username,
        role: data.role,
      }))
      router.push("/login")
    } else {
      setError(data.lastName || data.message || "Signup failed")
      console.error("Signup error:", data)
    }
  } catch (err) {
    setError("Signup failed. Please try again.")
    console.error("Request error:", err)
  } finally {
    setLoading(false)
  }
}


  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h1>

          {error && <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-2 rounded transition"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-slate-400 text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
