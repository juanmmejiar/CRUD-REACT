import { useEffect, useId, useRef } from 'react'

/**
 * Modal de confirmación accesible (sin Bootstrap JS).
 * - Foco inicial en Cancelar y retorno al elemento disparador.
 * - Escape y click en el fondo cierran.
 * - Tab queda atrapado dentro del diálogo.
 */
export default function ConfirmModal({
  open,
  title = 'Confirmar acción',
  description,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
  error = null,
}) {
  const dialogRef = useRef(null)
  const cancelRef = useRef(null)
  const titleId = useId()
  const descriptionId = useId()

  const onCancelRef = useRef(onCancel)
  const loadingRef = useRef(loading)
  onCancelRef.current = onCancel
  loadingRef.current = loading

  useEffect(() => {
    if (!open) return undefined

    const previouslyFocused = document.activeElement
    document.body.classList.add('modal-open-app')
    cancelRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !loadingRef.current) {
        event.preventDefault()
        onCancelRef.current?.()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('modal-open-app')
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div className="modal-app">
      <button
        type="button"
        className="modal-app__backdrop"
        aria-label="Cerrar confirmación"
        onClick={() => !loading && onCancel?.()}
        tabIndex={-1}
      />
      <div
        className="modal-app__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        ref={dialogRef}
      >
        <span className="modal-app__icon" aria-hidden="true">
          <i className="fa fa-trash" />
        </span>
        <h2 className="h4 font-weight-bold mb-2" id={titleId}>
          {title}
        </h2>
        <p className="text-muted-app mb-0" id={descriptionId}>
          {description}
        </p>

        {error && (
          <div className="alert-app mt-3 mb-0" role="alert">
            {error}
          </div>
        )}

        <div className="modal-app__actions">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
            ref={cancelRef}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <i className="fa fa-spinner fa-spin mr-2" aria-hidden="true" />
                Eliminando…
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
