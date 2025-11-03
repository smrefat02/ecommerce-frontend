'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AuthService from '@/lib/services/authService'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  })
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadStats = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        router.push('/login')
        setLoading(false)
        return
      }

      const response = await fetch('http://localhost:8080/api/dashboard/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      setStats({
        totalProducts: data.totalProducts || 0,
        totalOrders: data.totalOrders || 0,
        totalUsers: data.userCount || 0,
        totalRevenue: data.totalRevenue || 0,
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    loadStats()
    setMounted(true)
  }, [loadStats, router])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const user = AuthService.getCurrentUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ShopHub Admin</h1>
          <div className="flex gap-4 items-center">
            <span className="text-gray-700">Welcome, {user?.username}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">${parseFloat(String(stats.totalRevenue || 0)).toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/products"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center font-medium text-gray-700 transition"
            >
              Manage Products
            </Link>
            <Link
              href="/admin/orders"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center font-medium text-gray-700 transition"
            >
              View Orders
            </Link>
            <Link
              href="/admin/users"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center font-medium text-gray-700 transition"
            >
              Manage Users
            </Link>
            <button
              onClick={loadStats}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 font-medium text-gray-700 transition disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Stats'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Info</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Username:</span> {user?.username}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Role:</span>
              <span className="text-blue-600 font-medium ml-2">{user?.role}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
