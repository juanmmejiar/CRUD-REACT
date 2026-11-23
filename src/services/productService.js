/**
 * Capa de datos del CRUD.
 * Hoy persiste en localStorage; todas las funciones son async para que
 * mañana se puedan reemplazar por fetch() a una API REST sin tocar
 * los componentes ni los hooks.
 */

const STORAGE_KEY = 'icream-products-v1'
const LATENCY = 220

const wait = (ms = LATENCY) => new Promise((resolve) => setTimeout(resolve, ms))

const SEED_PRODUCTS = [
  {
    id: 'seed-1',
    nombre: 'Vainilla clásica',
    precio: 99,
    descripcion: 'Nuestra receta original: vainilla de Madagascar, leche orgánica y una textura cremosa.',
    imagen: 'product-1.jpg',
    createdAt: '2026-01-08T10:00:00.000Z',
  },
  {
    id: 'seed-2',
    nombre: 'Chocolate amargo',
    precio: 125,
    descripcion: 'Cacao intenso con trozos de chocolate 70%. Para los amantes del sabor profundo.',
    imagen: 'product-2.jpg',
    createdAt: '2026-01-07T10:00:00.000Z',
  },
  {
    id: 'seed-3',
    nombre: 'Frutilla a la crema',
    precio: 110,
    descripcion: 'Frutillas frescas de estación mezcladas con crema de leche y un toque de vainilla.',
    imagen: 'product-3.jpg',
    createdAt: '2026-01-06T10:00:00.000Z',
  },
  {
    id: 'seed-4',
    nombre: 'Limón al agua',
    precio: 90,
    descripcion: 'Liviano y refrescante, con jugo de limón natural. Sin lácteos y sin culpa.',
    imagen: 'product-4.jpg',
    createdAt: '2026-01-05T10:00:00.000Z',
  },
  {
    id: 'seed-5',
    nombre: 'Dulce de leche granizado',
    precio: 135,
    descripcion: 'Dulce de leche artesanal con hilos de chocolate semiamargo. El favorito de la casa.',
    imagen: 'product-5.jpg',
    createdAt: '2026-01-04T10:00:00.000Z',
  },
  {
    id: 'seed-6',
    nombre: 'Pistacho tostado',
    precio: 150,
    descripcion: 'Pistachos tostados y molidos en el momento, con crema de leche y una pizca de sal marina.',
    imagen: 'product-2.jpg',
    createdAt: '2026-01-03T10:00:00.000Z',
  },
  {
    id: 'seed-7',
    nombre: 'Menta granizada',
    precio: 115,
    descripcion: 'Menta fresca con trocitos de chocolate crocante. Fresco, intenso y adictivo.',
    imagen: 'product-3.jpg',
    createdAt: '2026-01-02T10:00:00.000Z',
  },
  {
    id: 'seed-8',
    nombre: 'Coco vegano',
    precio: 105,
    descripcion: 'Base de leche de coco y pulpa de coco rallado. 100% vegetal, 100% cremoso.',
    imagen: 'product-1.jpg',
    createdAt: '2026-01-01T10:00:00.000Z',
  },
]

function getStorage() {
  try {
    const storage = window.localStorage
    if (!storage) throw new Error('sin storage')
    return storage
  } catch {
    throw new Error('Tu navegador bloqueó el almacenamiento local. Revisá la configuración de privacidad.')
  }
}

// Devuelve el array guardado o null si todavía no existe (para sembrar).
function readStored() {
  const storage = getStorage()
  const raw = storage.getItem(STORAGE_KEY)
  if (raw === null) return null

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    // Datos corruptos: se vuelve a sembrar en la próxima escritura.
    return null
  }
}

function writeStored(products) {
  getStorage().setItem(STORAGE_KEY, JSON.stringify(products))
}

function ensureSeeded() {
  const stored = readStored()
  if (stored) return stored
  writeStored(SEED_PRODUCTS)
  return [...SEED_PRODUCTS]
}

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

// Normaliza y valida los datos antes de persistirlos.
function normalizeInput(input) {
  const nombre = String(input.nombre ?? '').trim()
  const precio = Number(String(input.precio ?? '').replace(',', '.'))
  const descripcion = String(input.descripcion ?? '').trim()
  const imagen = String(input.imagen ?? '').trim()

  if (nombre.length < 3) {
    throw new Error('El nombre debe tener al menos 3 caracteres.')
  }
  if (!Number.isFinite(precio) || precio <= 0) {
    throw new Error('El precio debe ser un número mayor que 0.')
  }

  return {
    nombre,
    precio: Math.round(precio * 100) / 100,
    descripcion,
    imagen,
  }
}

// Más nuevos primero; los productos del seed conservan su orden original.
const sortByNewest = (products) =>
  [...products].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))

export async function getAll() {
  await wait()
  return sortByNewest(ensureSeeded())
}

export async function getById(id) {
  await wait(140)
  return ensureSeeded().find((product) => product.id === id) ?? null
}

export async function create(input) {
  await wait(260)
  const products = ensureSeeded()
  const product = {
    ...normalizeInput(input),
    id: createId(),
    createdAt: new Date().toISOString(),
  }
  writeStored([...products, product])
  return product
}

export async function update(id, input) {
  await wait(260)
  const products = ensureSeeded()
  const index = products.findIndex((product) => product.id === id)
  if (index === -1) {
    throw new Error('El producto que querés editar ya no existe.')
  }

  const updated = {
    ...products[index],
    ...normalizeInput(input),
  }
  const next = [...products]
  next[index] = updated
  writeStored(next)
  return updated
}

export async function remove(id) {
  await wait(240)
  const products = ensureSeeded()
  const next = products.filter((product) => product.id !== id)
  if (next.length === products.length) {
    throw new Error('El producto que querés eliminar ya no existe.')
  }
  writeStored(next)
  return true
}
