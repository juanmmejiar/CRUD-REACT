import { useEffect, useRef } from 'react'

/**
 * Mensaje flotante de éxito/error. Se cierra solo a los 5 s o con el botón.
 */
export default function Toast({ message, type = 'success', onClose }) {
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!message) return undefined
    const timer = window.setTimeout(() => onCloseRef.current?.(), 5000)
    return () => window.clearTimeout(timer)
  }, [message])

  if (!message) return null

  return (
    <div
      className={`app-toast app-toast--${type}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <i
        className={`app-toast__icon fa ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}
        aria-hidden="true"
      />
      <p className="app-toast__body mb-0">{message}</p>
      <button
        type="button"
        className="app-toast__close"
        onClick={onClose}
        aria-label="Cerrar mensaje"
      >
        <i className="fa fa-times" aria-hidden="true" />
      </button>
    </div>
  )
}
