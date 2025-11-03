'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthService from '@/lib/services/authService'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Attempting login...')
      
      const response = await AuthService.login({
        email,
        password
      })

      console.log('Login response received:', response)
      console.log('User role:', response.role)

      if (response.token) {
        console.log('Token saved, checking role...')
        
        if (response.role === 'ADMIN') {
          console.log('Admin user, redirecting to /admin')
          router.push('/admin')
        } else {
          console.log('Customer user, redirecting to home')
          router.push('/')
        }
      } else {
        setError('Login failed: No token received')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Do not have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <p className="font-medium text-yellow-900 mb-2">Demo Credentials:</p>
          <p className="text-yellow-800 mb-3">
            Customer: refat@gmail.com / refat123
          </p>
          <p className="text-yellow-800">
            Admin: admin@example.com / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
