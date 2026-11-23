import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const SOCIALS = [
  { icon: 'fa-instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
  { icon: 'fa-facebook-f', label: 'Facebook', href: 'https://www.facebook.com/' },
  { icon: 'fa-twitter', label: 'Twitter', href: 'https://twitter.com/' },
  { icon: 'fa-youtube', label: 'YouTube', href: 'https://www.youtube.com/' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // En móvil, el menú se cierra al cambiar de ruta.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  const close = () => setOpen(false)

  return (
    <>
      {/* Topbar: contacto y redes, oculta en móvil como en la plantilla */}
      <div className="container-fluid app-topbar py-3 d-none d-md-block">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-7 text-center text-lg-left mb-2 mb-lg-0">
              <div className="d-inline-flex flex-wrap align-items-center text-white app-topbar__meta">
                <span className="pr-3">Helados artesanales desde 1950</span>
                <span className="d-none d-lg-inline" aria-hidden="true">|</span>
                <a className="text-white px-3" href="tel:+01234567890">
                  +012 345 67890
                </a>
                <span className="d-none d-lg-inline" aria-hidden="true">|</span>
                <span className="pl-3">Mon – Sat, 8AM – 5PM</span>
              </div>
            </div>
            <div className="col-md-5 text-center text-lg-right">
              <div className="d-inline-flex align-items-center">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    className="text-white px-2"
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`iCREAM en ${social.label}`}
                  >
                    <i className={`fab ${social.icon}`} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar con marca centrada y dos grupos de enlaces */}
      <div className="container-fluid position-relative nav-bar p-0">
        <div className="container-lg position-relative p-0 px-lg-3 app-navbar-wrap">
          <nav className="navbar navbar-expand-lg bg-white navbar-light shadow p-lg-0" aria-label="Navegación principal">
            <Link to="/" className="navbar-brand d-block d-lg-none" onClick={close}>
              <span className="h1 m-0 display-4 text-primary d-block">
                <span className="text-secondary">i</span>CREAM
              </span>
            </Link>

            <button
              type="button"
              className="navbar-toggler"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="navbarCollapse"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className={`collapse navbar-collapse justify-content-between${open ? ' show' : ''}`} id="navbarCollapse">
              <div className="navbar-nav ml-auto py-0">
                <NavLink to="/" end className="nav-item nav-link" onClick={close}>
                  Home
                </NavLink>
                <Link to="/#nosotros" className="nav-item nav-link" onClick={close}>
                  Nosotros
                </Link>
                <NavLink to="/productos" className="nav-item nav-link" onClick={close}>
                  Productos
                </NavLink>
              </div>

              <Link to="/" className="navbar-brand mx-5 d-none d-lg-block" aria-label="iCREAM, inicio">
                <span className="h1 m-0 display-4 text-primary d-block">
                  <span className="text-secondary">i</span>CREAM
                </span>
              </Link>

              <div className="navbar-nav mr-auto py-0">
                <NavLink to="/productos/nuevo" className="nav-item nav-link nav-link--cta" onClick={close}>
                  + Nuevo producto
                </NavLink>
                <Link to="/#contacto" className="nav-item nav-link" onClick={close}>
                  Contacto
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
