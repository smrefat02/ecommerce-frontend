'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthService from '@/lib/services/authService'
import Link from 'next/link'

export default function AdminProductsPage() {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockQuantity: '',
    sku: '',
    imageUrl: ''
  })

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    loadProducts()
  }, [router])

  const loadProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('authToken')
      
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stockQuantity: parseInt(formData.stockQuantity),
        sku: formData.sku,
        imageUrl: formData.imageUrl || ''
      }

      const url = editingId 
        ? `http://localhost:8080/api/products/${editingId}`
        : 'http://localhost:8080/api/products'
      
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save product')
      }

      const data = await response.json()
      console.log('Product saved:', data)
      
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stockQuantity: '',
        sku: '',
        imageUrl: ''
      })
      setEditingId(null)
      setShowForm(false)
      loadProducts()
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to save product')
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const token = localStorage.getItem('authToken')
      
      const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        loadProducts()
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting product')
    }
  }

  const handleEditClick = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stockQuantity: product.stockQuantity.toString(),
      sku: product.sku,
      imageUrl: product.imageUrl || ''
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stockQuantity: '',
      sku: '',
      imageUrl: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ShopHub Admin</h1>
          <button
            onClick={() => router.push('/admin')}
            className="text-gray-700 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Product Management</h2>

        <button
          onClick={() => {
            setEditingId(null)
            setFormData({
              name: '',
              description: '',
              price: '',
              category: '',
              stockQuantity: '',
              sku: '',
              imageUrl: ''
            })
            setShowForm(!showForm)
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-8"
        >
          Add Product
        </button>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-2 border rounded"
                step="0.01"
                required
              />
              <input
                type="text"
                placeholder="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full px-4 py-2 border rounded"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {editingId ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-bold text-green-600">${product.price}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stockQuantity}</p>
                </div>
                <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
                <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !showForm && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}
