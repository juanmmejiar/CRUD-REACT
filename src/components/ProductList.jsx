import { Link } from 'react-router-dom'
import ProductCard from './ProductCard.jsx'

function ProductSkeletons() {
  return (
    <div className="row" aria-hidden="true">
      {[0, 1, 2, 3].map((item) => (
        <div className="col-lg-3 col-md-6 mb-4 pb-2" key={item}>
          <div className="skeleton skeleton-card" />
        </div>
      ))}
    </div>
  )
}

/**
 * Lista con los cuatro estados del catálogo:
 * cargando, error, vacío y datos.
 */
export default function ProductList({
  products,
  loading,
  error,
  onRetry,
  renderActions,
  showDescription = true,
  emptyAction,
}) {
  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <span className="sr-only">Cargando productos…</span>
        <ProductSkeletons />
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert-app" role="alert">
        <h2 className="h5 font-weight-bold mb-2">No pudimos cargar los helados</h2>
        <p className="mb-3">{error}</p>
        {onRetry && (
          <button type="button" className="btn btn-primary btn-sm" onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon" aria-hidden="true">
          <i className="fa fa-ice-cream" />
        </span>
        <h2 className="h4 font-weight-bold mb-2">Todavía no hay helados</h2>
        <p className="text-muted-app mb-4">
          Sumá tu primer producto para empezar a armar el catálogo.
        </p>
        {emptyAction ?? (
          <Link className="btn btn-primary" to="/productos/nuevo">
            Crear el primero
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="row">
      {products.map((product) => (
        <div className="col-lg-3 col-md-6 mb-4 pb-2 d-flex" key={product.id}>
          <ProductCard
            product={product}
            showDescription={showDescription}
            actions={renderActions ? renderActions(product) : null}
          />
        </div>
      ))}
    </div>
  )
}
