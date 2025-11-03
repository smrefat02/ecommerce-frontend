'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthService from '@/lib/services/authService'
import Link from 'next/link'

type Order = {
  id: number
  user: any
  shippingAddress: string
  paymentMethod: string
  totalAmount: number
  status: string
  orderDate: string
  orderItems: any[]
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    localStorage.removeItem('orders')
    loadOrders()
    setMounted(true)
  }, [])

  const loadOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders/admin/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Orders data:', data)
        setOrders(Array.isArray(data) ? data : [])
      } else {
        console.error('Failed to load orders')
        setOrders([])
      }
    } catch (error) {
      console.error('Failed to load orders:', error)
      setOrders([])
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/admin/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        const updated = orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus.toUpperCase() } : order
        )
        setOrders(updated)
      } else {
        alert('Failed to update order status')
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update order status')
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
            <Link href="/admin/orders" className="text-blue-600 font-medium">
              Orders
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(order.orderDate).toLocaleDateString()} - {order.user?.email || 'N/A'}
                      </p>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`px-4 py-2 rounded font-medium border-0 ${
                        order.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-900'
                          : order.status === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-900'
                            : order.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-900'
                              : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div className="mb-6 pb-6 border-b">
                    <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                    {order.orderItems && order.orderItems.length > 0 ? (
                      order.orderItems.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-gray-600 text-sm mb-2">
                          <span>
                            {item.product?.name || `Product #${item.product?.id}`} x {item.quantity}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No items found</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                    <p className="text-gray-600 text-sm">{order.shippingAddress}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                    <p className="text-gray-600 text-sm">{order.paymentMethod}</p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-lg font-bold text-gray-900">
                      Total: ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
