"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AuthService from "@/lib/services/authService"
import Link from "next/link"

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  const backgroundImages = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&h=900&fit=crop",
    "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=1600&h=900&fit=crop",
    "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1600&h=900&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&h=900&fit=crop",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1600&h=900&fit=crop"
  ]

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
    setMounted(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            ShopHub
          </Link>
          <div className="flex gap-6 items-center">
            {user ? (
              <>
                <span className="text-sm text-gray-700">{user.email}</span>
                {user.role === "ADMIN" && (
                  <Link href="/admin" className="text-gray-700 hover:text-gray-900">
                    Admin
                  </Link>
                )}
                <Link href="/products" className="text-gray-700 hover:text-gray-900">
                  Products
                </Link>
                <Link href="/orders" className="text-gray-700 hover:text-gray-900">
                  Orders
                </Link>
                <Link href="/cart" className="text-gray-700 hover:text-gray-900">
                  Cart
                </Link>
                <button
                  onClick={() => {
                    AuthService.logout()
                    router.push("/login")
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/products" className="text-gray-700 hover:text-gray-900">
                  Products
                </Link>
                <Link href="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="relative h-[600px] overflow-hidden">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Premium Tech Products
            </h2>
            <p className="text-xl text-gray-100 mb-12 max-w-2xl mx-auto animate-fade-in-delay">
              Discover our curated collection of the finest technology products, carefully selected for quality and innovation.
            </p>
            {user ? (
              <Link
                href="/products"
                className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition shadow-lg animate-fade-in-delay-2"
              >
                Start Shopping
              </Link>
            ) : (
              <div className="flex gap-4 justify-center flex-wrap animate-fade-in-delay-2">
                <Link
                  href="/login"
                  className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition shadow-lg"
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg border-2 border-white hover:bg-blue-700 transition shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Wide Selection</h3>
            <p className="text-gray-600 text-center">Browse hundreds of premium tech products from trusted brands</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Secure Checkout</h3>
            <p className="text-gray-600 text-center">Safe and easy payment processing with industry-standard security</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Fast Shipping</h3>
            <p className="text-gray-600 text-center">Quick and reliable delivery to your doorstep</p>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">ShopHub</h4>
              <p className="text-sm">Your destination for premium tech products</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Shop</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <Link href="/products" className="hover:text-white">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-white">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Account</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <Link href="/login" className="hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="hover:text-white">
                    Orders
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.3s both;
        }
        .animate-fade-in-delay-2 {
          animation: fadeIn 1s ease-out 0.6s both;
        }
      `}</style>
    </main>
  )
}
