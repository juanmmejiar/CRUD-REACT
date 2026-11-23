import { Link } from 'react-router-dom'
import { defaultProductImage, resolveProductImage } from '../assets/images.js'
import { formatPrice } from '../utils/format.js'

/**
 * Tarjeta reutilizable del catálogo. `actions` permite sumar los botones
 * de editar/eliminar sin duplicar el markup en cada página.
 */
export default function ProductCard({ product, showDescription = false, actions = null }) {
  const { id, nombre, precio, descripcion, imagen } = product

  const handleImageError = (event) => {
    if (event.currentTarget.src !== defaultProductImage) {
      event.currentTarget.src = defaultProductImage
    }
  }

  return (
    <article className="product-item d-flex flex-column align-items-center text-center bg-light rounded py-5 px-3 w-100">
      <div className="bg-primary mt-n5 py-3 price-badge">
        <span className="price-badge__value d-block">{formatPrice(precio)}</span>
      </div>

      <Link
        to={`/productos/${id}`}
        className="position-relative bg-primary rounded-circle mt-n3 mb-4 p-3 product-media"
        aria-label={`Ver detalle de ${nombre}`}
      >
        <img
          className="rounded-circle w-100 h-100"
          src={resolveProductImage(imagen)}
          alt={nombre}
          style={{ objectFit: 'cover' }}
          loading="lazy"
          onError={handleImageError}
        />
      </Link>

      <h3 className="h5 font-weight-bold mb-4 product-name">
        <Link to={`/productos/${id}`} className="text-reset">
          {nombre}
        </Link>
      </h3>

      {showDescription && (
        <p className="product-copy">{descripcion || 'Sin descripción todavía.'}</p>
      )}

      <div className="product-actions">
        <Link to={`/productos/${id}`} className="btn btn-sm btn-secondary">
          Ver helado
        </Link>
        {actions}
      </div>
    </article>
  )
}
