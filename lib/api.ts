const API_BASE_URL = 'http://localhost:8080/api'

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('authToken')
    : null
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  }

  console.log('Request:', config.method || 'GET', url)

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Response Error:', response.status, errorData)
      
      if (response.status === 401) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
      throw new Error(errorData.message || 'Request failed')
    }

    const data = await response.json()
    console.log('Response:', response.status, data)
    
    return data

  } catch (error: any) {
    console.error('API Error:', error)
    throw error.message || 'Request failed'
  }
}

const apiClient = {
  get: (endpoint: string) => apiCall(endpoint, { method: 'GET' }),
  
  post: (endpoint: string, data: any) =>
    apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: (endpoint: string, data: any) =>
    apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (endpoint: string) => apiCall(endpoint, { method: 'DELETE' }),
}

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  CART: '/cart',
  CART_ADD: '/cart/add',
  CART_REMOVE: (id: number) => `/cart/remove/${id}`,
  CART_UPDATE: (id: number) => `/cart/update/${id}`,
  ORDERS: '/orders',
  ORDER_BY_ID: (id: number) => `/orders/${id}`,
  ADMIN_USERS: '/admin/users',
  ADMIN_DASHBOARD: '/admin/dashboard',
}

export default apiClient
