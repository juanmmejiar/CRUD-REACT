import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import ProductForm from '../components/ProductForm.jsx'
import useProducts from '../hooks/useProducts.js'
import { getById } from '../services/productService.js'

export default function ProductEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateProduct } = useProducts()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const handleSubmit = async (values) => {
    await updateProduct(id, values)
    navigate(`/productos/${id}`, {
      state: { flash: `“${values.nombre}” se actualizó correctamente.` },
    })
  }

  return (
    <>
      <PageHeader title="Editar producto" current={product?.nombre ?? 'Editar producto'} />

      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="d-flex flex-wrap align-items-end justify-content-between mb-4">
              <div>
                <h2 className="section-title position-relative mb-3">
                  {product ? `Editando “${product.nombre}”` : 'Editar producto'}
                </h2>
                <p className="text-muted-app mb-0">
                  Los cambios se guardan en este navegador.
                </p>
              </div>
              <Link className="btn btn-outline-secondary mt-3 mt-md-0" to="/productos">
                Volver al catálogo
              </Link>
            </div>

            {loading && (
              <div className="form-card" role="status" aria-live="polite">
                <span className="sr-only">Cargando producto…</span>
                <div className="skeleton mb-3" style={{ height: 48 }} />
                <div className="skeleton mb-3" style={{ height: 48 }} />
                <div className="skeleton mb-3" style={{ height: 130 }} />
                <div className="skeleton" style={{ height: 132, width: 132, borderRadius: '50%' }} />
              </div>
            )}

            {!loading && error && (
              <div className="alert-app" role="alert">
                <h3 className="h5 font-weight-bold mb-2">No pudimos cargar el producto</h3>
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
                <h3 className="h4 font-weight-bold mb-2">El producto no existe</h3>
                <p className="text-muted-app mb-4">
                  Puede que lo hayas eliminado o que el enlace esté mal.
                </p>
                <Link className="btn btn-primary" to="/productos">
                  Ver el catálogo
                </Link>
              </div>
            )}

            {!loading && !error && product && (
              <ProductForm
                key={product.id}
                initialValues={{
                  nombre: product.nombre,
                  precio: product.precio,
                  descripcion: product.descripcion,
                  imagen: product.imagen,
                }}
                onSubmit={handleSubmit}
                submitLabel="Guardar cambios"
                cancelTo={`/productos/${product.id}`}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
