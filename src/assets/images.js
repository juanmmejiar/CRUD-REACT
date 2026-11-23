import aboutImage from './img/about.jpg'
import carousel1 from './img/carousel-1.jpg'
import carousel2 from './img/carousel-2.jpg'
import product1 from './img/product-1.jpg'
import product2 from './img/product-2.jpg'
import product3 from './img/product-3.jpg'
import product4 from './img/product-4.jpg'
import product5 from './img/product-5.jpg'
import promotionImage from './img/promotion.jpg'

// Imágenes de la plantilla importadas por Vite (URLs con hash en el build).
export const heroSlides = [
  {
    image: carousel1,
    title: 'Traditional Ice Cream Since 1950',
    subtitle: 'Traditional & Delicious',
  },
  {
    image: carousel2,
    title: 'Made From Our Own Organic Milk',
    subtitle: 'Traditional & Delicious',
  },
]

export const aboutPhoto = aboutImage
export const promotionPhoto = promotionImage

export const productImageOptions = [
  { value: 'product-1.jpg', label: 'Imagen 1', src: product1 },
  { value: 'product-2.jpg', label: 'Imagen 2', src: product2 },
  { value: 'product-3.jpg', label: 'Imagen 3', src: product3 },
  { value: 'product-4.jpg', label: 'Imagen 4', src: product4 },
  { value: 'product-5.jpg', label: 'Imagen 5', src: product5 },
]

export const defaultProductImage = product1

const productImageMap = Object.fromEntries(
  productImageOptions.map((option) => [option.value, option.src]),
)

/**
 * Resuelve el campo `imagen` de un producto:
 * - clave de la galería ("product-1.jpg") -> asset de Vite
 * - URL externa -> se usa tal cual
 * - vacío -> imagen por defecto
 */
export function resolveProductImage(value) {
  if (!value) return defaultProductImage
  return productImageMap[value] ?? value
}
