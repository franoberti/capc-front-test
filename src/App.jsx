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
        `http://localhost:3000/api/obtenerUsuario?cidi=${cidi}`,
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

  const enviarNotificacion = async (cidi) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/enviarNotificacion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            Cuil: "20411152260",
            HashCookie: cidi,
            Asunto: "Mensaje de prueba",
            Subtitulo: "Turno programado",
            Mensaje: "Este es un mensaje de prueba",
            InfoDesc: "Prueba de notificación",
            InfoDato: "12345678",
            InfoLink: "https://ypsilon.ar",
            Firma: "Francisco Oberti",
            Ente: "Ypsilon",
            DireccionEmail: "usuario@ejemplo.com",
            SesionHash: cidi,
          }),
        }
      );
      setLoading(false);
      const data = await response.json();
      console.log(data);
      if (data.status === 200) {
        alert("Notificación enviada correctamente");
      } else {
        alert("Error al enviar la notificación");
      }
    } catch (error) {
      console.error("Error al enviar la notificación:", error);
      setLoading(false);
      alert("Error al enviar la notificación");
    }
  };

  const cerrarSesion = () => {
    // 1. Borrar cookie
    document.cookie = "cidi=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 2. Remover el query string 'cidi' de la URL
    const url = new URL(window.location.href);
    url.searchParams.delete("cidi");

    // 3. Redirigir a la nueva URL sin el parámetro
    window.location.href = url.toString();
  };

  return (
    <div>
      <h1>Capc Front Test</h1>

      {cidi && (
        <button
          onClick={cerrarSesion}
          style={{ padding: "6px 12px", cursor: "pointer" }}
        >
          Cerrar sesión
        </button>
      )}

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
              <div style={{ marginTop: "20px" }}>
                <button onClick={() => enviarNotificacion(cidi)}>
                  Enviar Notificacion de Prueba
                </button>
              </div>
            </div>
          ) : (
            <div
              id="btnValidar"
              data-url="{{urlAppOrigen}}"
              className="loader-container"
            >
              <div className="spinner"></div>
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
