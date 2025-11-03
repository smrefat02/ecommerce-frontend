const API_BASE_URL = 'http://localhost:8080/api'

const ProductDetailsService = {
  async getProductById(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  }
}

export default ProductDetailsService
