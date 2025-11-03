'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthService from '@/lib/services/authService'
import ProductService from '@/lib/services/productService'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
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

export default function ProductsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [filter, setFilter] = useState('All')
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }

    fetchProducts()
    loadCart()
    setMounted(true)
  }, [router])

  const fetchProducts = async () => {
    try {
      const data = await ProductService.getAllProducts()
      const activeProducts = Array.isArray(data) ? data.filter((p: any) => p.isActive !== false) : []
      setProducts(activeProducts)

      const initialQuantities: { [key: number]: number } = {}
      activeProducts.forEach((product: Product) => {
        initialQuantities[product.id] = 0
      })
      setQuantities(initialQuantities)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast({
        title: 'Error',
        description: 'Failed to load products',
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

  const categories = ['All', ...new Set(products.map((p) => p.category))]
  const filteredProducts = filter === 'All' ? products : products.filter((p) => p.category === filter)

  const getCartQuantity = (productId: number): number => {
    const cartItem = cart.find((item) => item.productId === productId)
    return cartItem ? cartItem.quantity : 0
  }

  const addToCart = (product: Product, quantity: number) => {
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

    setTimeout(() => {
      setQuantities((prev) => ({ ...prev, [product.id]: 0 }))
    }, 500)
  }

  if (!mounted) return null

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
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md">
              <span className="text-sm font-medium">
                {(AuthService.getCurrentUser()?.email || '').split('@')[0] || 'User'}
              </span>
            </div>
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Products</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded transition ${
                    filter === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                const cartQty = getCartQuantity(product.id)
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative flex flex-col transform"
                  >
                    {cartQty > 0 && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-10">
                        {cartQty}
                      </div>
                    )}
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={product.name}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => router.push(`/product-details?id=${product.id}`)}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image'
                      }}
                    />
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 h-14 overflow-hidden">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden line-clamp-3">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                          <span className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Stock: {product.stockQuantity}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-4">
                          <label className="text-sm text-gray-600">Qty:</label>
                          <input
                            type="number"
                            min="0"
                            max={product.stockQuantity}
                            value={quantities[product.id] ?? 0}
                            onChange={(e) =>
                              setQuantities({
                                ...quantities,
                                [product.id]: Math.max(0, Math.min(product.stockQuantity, Number.parseInt(e.target.value) || 0))
                              })
                            }
                            className="w-16 px-2 py-1 border border-gray-300 rounded bg-white text-gray-900 text-center"
                            disabled={product.stockQuantity === 0}
                          />
                        </div>

                        <button
                          onClick={() => addToCart(product, quantities[product.id] || 1)}
                          disabled={product.stockQuantity === 0}
                          className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold py-2 rounded transition"
                        >
                          {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
