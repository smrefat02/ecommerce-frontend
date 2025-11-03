'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthService from '@/lib/services/authService'
import ProductDetailsService from '@/lib/services/productDetailsService'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type Product = {
  id: number
  name: string
  description: string
  price: number
  stockQuantity: number
  category: string
  imageUrl: string
}

type CartItem = {
  productId: number
  quantity: number
  price: number
}

export default function ProductDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }

    const productId = searchParams.get('id')
    if (productId) {
      fetchProduct(parseInt(productId))
    }
    loadCart()
  }, [router, searchParams])

  const fetchProduct = async (id: number) => {
    try {
      const data = await ProductDetailsService.getProductById(id)
      setProduct(data)
    } catch (error) {
      console.error('Failed to fetch product:', error)
      toast({
        title: 'Error',
        description: 'Failed to load product details',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to load cart:', error)
      }
    }
  }

  const saveCart = (updatedCart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setCart(updatedCart)
  }

  const addToCart = () => {
    if (!product) return

    if (quantity <= 0) {
      toast({
        title: 'Invalid Quantity',
        description: 'Please select a quantity greater than 0.',
        variant: 'destructive'
      })
      return
    }

    if (quantity > product.stockQuantity) {
      toast({
        title: 'Insufficient Stock',
        description: `Only ${product.stockQuantity} items available.`,
        variant: 'destructive'
      })
      return
    }

    const existingItem = cart.find((item) => item.productId === product.id)

    let updatedCart
    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    } else {
      updatedCart = [...cart, { productId: product.id, quantity, price: product.price }]
    }

    saveCart(updatedCart)

    toast({
      title: 'Added to Cart',
      description: `${quantity} x ${product.name} has been added to your cart.`
    })

    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Product not found</p>
          <Link href="/products" className="text-blue-600 hover:text-blue-700">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:opacity-80 transition">
            ShopHub
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/cart" className="hover:opacity-80 transition flex items-center gap-2 text-gray-700">
              <ShoppingCart size={24} />
              <span>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
            </Link>
            <Link href="/orders" className="hover:opacity-80 transition text-gray-700">
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
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={20} />
          Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/600x600?text=No+Image'}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x600?text=No+Image'
                }}
              />
            </div>

            <div className="p-8 flex flex-col">
              <div className="flex-grow">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                  {product.category}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-3xl font-bold text-blue-600 mb-6">${product.price.toFixed(2)}</p>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">Availability:</span>
                    <span
                      className={`font-semibold ${
                        product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {product.stockQuantity > 0
                        ? `${product.stockQuantity} in stock`
                        : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-center gap-4 mb-6">
                  <label className="text-gray-700 font-medium">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                      disabled={product.stockQuantity === 0}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stockQuantity}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, Math.min(product.stockQuantity, parseInt(e.target.value) || 1)))
                      }
                      className="w-20 px-4 py-2 text-center border-x border-gray-300"
                      disabled={product.stockQuantity === 0}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                      disabled={product.stockQuantity === 0}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={addToCart}
                  disabled={product.stockQuantity === 0}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold py-4 rounded-lg text-lg transition"
                >
                  {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
