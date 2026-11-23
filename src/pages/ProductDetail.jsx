import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { defaultProductImage, resolveProductImage } from '../assets/images.js'
import ConfirmModal from '../components/ConfirmModal.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Toast from '../components/Toast.jsx'
import { getById, remove } from '../services/productService.js'
import { formatPrice } from '../utils/format.js'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [toast, setToast] = useState(null)

  // Mensaje que llega desde ProductEdit después de guardar.
  useEffect(() => {
    if (location.state?.flash) {
      setToast({ message: location.state.flash, type: 'success' })
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    getById(id)
      .then((found) => {
        if (active) setProduct(found)
      })
      .catch((err) => {
        if (active) setError(err.message || 'No pudimos cargar el producto.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  const confirmDelete = async () => {
    if (!product) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await remove(product.id)
      navigate('/productos', {
        state: { flash: `“${product.nombre}” se eliminó correctamente.` },
      })
    } catch (err) {
      setDeleteError(err.message || 'No pudimos eliminar el producto.')
      setDeleting(false)
    }
  }

  return (
    <>
      <PageHeader title="Detalle" current={product?.nombre ?? 'Detalle'} />

      <div className="container py-4">
        {loading && (
          <div className="detail-card" role="status" aria-live="polite">
            <span className="sr-only">Cargando producto…</span>
            <div className="row align-items-center">
              <div className="col-md-5 mb-4 mb-md-0 text-center">
                <div className="skeleton mx-auto" style={{ width: 300, height: 300, borderRadius: '50%' }} />
              </div>
              <div className="col-md-7">
                <div className="skeleton mb-3" style={{ height: 40, width: '70%' }} />
                <div className="skeleton mb-3" style={{ height: 32, width: '35%' }} />
                <div className="skeleton mb-2" style={{ height: 18 }} />
                <div className="skeleton mb-2" style={{ height: 18 }} />
                <div className="skeleton" style={{ height: 18, width: '60%' }} />
              </div>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="alert-app" role="alert">
            <h2 className="h5 font-weight-bold mb-2">No pudimos cargar el producto</h2>
            <p className="mb-3">{error}</p>
            <Link className="btn btn-primary" to="/productos">
              Volver al catálogo
            </Link>
          </div>
        )}

        {!loading && !error && !product && (
          <div className="empty-state">
            <span className="empty-state__icon" aria-hidden="true">
              <i className="fa fa-search" />
            </span>
            <h2 className="h4 font-weight-bold mb-2">El producto no existe</h2>
            <p className="text-muted-app mb-4">
              Puede que lo hayas eliminado o que el enlace esté mal.
            </p>
            <Link className="btn btn-primary" to="/productos">
              Ver el catálogo
            </Link>
          </div>
        )}

        {!loading && !error && product && (
          <article className="detail-card">
            <div className="row align-items-center">
              <div className="col-md-5 mb-4 mb-md-0">
                <div className="detail-media">
                  <img
                    src={resolveProductImage(product.imagen)}
                    alt={product.nombre}
                    onError={(event) => {
                      event.currentTarget.src = defaultProductImage
                    }}
                  />
                </div>
              </div>

              <div className="col-md-7">
                <p className="count-badge mb-3">Helado artesanal</p>
                <h2 className="h1 font-weight-bold mb-2">{product.nombre}</h2>
                <p className="detail-price mb-4">{formatPrice(product.precio)}</p>
                <p className="detail-description">
                  {product.descripcion || 'Este producto todavía no tiene descripción.'}
                </p>

                <div className="form-actions">
                  <Link className="btn btn-primary" to={`/productos/${product.id}/editar`}>
                    Editar producto
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setDeleteError(null)
                      setConfirmOpen(true)
                    }}
                  >
                    Eliminar producto
                  </button>
                  <Link className="btn btn-outline-secondary" to="/productos">
                    Volver al catálogo
                  </Link>
                </div>
              </div>
            </div>
          </article>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Eliminar producto"
        description={
          product
            ? `¿Seguro que querés eliminar “${product.nombre}”? Esta acción no se puede deshacer.`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!deleting) {
            setConfirmOpen(false)
            setDeleteError(null)
          }
        }}
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
