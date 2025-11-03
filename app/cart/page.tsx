'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthService from '@/lib/services/authService'
import Link from 'next/link'

type CartItem = {
  productId: number
  quantity: number
  price: number
}

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [shippingAddress, setShippingAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')
  const [paymentSubMethod, setPaymentSubMethod] = useState('bkash')
  const [bkashNumber, setBkashNumber] = useState('')
  const [bkashPin, setBkashPin] = useState('')
  const [otp, setOtp] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }

    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to load cart:', error)
      }
    }

    setMounted(true)
  }, [])

  const removeFromCart = (productId: number) => {
    const updated = cart.filter(item => item.productId !== productId)
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const updated = cart.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    )
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      alert('Please enter a shipping address')
      return
    }

    if (cart.length === 0) {
      alert('Your cart is empty')
      return
    }

    if (paymentMethod === 'online') {
      if (paymentSubMethod === 'bkash') {
        if (!bkashNumber.trim()) {
          alert('Please enter your bKash/Nagad number')
          return
        }
        if (!bkashPin.trim()) {
          alert('Please enter your bKash/Nagad PIN')
          return
        }
        if (!otp.trim()) {
          alert('Please enter OTP')
          return
        }
      }
      if (paymentSubMethod === 'card' && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim())) {
        alert('Please enter complete card details')
        return
      }
    }

    const user = AuthService.getCurrentUser()
    if (!user) return

    setLoading(true)

    try {
      let paymentMethodText = 'cash on delivery'
      if (paymentMethod === 'online') {
        if (paymentSubMethod === 'bkash') {
          paymentMethodText = `bkash/nagad (${bkashNumber})`
        } else {
          paymentMethodText = `card (${cardNumber.slice(-4)})`
        }
      }

      const orderData = {
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethodText,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      }

      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create order')
      }

      const createdOrder = await response.json()
      console.log('Order created:', createdOrder)

      setCart([])
      localStorage.setItem('cart', JSON.stringify([]))
      setShippingAddress('')
      setBkashNumber('')
      setBkashPin('')
      setOtp('')
      setCardNumber('')
      setCardExpiry('')
      setCardCvv('')
      
      alert('Order placed successfully!')
      router.push('/orders')
      
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert(error.message || 'Failed to place order. Please try again.')
    } finally {
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
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            ShopHub
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/products" className="text-gray-700 hover:text-gray-900">
              Products
            </Link>
            <Link href="/cart" className="text-blue-600 font-medium">
              Cart
            </Link>
            <Link href="/orders" className="text-gray-700 hover:text-gray-900">
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link href="/products" className="text-blue-600 hover:underline font-medium">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Product ID</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.productId} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          Product #{item.productId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                            className="w-16 px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total:</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Address
                  </label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter your shipping address"
                    rows={3}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="cash_on_delivery"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Cash on Delivery</span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Online Payment</span>
                    </label>

                    {paymentMethod === 'online' && (
                      <div className="mt-3 space-y-3 pl-6 border-l-2 border-blue-500">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="payment_sub"
                            value="bkash"
                            checked={paymentSubMethod === 'bkash'}
                            onChange={(e) => setPaymentSubMethod(e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-gray-700">bKash/Nagad</span>
                        </label>

                        {paymentSubMethod === 'bkash' && (
                          <div className="space-y-3 pl-6">
                            <input
                              type="text"
                              value={bkashNumber}
                              onChange={(e) => setBkashNumber(e.target.value)}
                              placeholder="bKash/Nagad Number (e.g. 01XXXXXXXXX)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                            <input
                              type="password"
                              value={bkashPin}
                              onChange={(e) => setBkashPin(e.target.value)}
                              placeholder="Enter PIN"
                              maxLength={5}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter OTP"
                              maxLength={6}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                          </div>
                        )}

                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="payment_sub"
                            value="card"
                            checked={paymentSubMethod === 'card'}
                            onChange={(e) => setPaymentSubMethod(e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-gray-700">Card (Visa/Master)</span>
                        </label>

                        {paymentSubMethod === 'card' && (
                          <div className="space-y-3 pl-6">
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="Card Number"
                              maxLength={16}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                placeholder="MM/YY"
                                maxLength={5}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              />
                              <input
                                type="text"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                placeholder="CVV"
                                maxLength={3}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition"
                >
                  {loading ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
