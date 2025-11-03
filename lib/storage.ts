// Storage utilities for managing data with localStorage

import type { User, Product, Order, CartItem } from "./types"

const STORAGE_KEYS = {
  USERS: "ecommerce_users",
  PRODUCTS: "ecommerce_products",
  ORDERS: "ecommerce_orders",
  CURRENT_USER: "ecommerce_current_user",
  CART: "ecommerce_cart",
  VERSION: "ecommerce_version",
  VERIFICATION_CODES: "ecommerce_verification_codes",
}

const CURRENT_VERSION = "2"

// Initialize default data
export function initializeStorage() {
  if (typeof window === "undefined") return

  try {
    // Only set defaults if not present
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      const defaultUsers: User[] = [
        {
          id: "1",
          email: "admin@example.com",
          password: "admin123",
          name: "Admin User",
          role: "admin",
          verified: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          email: "customer@example.com",
          password: "customer123",
          name: "John Doe",
          role: "customer",
          verified: true,
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      const defaultProducts: Product[] = [
        {
          id: "1",
          name: "Wireless Headphones",
          description: "High-quality wireless headphones with noise cancellation",
          price: 11499,
          image: "/wireless-headphones.png",
          category: "Electronics",
          stock: 50,
          createdAt: new Date().toISOString(),
        },
        {
        id: "2",
        name: "USB-C Cable",
        description: "Durable USB-C charging cable",
        price: 2299,
        image: "/usb-c-cable.jpg",
        category: "Accessories",
        stock: 100,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Laptop Stand",
        description: "Adjustable aluminum laptop stand",
        price: 5749,
        image: "/laptop-stand.png",
        category: "Office",
        stock: 30,
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        name: "Mechanical Keyboard",
        description: "RGB mechanical keyboard with custom switches",
        price: 17249,
        image: "/mechanical-keyboard.png",
        category: "Electronics",
        stock: 25,
        createdAt: new Date().toISOString(),
      },
      {
        id: "5",
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with precision tracking",
        price: 4599,
        image: "/wireless-mouse.png",
        category: "Electronics",
        stock: 60,
        createdAt: new Date().toISOString(),
      },
      {
        id: "6",
        name: "Monitor Arm",
        description: "Adjustable dual monitor arm mount",
        price: 9199,
        image: "/monitor-arm.jpg",
        category: "Office",
        stock: 20,
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts))
    }
  } catch (e) {
    console.error('Error initializing storage:', e)
  }
}

// User operations
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.USERS)
  return data ? JSON.parse(data) : []
}

export function saveUsers(users: User[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email)
}

// Product operations
export function getProducts(): Product[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
  return data ? JSON.parse(data) : []
}

export function saveProducts(products: Product[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id)
}

// Order operations
export function getOrders(): Order[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS)
  return data ? JSON.parse(data) : []
}

export function saveOrders(orders: Order[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
}

export function getUserOrders(userId: string): Order[] {
  return getOrders().filter((o) => o.userId === userId)
}

// Cart operations
export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.CART)
  return data ? JSON.parse(data) : []
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart))
}

// Auth operations
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return data ? JSON.parse(data) : null
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

// Verification codes operations
export function getVerificationCodes(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const data = localStorage.getItem(STORAGE_KEYS.VERIFICATION_CODES)
  return data ? JSON.parse(data) : {}
}

export function saveVerificationCodes(codes: Record<string, string>) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.VERIFICATION_CODES, JSON.stringify(codes))
}
