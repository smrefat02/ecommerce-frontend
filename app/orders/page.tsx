'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthService from '@/lib/services/authService'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

type Order = {
  id: number
  shippingAddress: string
  paymentMethod: string
  totalAmount: number
  status: string
  orderDate: string
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }

    loadOrders()
    setMounted(true)
  }, [])

  const loadOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrders(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Failed to load orders:', error)
      setOrders([])
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-slate-950 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-slate-300">
            ShopHub
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/products" className="text-blue-400 hover:text-blue-300">
              Products
            </Link>
            <Link href="/cart" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
              <ShoppingCart size={20} />
              Cart
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
        <h1 className="text-4xl font-bold text-white mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-xl mb-6">You have not placed any orders yet</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Order #{order.id}</h3>
                    <p className="text-slate-400">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded font-bold ${
                      order.status === 'DELIVERED'
                        ? 'bg-green-900 text-green-100'
                        : order.status === 'SHIPPED'
                          ? 'bg-blue-900 text-blue-100'
                          : order.status === 'PENDING'
                            ? 'bg-yellow-900 text-yellow-100'
                            : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-slate-700 pt-4 mb-4">
                  <p className="text-slate-400 mb-2">
                    <strong>Shipping Address:</strong>
                  </p>
                  <p className="text-slate-300">{order.shippingAddress}</p>
                </div>

                <div className="border-t border-slate-700 pt-4 mb-4">
                  <p className="text-slate-400 mb-2">
                    <strong>Payment Method:</strong>
                  </p>
                  <p className="text-slate-300">{order.paymentMethod}</p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">
                    Total: ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
