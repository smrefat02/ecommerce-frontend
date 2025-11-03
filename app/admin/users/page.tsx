'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthService from '@/lib/services/authService'
import Link from 'next/link'

type User = {
  id: string
  email: string
  username: string
  role: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    loadUsers()
    setMounted(true)
  }, [router])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('http://localhost:8080/api/admin/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load users:', error)
      setUsers([])
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/admin" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
            ShopHub Admin
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/admin" className="text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/admin/products" className="text-gray-700 hover:text-gray-900">
              Products
            </Link>
            <Link href="/admin/orders" className="text-gray-700 hover:text-gray-900">
              Orders
            </Link>
            <Link href="/admin/users" className="text-blue-600 font-medium">
              Users
            </Link>
            <button
              onClick={() => {
                AuthService.logout()
                router.push('/login')
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <button
            onClick={loadUsers}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {users.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Username</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === 'ADMIN'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
