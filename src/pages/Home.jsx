import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { aboutPhoto, heroSlides, promotionPhoto } from '../assets/images.js'
import ProductList from '../components/ProductList.jsx'
import useProducts from '../hooks/useProducts.js'
import { formatPrice } from '../utils/format.js'

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const FEATURED_COUNT = 5

function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(() => !prefersReducedMotion())
  const [hovered, setHovered] = useState(false)

  const goTo = useCallback((nextIndex) => {
    setIndex((nextIndex + heroSlides.length) % heroSlides.length)
  }, [])

  // Autoplay pausable (hover, foco o preferencia de movimiento reducido).
  useEffect(() => {
    if (!autoplay || hovered) return undefined
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [autoplay, hovered])

  const slide = heroSlides[index]

  return (
    <section
      aria-label="Helados destacados"
      className="container-fluid p-0 mb-5 pb-5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div
        id="header-carousel"
        className="carousel slide"
        aria-roledescription="carousel"
      >
        <div className="carousel-inner">
          <div
            className="carousel-item active hero-slide"
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${heroSlides.length}`}
          >
            <img className="w-100" src={slide.image} alt="" />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3" style={{ maxWidth: 900 }}>
                <p className="text-white text-uppercase mb-md-3">{slide.subtitle}</p>
                <h1 className="display-3 text-white mb-md-4">{slide.title}</h1>
                <Link to="/productos" className="btn btn-primary py-md-3 px-md-5 mt-2">
                  See our flavours
                </Link>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="carousel-control-prev hero-control"
          aria-label="Slide anterior"
          onClick={() => goTo(index - 1)}
        >
          <span className="btn btn-secondary px-0">
            <span className="carousel-control-prev-icon mb-n1" aria-hidden="true" />
          </span>
        </button>
        <button
          type="button"
          className="carousel-control-next hero-control"
          aria-label="Slide siguiente"
          onClick={() => goTo(index + 1)}
        >
          <span className="btn btn-secondary px-0">
            <span className="carousel-control-next-icon mb-n1" aria-hidden="true" />
          </span>
        </button>

        <button
          type="button"
          className="hero-autoplay"
          aria-pressed={autoplay}
          onClick={() => setAutoplay((value) => !value)}
        >
          <i className={`fa ${autoplay ? 'fa-pause' : 'fa-play'} mr-2`} aria-hidden="true" />
          {autoplay ? 'Pausar' : 'Reproducir'}
        </button>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="nosotros" className="container-fluid py-5">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="section-title position-relative text-center mb-5">
              Traditional &amp; Delicious Ice Cream Since 1950
            </h2>
          </div>
        </div>
        <div className="row align-items-center">
          <div className="col-lg-4 py-4 py-lg-5">
            <h3 className="h4 font-weight-bold mb-3">About Us</h3>
            <p className="text-muted-app">
              We churn small batches every morning with organic milk from nearby farms and fruit
              from the market. No shortcuts, no artificial flavours: just the ice cream we grew up
              with.
            </p>
            <Link to="/productos" className="btn btn-secondary mt-2">
              Meet the flavours
            </Link>
          </div>
          <div className="col-lg-4 my-4 my-lg-0" style={{ minHeight: 400 }}>
            <div className="position-relative h-100 rounded overflow-hidden">
              <img
                className="position-absolute w-100 h-100"
                src={aboutPhoto}
                alt="Interior de la heladería iCREAM"
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          </div>
          <div className="col-lg-4 py-4 py-lg-5">
            <h3 className="h4 font-weight-bold mb-3">Our Features</h3>
            <p className="text-muted-app">
              Everything starts with good ingredients and a slow churn. That is why our texture
              stays creamy and our flavours taste like the real thing.
            </p>
            <ul className="list-unstyled mb-0">
              {[
                'Organic milk, churned daily',
                'Seasonal fruit from local growers',
                'Vegan and no-added-sugar options',
              ].map((feature) => (
                <li className="text-muted-app mb-3" key={feature}>
                  <i className="fa fa-check text-secondary mr-3" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function Promotion({ fromPrice }) {
  return (
    <section className="container-fluid my-5 py-5 px-0" aria-label="Promoción">
      <div className="row bg-primary m-0">
        <div className="col-md-6 px-0" style={{ minHeight: 500 }}>
          <div className="position-relative h-100">
            <img
              className="position-absolute w-100 h-100"
              src={promotionPhoto}
              alt="Helado artesanal servido en cono"
              style={{ objectFit: 'cover' }}
              loading="lazy"
            />
          </div>
        </div>
        <div className="col-md-6 py-5 py-md-0 px-0">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center p-5">
            <div className="d-flex align-items-center justify-content-center bg-white rounded-circle mb-4 promotion-price">
              <span className="h4 font-weight-bold text-primary mb-0">
                {fromPrice ? `From ${fromPrice}` : 'Handmade'}
              </span>
            </div>
            <h2 className="h3 font-weight-bold text-white mt-3 mb-4">Ice Cream For Every Mood</h2>
            <p className="text-white mb-4">
              Classic scoops, vegan favourites and limited seasonal batches. Build your box and
              pick it up at the shop.
            </p>
            <Link to="/productos" className="btn btn-secondary py-3 px-5 mt-2">
              Browse the catalogue
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { products, loading, error, reload } = useProducts()
  const featured = products.slice(0, FEATURED_COUNT)
  const fromPrice = products.length
    ? formatPrice(Math.min(...products.map((product) => Number(product.precio))))
    : null

  return (
    <>
      <HeroCarousel />
      <About />
      <Promotion fromPrice={fromPrice} />

      <section className="container-fluid py-5" aria-labelledby="featured-title">
        <div className="container py-4">
          <div className="row align-items-end mb-4">
            <div className="col-lg-8 mb-3 mb-lg-0">
              <h2 id="featured-title" className="section-title position-relative mb-3">
                Best Prices We Offer For Ice Cream Lovers
              </h2>
              <p className="text-muted-app mb-0">
                Small batches, honest prices and a rotating menu of seasonal flavours.
              </p>
            </div>
            <div className="col-lg-4 text-lg-right">
              <Link to="/productos" className="btn btn-outline-secondary">
                View all flavours
              </Link>
            </div>
          </div>

          <ProductList
            products={featured}
            loading={loading}
            error={error}
            onRetry={reload}
            showDescription
          />
        </div>
      </section>
    </>
  )
}
