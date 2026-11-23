import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  defaultProductImage,
  productImageOptions,
  resolveProductImage,
} from '../assets/images.js'

const MAX_DESCRIPTION = 300

function validate(values) {
  const errors = {}
  const nombre = values.nombre.trim()
  const precio = Number(String(values.precio).replace(',', '.'))
  const imagen = values.imagen.trim()

  if (!nombre) {
    errors.nombre = 'El nombre es obligatorio.'
  } else if (nombre.length < 3) {
    errors.nombre = 'Usá al menos 3 caracteres.'
  }

  if (!String(values.precio).trim()) {
    errors.precio = 'El precio es obligatorio.'
  } else if (!Number.isFinite(precio) || precio <= 0) {
    errors.precio = 'Ingresá un precio numérico mayor que 0.'
  }

  const isPreset = productImageOptions.some((option) => option.value === imagen)
  const isUrl = /^https?:\/\/\S+$/i.test(imagen)
  if (imagen && !isPreset && !isUrl) {
    errors.imagen = 'Ingresá una URL válida (http:// o https://) o elegí una imagen de la galería.'
  }

  if (values.descripcion.length > MAX_DESCRIPTION) {
    errors.descripcion = `La descripción no puede superar los ${MAX_DESCRIPTION} caracteres.`
  }

  return errors
}

const EMPTY_VALUES = {
  nombre: '',
  precio: '',
  descripcion: '',
  imagen: '',
}

/**
 * Formulario único para crear y editar.
 * Recibe `initialValues` (vacío al crear, producto al editar) y `onSubmit`.
 */
