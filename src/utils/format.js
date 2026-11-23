// Formato de precio para la UI (sin depender de la moneda del navegador).
export function formatPrice(value) {
  const price = Number(value)
  if (!Number.isFinite(price)) return '$0'

  return `$${price.toLocaleString('es-AR', {
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}
