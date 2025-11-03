'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CartService from '@/lib/services/cartService'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')

  const handleCheckout = async () => {
    if (!address.trim()) {
      alert('Please enter shipping address')
      return
    }

    setLoading(true)
    try {
      await CartService.placeOrder(address, paymentMethod)
      await CartService.clearCart()
      alert('Order placed successfully!')
      router.push('/orders')
    } catch (error: any) {
      alert(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-slate-950 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">ShopHub</Link>
          <button onClick={() => router.push('/cart')} className="px-4 py-2 bg-blue-600 text-white rounded">Back to Cart</button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleCheckout() }} className="space-y-6">
            <div>
              <label className="block text-slate-300 font-bold mb-2">Shipping Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your shipping address" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white" required />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-2">Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white">
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="NET_BANKING">Net Banking</option>
                <option value="COD">Cash on Delivery</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-3 rounded">{loading ? 'Processing...' : 'Complete Purchase'}</button>
          </form>
        </div>
      </div>
    </main>
  )
}
