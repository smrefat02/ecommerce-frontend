import apiClient, { API_ENDPOINTS } from '../api'

export interface CartItem {
  id: number
  productId: number
  productName: string
  quantity: number
  price: number
}

export interface Cart {
  items: CartItem[]
  totalAmount: number
}

export interface Order {
  id: number
  shippingAddress: string
  paymentMethod: string
  totalAmount: number
  status: string
}

const CartService = {
  getCart: async (): Promise<Cart> => {
    try {
      const data = await apiClient.get(API_ENDPOINTS.CART)
      return data
    } catch (error: any) {
      throw error || 'Failed to fetch cart'
    }
  },

  addToCart: async (productId: number, quantity: number = 1) => {
    try {
      const data = await apiClient.post(API_ENDPOINTS.CART_ADD, {
        productId,
        quantity
      })
      return data
    } catch (error: any) {
      throw error || 'Failed to add to cart'
    }
  },

  updateQuantity: async (itemId: number, quantity: number) => {
    try {
      const data = await apiClient.put(API_ENDPOINTS.CART_UPDATE(itemId), {
        quantity
      })
      return data
    } catch (error: any) {
      throw error || 'Failed to update cart'
    }
  },

  removeItem: async (itemId: number) => {
    try {
      const data = await apiClient.delete(API_ENDPOINTS.CART_REMOVE(itemId))
      return data
    } catch (error: any) {
      throw error || 'Failed to remove item'
    }
  },

  clearCart: async () => {
    try {
      const data = await apiClient.delete(API_ENDPOINTS.CART)
      return data
    } catch (error: any) {
      throw error || 'Failed to clear cart'
    }
  },

  placeOrder: async (shippingAddress: string, paymentMethod: string): Promise<Order> => {
    try {
      const data = await apiClient.post(API_ENDPOINTS.ORDERS, {
        shippingAddress,
        paymentMethod
      })
      return data
    } catch (error: any) {
      throw error || 'Failed to place order'
    }
  }
}

export default CartService
