import { Link } from 'react-router-dom'

const SOCIALS = [
  { icon: 'fa-instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
  { icon: 'fa-facebook-f', label: 'Facebook', href: 'https://www.facebook.com/' },
  { icon: 'fa-twitter', label: 'Twitter', href: 'https://twitter.com/' },
  { icon: 'fa-linkedin-in', label: 'LinkedIn', href: 'https://www.linkedin.com/' },
]

export default function Footer() {
  return (
    <footer id="contacto" className="container-fluid footer bg-light py-5 app-footer">
      <div className="container text-center py-5">
        <div className="row">
          <div className="col-12 mb-4">
            <Link to="/" className="navbar-brand m-0" aria-label="iCREAM, inicio">
              <span className="h1 m-0 mt-n2 display-4 text-primary d-block">
                <span className="text-secondary">i</span>CREAM
              </span>
            </Link>
          </div>

          <div className="col-12 mb-4">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                className="btn btn-outline-secondary btn-social mr-2 mb-2"
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`iCREAM en ${social.label}`}
              >
                <i className={`fab ${social.icon}`} aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className="col-12 mt-2 mb-4">
            <div className="row">
              <div className="col-sm-6 text-center text-sm-right border-right mb-3 mb-sm-0">
                <h2 className="h5 font-weight-bold mb-2">Get In Touch</h2>
                <address className="mb-2">123 Street, New York, USA</address>
                <p className="mb-0">
                  <a href="tel:+01234567890">+012 345 67890</a>
                </p>
              </div>
              <div className="col-sm-6 text-center text-sm-left">
                <h2 className="h5 font-weight-bold mb-2">Opening Hours</h2>
                <p className="mb-2">Mon – Sat, 8AM – 5PM</p>
                <p className="mb-0">Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div className="col-12">
            <p className="m-0">
              &copy; {new Date().getFullYear()} iCREAM. All Rights Reserved. Designed by{' '}
              <a href="https://htmlcodex.com" target="_blank" rel="noreferrer">
                HTML Codex
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
