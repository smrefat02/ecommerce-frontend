const API_URL = 'http://localhost:8080/api'

class ProductService {
  async getAllProducts() {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Products fetched:', data)
      return data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }

  async getProductById(id: number) {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error('Failed to fetch product')
      return response.json()
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  }

  async createProduct(productData: any) {
    try {
      const token = localStorage.getItem('token')
      
      const generateSku = () => {
        const timestamp = Date.now()
        const random = Math.floor(Math.random() * 10000)
        return `SKU-${timestamp}-${random}`
      }
      
      const payload = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        stockQuantity: parseInt(productData.stockQuantity),
        category: productData.category,
        sku: generateSku(),
        imageUrl: productData.imageUrl || null
      }
      
      console.log('Creating product with payload:', payload)
      
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Create product error:', errorText)
        throw new Error(`Failed to create product: ${response.status}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  async updateProduct(id: number, productData: any) {
    try {
      const token = localStorage.getItem('token')
      
      const payload = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        stockQuantity: parseInt(productData.stockQuantity),
        category: productData.category,
        imageUrl: productData.imageUrl || null
      }
      
      console.log('Updating product', id, 'with payload:', payload)
      
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Update product error:', errorText)
        throw new Error(`Failed to update product: ${response.status}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  async deleteProduct(id: number) {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status}`)
      }
      
      return true
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }
}

export default new ProductService()
