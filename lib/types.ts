// Database types and interfaces for the e-commerce system

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: "customer" | "admin"
  verified: boolean
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  createdAt: string
}

export interface CartItem {
  productId: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalPrice: number
  status: "pending" | "processing" | "shipped" | "delivered"
  shippingAddress: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
}
