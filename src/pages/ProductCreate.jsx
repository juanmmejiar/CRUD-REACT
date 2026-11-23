import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import ProductForm from '../components/ProductForm.jsx'
import useProducts from '../hooks/useProducts.js'

export default function ProductCreate() {
  const { createProduct } = useProducts()
  const navigate = useNavigate()

  // El formulario valida; el servicio vuelve a normalizar antes de guardar.
  const handleSubmit = async (values) => {
    const created = await createProduct(values)
    navigate('/productos', {
      state: { flash: `“${created.nombre}” se creó correctamente.` },
    })
  }

  return (
    <>
      <PageHeader title="Nuevo producto" current="Nuevo producto" />

      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="d-flex flex-wrap align-items-end justify-content-between mb-4">
              <div>
                <h2 className="section-title position-relative mb-3">
                  Sumá un helado al catálogo
                </h2>
                <p className="text-muted-app mb-0">
                  Completá los datos. Los campos con <span className="text-danger">*</span> son
                  obligatorios.
                </p>
              </div>
              <Link className="btn btn-outline-secondary mt-3 mt-md-0" to="/productos">
                Volver al catálogo
              </Link>
            </div>

            <ProductForm onSubmit={handleSubmit} submitLabel="Crear producto" />
          </div>
        </div>
      </div>
    </>
  )
}
