import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import ProductList from '../components/ProductList.jsx'
import useProducts from '../hooks/useProducts.js'

export default function Products() {
  const { products, loading, error, reload } = useProducts()

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
              <Link
                className="btn btn-sm btn-outline-secondary"
                to={`/productos/${product.id}/editar`}
                aria-label={`Editar ${product.nombre}`}
              >
                Editar
              </Link>
            )}
          />
        </div>
      </div>
    </>
  )
}
