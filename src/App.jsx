import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [cidi, setCidi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState(null);
  const [apellido, setApellido] = useState(null);
  const [email, setEmail] = useState(null);
  const [dni, setDni] = useState(null);

  useEffect(() => {
    const cookies = document.cookie;
    const cookieCidi = cookies
      .split("; ")
      .find((cookie) => cookie.startsWith("cidi="));

    if (cookieCidi) {
      const cidiValue = cookieCidi.split("=")[1];
      if (cidiValue) {
        obtenerDatosUsuario(cidiValue);
      }
      setCidi(cidiValue);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const cidiValue = urlParams.get("cidi");
      if (cidiValue) {
        setCidi(cidiValue);
        document.cookie = `cidi=${cidiValue}; path=/; max-age=${
          7 * 24 * 60 * 60
        }`;
      }
    }
  }, []);

  const obtenerDatosUsuario = async (cidi) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://cadi.colegio-arquitectos.com.ar/api/obtenerUsuario?cidi=${cidi}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      const data = await response.json();
      setNombre(data.data.Nombre);
      setApellido(data.data.Apellido);
      setEmail(data.data.Email);
      setDni(data.data.NroDocumento);
      console.log(data);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Capc Front Test</h1>

      {cidi ? (
        <div>
          {!loading ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <h3>DATOS DEL USUARIO</h3>
              <span>
                <strong>NOMBRE: </strong>
                {nombre}
              </span>
              <span>
                <strong>APELLIDO: </strong>
                {apellido}
              </span>
              <span>
                <strong>EMAIL: </strong>
                {email}
              </span>
              <span>
                <strong>DNI: </strong>
                {dni}
              </span>
            </div>
          ) : (
            <div
              id="btnValidar"
              data-url="{{urlAppOrigen}}"
              class="loader-container"
            >
              <div class="spinner"></div>
            </div>
          )}
          {/* <button  disabled={loading} onClick={() => obtenerDatosUsuario(cidi)}>
              {loading ? 'Cargando...' : 'Obtener datos usuario'}
            </button> */}
        </div>
      ) : (
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
      )}
      
    </div>
    
  );
}

export default App;
