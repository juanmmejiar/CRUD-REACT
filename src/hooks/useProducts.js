import { useCallback, useEffect, useState } from 'react'
import * as productService from '../services/productService.js'

/**
 * Estado del catálogo + operaciones CRUD.
 * Centraliza loading/error para que las páginas no repitan lógica.
 */
export default function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setProducts(await productService.getAll())
    } catch (err) {
      setError(err.message || 'No pudimos cargar los productos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const createProduct = useCallback(async (data) => {
    const created = await productService.create(data)
    setProducts((current) => [created, ...current])
    return created
  }, [])

  const updateProduct = useCallback(async (id, data) => {
    const updated = await productService.update(id, data)
    setProducts((current) =>
      current.map((product) => (product.id === id ? updated : product)),
    )
    return updated
  }, [])

  const removeProduct = useCallback(async (id) => {
    await productService.remove(id)
    setProducts((current) => current.filter((product) => product.id !== id))
  }, [])

  return {
    products,
    loading,
    error,
    reload: load,
    createProduct,
    updateProduct,
    removeProduct,
  }
}
