import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [cidi, setCidi] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const cookies = document.cookie
    const cookieCidi = cookies.split('; ').find(cookie => cookie.startsWith('cidi='))

    if (cookieCidi) {
      const cidiValue = cookieCidi.split('=')[1]
      setCidi(cidiValue)
    }
    else{
      const urlParams = new URLSearchParams(window.location.search)
      const cidiValue = urlParams.get('cidi')
      if (cidiValue) {
        setCidi(cidiValue)
        document.cookie = `cidi=${cidiValue}; path=/; max-age=${7 * 24 * 60 * 60}`
      }
    }
  }, [])

  const obtenerDatosUsuario = async (cidi) => {
    setLoading(true)
    const response = await fetch(`http://localhost:3000/api/obtenerUsuario?cidi=${cidi}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    setLoading(false)
    const data = await response.json()
    console.log(data)
  }

  return (
    <div>
      <h1>Capc Front Test</h1>

      {
        cidi ?
          <div>
            <div>
              <span> (CIDI cookie: {cidi})</span>
            </div>
            <button  disabled={loading} onClick={() => obtenerDatosUsuario(cidi)}>
              {loading ? 'Cargando...' : 'Obtener datos usuario'}
            </button>
          </div>
          :
          <div>
            <div>
              <span> (CIDI cookie no encontrado)</span>
            </div>
            <div>
              <button disabled={loading}>
                <a href="https://cadi.colegio-arquitectos.com.ar/api/validarUsuario">
                  Iniciar Sesion
                </a>
              </button>
            </div>
          </div>
      }
    </div>
  )
}

export default App