export default function ProductForm({
  initialValues,
  onSubmit,
  submitLabel = 'Guardar producto',
  cancelTo = '/productos',
}) {
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...initialValues })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  const summaryRef = useRef(null)
  const nombreRef = useRef(null)
  const precioRef = useRef(null)
  const descripcionRef = useRef(null)
  const imagenRef = useRef(null)

  const fieldRefs = {
    nombre: nombreRef,
    precio: precioRef,
    descripcion: descripcionRef,
    imagen: imagenRef,
  }

  const updateValue = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    // Validación en vivo solo después de que el campo fue tocado.
    if (touched[field]) {
      setErrors(validate({ ...values, [field]: value }))
    }
  }

  const handleBlur = (field) => {
    setTouched((current) => ({ ...current, [field]: true }))
    setErrors(validate(values))
  }

  const focusField = (field) => {
    fieldRefs[field]?.current?.focus()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setTouched({ nombre: true, precio: true, descripcion: true, imagen: true })
    setFormError(null)

    if (Object.keys(nextErrors).length > 0) {
      summaryRef.current?.focus()
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({
        nombre: values.nombre.trim(),
        precio: Number(String(values.precio).replace(',', '.')),
        descripcion: values.descripcion.trim(),
        imagen: values.imagen.trim(),
      })
    } catch (err) {
      setFormError(err.message || 'No pudimos guardar el producto. Intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const errorList = Object.entries(errors)

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      {formError && (
        <div className="alert-app mb-4" role="alert">
          <strong className="d-block mb-1">No se pudo guardar</strong>
          {formError}
        </div>
      )}

      {errorList.length > 0 && (
        <div className="form-summary" role="alert" tabIndex={-1} ref={summaryRef}>
          <h2 className="h6 font-weight-bold mb-1">Revisá estos campos</h2>
          <ul>
            {errorList.map(([field, message]) => (
              <li key={field}>
                <a
                  href={`#product-${field}`}
                  onClick={(event) => {
                    event.preventDefault()
                    focusField(field)
                  }}
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="row">
        <div className="col-lg-7">
          <div className="form-group">
            <label className="form-label" htmlFor="product-nombre">
              Nombre <span className="text-danger">*</span>
            </label>
            <input
              id="product-nombre"
              ref={nombreRef}
              className={`form-control${errors.nombre ? ' is-invalid' : ''}`}
              type="text"
              value={values.nombre}
              onChange={(event) => updateValue('nombre', event.target.value)}
              onBlur={() => handleBlur('nombre')}
              aria-invalid={Boolean(errors.nombre)}
              aria-describedby={errors.nombre ? 'product-nombre-error' : 'product-nombre-help'}
              autoComplete="off"
              placeholder="Ej. Chocolate amargo"
            />
            <small id="product-nombre-help" className="form-text text-muted-app">
              Mínimo 3 caracteres.
            </small>
            {errors.nombre && (
              <p className="field-error" id="product-nombre-error">
                <i className="fa fa-exclamation-circle mr-2" aria-hidden="true" />
                {errors.nombre}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="product-precio">
              Precio (USD) <span className="text-danger">*</span>
            </label>
            <input
              id="product-precio"
              ref={precioRef}
              className={`form-control${errors.precio ? ' is-invalid' : ''}`}
              type="number"
              min="0.01"
              step="0.01"
              value={values.precio}
              onChange={(event) => updateValue('precio', event.target.value)}
              onBlur={() => handleBlur('precio')}
              aria-invalid={Boolean(errors.precio)}
              aria-describedby={errors.precio ? 'product-precio-error' : 'product-precio-help'}
              placeholder="99"
            />
            <small id="product-precio-help" className="form-text text-muted-app">
              Tiene que ser mayor que 0.
            </small>
            {errors.precio && (
              <p className="field-error" id="product-precio-error">
                <i className="fa fa-exclamation-circle mr-2" aria-hidden="true" />
                {errors.precio}
              </p>
            )}
          </div>

          <div className="form-group mb-0">
            <label className="form-label" htmlFor="product-descripcion">
              Descripción
            </label>
            <textarea
              id="product-descripcion"
              ref={descripcionRef}
              className={`form-control${errors.descripcion ? ' is-invalid' : ''}`}
              value={values.descripcion}
              onChange={(event) => updateValue('descripcion', event.target.value)}
              onBlur={() => handleBlur('descripcion')}
              aria-invalid={Boolean(errors.descripcion)}
              aria-describedby="product-descripcion-help"
              maxLength={MAX_DESCRIPTION}
              placeholder="Ingredientes, textura, para quién es ideal…"
            />
            <small id="product-descripcion-help" className="form-text text-muted-app">
              Opcional. {values.descripcion.length}/{MAX_DESCRIPTION} caracteres.
            </small>
            {errors.descripcion && (
              <p className="field-error" id="product-descripcion-error">
                <i className="fa fa-exclamation-circle mr-2" aria-hidden="true" />
                {errors.descripcion}
              </p>
            )}
          </div>
        </div>

        <div className="col-lg-5 mt-4 mt-lg-0">
          <div className="form-group">
            <span className="form-label">Imagen</span>
            <p className="form-text text-muted-app mt-0">
              Elegí una de la galería o pegá una URL. Si no elegís, usamos la imagen por defecto.
            </p>

            <div className="image-picker mb-3" role="group" aria-label="Galería de imágenes">
              <button
                type="button"
                className={`image-picker__option${values.imagen === '' ? ' is-selected' : ''}`}
                onClick={() => updateValue('imagen', '')}
                aria-pressed={values.imagen === ''}
                aria-label="Usar imagen por defecto"
              >
                <img src={defaultProductImage} alt="" />
              </button>
              {productImageOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={`image-picker__option${values.imagen === option.value ? ' is-selected' : ''}`}
                  onClick={() => updateValue('imagen', option.value)}
                  aria-pressed={values.imagen === option.value}
                  aria-label={`Usar ${option.label}`}
                >
                  <img src={option.src} alt="" />
                </button>
              ))}
            </div>

            <label className="form-label" htmlFor="product-imagen">
              URL personalizada (opcional)
            </label>
            <input
              id="product-imagen"
              ref={imagenRef}
              className={`form-control${errors.imagen ? ' is-invalid' : ''}`}
              type="url"
              value={
                productImageOptions.some((option) => option.value === values.imagen)
                  ? ''
                  : values.imagen
              }
              onChange={(event) => updateValue('imagen', event.target.value)}
              onBlur={() => handleBlur('imagen')}
              aria-invalid={Boolean(errors.imagen)}
              aria-describedby={errors.imagen ? 'product-imagen-error' : 'product-imagen-help'}
              placeholder="https://…"
            />
            <small id="product-imagen-help" className="form-text text-muted-app">
              Se muestra una vista previa debajo.
            </small>
            {errors.imagen && (
              <p className="field-error" id="product-imagen-error">
                <i className="fa fa-exclamation-circle mr-2" aria-hidden="true" />
                {errors.imagen}
              </p>
            )}

            <div className="text-center mt-4">
              <img
                className="image-preview"
                src={resolveProductImage(values.imagen)}
                alt="Vista previa de la imagen del producto"
                onError={(event) => {
                  event.currentTarget.src = defaultProductImage
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <i className="fa fa-spinner fa-spin mr-2" aria-hidden="true" />
              Guardando…
            </>
          ) : (
            submitLabel
          )}
        </button>
        <Link className="btn btn-outline-secondary" to={cancelTo}>
          Cancelar
        </Link>
      </div>
    </form>
  )
}
