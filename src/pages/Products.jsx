import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal.jsx'
import PageHeader from '../components/PageHeader.jsx'
import ProductList from '../components/ProductList.jsx'
import Toast from '../components/Toast.jsx'
import useProducts from '../hooks/useProducts.js'

export default function Products() {
  const { products, loading, error, reload, removeProduct } = useProducts()
  const location = useLocation()
  const navigate = useNavigate()
  const [productToDelete, setProductToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [toast, setToast] = useState(null)

  // Recoge el mensaje que dejan las páginas de crear/editar/eliminar.
  useEffect(() => {
    if (location.state?.flash) {
      setToast({ message: location.state.flash, type: 'success' })
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const openDelete = (product) => {
    setProductToDelete(product)
    setDeleteError(null)
  }

  const closeDelete = () => {
    if (deleting) return
    setProductToDelete(null)
    setDeleteError(null)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await removeProduct(productToDelete.id)
      setToast({
        message: `“${productToDelete.nombre}” se eliminó correctamente.`,
        type: 'success',
      })
      setProductToDelete(null)
    } catch (err) {
      setDeleteError(err.message || 'No pudimos eliminar el producto.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <PageHeader title="Productos" />

      <div className="container-fluid py-5">
        <div className="container py-4">
          <div className="row align-items-end mb-4">
            <div className="col-lg-8 mb-3 mb-lg-0">
              <h2 className="section-title position-relative mb-3">Nuestros helados</h2>
              <p className="text-muted-app mb-0">
                Administrá el catálogo: creá, editá o eliminá productos. Los cambios se guardan
                en este navegador.
              </p>
            </div>
            <div className="col-lg-4 text-lg-right">
              <Link className="btn btn-primary" to="/productos/nuevo">
                + Nuevo producto
              </Link>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between mb-4">
            {!loading && !error ? (
              <span className="count-badge" aria-live="polite">
                {products.length} {products.length === 1 ? 'producto' : 'productos'}
              </span>
            ) : (
              <span />
            )}
          </div>

          <ProductList
            products={products}
            loading={loading}
            error={error}
            onRetry={reload}
            renderActions={(product) => (
              <>
                <Link
                  className="btn btn-sm btn-outline-secondary"
                  to={`/productos/${product.id}/editar`}
                  aria-label={`Editar ${product.nombre}`}
                >
                  Editar
                </Link>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => openDelete(product)}
                  aria-label={`Eliminar ${product.nombre}`}
                >
                  Eliminar
                </button>
              </>
            )}
          />
        </div>
      </div>

      <ConfirmModal
        open={Boolean(productToDelete)}
        title="Eliminar producto"
        description={
          productToDelete
            ? `¿Seguro que querés eliminar “${productToDelete.nombre}”? Esta acción no se puede deshacer.`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={closeDelete}
        loading={deleting}
        error={deleteError}
      />

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </>
  )
}
