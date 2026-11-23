import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-3 text-primary">404</h1>
      <p className="lead">No encontramos esta página.</p>
      <Link className="btn btn-primary" to="/">
        Volver al inicio
      </Link>
    </div>
  )
}
