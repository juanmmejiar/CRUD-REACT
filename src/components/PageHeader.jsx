import { Link } from 'react-router-dom'

export default function PageHeader({ title, current }) {
  return (
    <div className="jumbotron jumbotron-fluid page-header app-page-header">
      <div className="container text-center py-5">
        <h1 className="text-white display-3 mt-lg-5">{title}</h1>
        <nav aria-label="Miga de pan">
          <div className="d-inline-flex align-items-center text-white">
            <Link className="text-white" to="/">
              Home
            </Link>
            <i className="fa fa-circle px-3" aria-hidden="true" />
            <span aria-current="page">{current ?? title}</span>
          </div>
        </nav>
      </div>
    </div>
  )
}
