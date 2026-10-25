
import { useState } from "react";
import Productos from "./components/Productos";
import FormularioProducto from "./components/FormularioProducto";
import "./App.css";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

function App() {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState("");
  const [vista, setVista] = useState("login");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [versionProductos, setVersionProductos] = useState(0);

  const esAdmin = usuario?.rol === "admin" && Boolean(token);

  const limpiarFormulario = () => {
    setNombre("");
    setCorreo("");
    setPassword("");
    setMensaje("");
    setError("");
  };

  const cambiarVista = (nuevaVista) => {
    limpiarFormulario();
    setVista(nuevaVista);
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      const respuesta = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo: correo.trim(),
          password
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo iniciar sesión");
      }

      if (!datos.token || !datos.usuario) {
        throw new Error("La respuesta del servidor está incompleta");
      }

      setUsuario(datos.usuario);
      setToken(datos.token);
      setPassword("");
      setMensaje("Inicio de sesión correcto");
      setVista("catalogo");
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  };

  const registrarUsuario = async (e) => {
    e.preventDefault();

    if (
      nombre.trim().length < 2 ||
      nombre.trim().length > 100 ||
      !correo.trim() ||
      password.length < 12 ||
      password.length > 72
    ) {
      setError(
        "El nombre debe tener entre 2 y 100 caracteres y la contraseña entre 12 y 72."
      );
      return;
    }

    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      const respuesta = await fetch(`${API_URL}/api/auth/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          correo: correo.trim(),
          password
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo registrar el usuario");
      }

      setPassword("");
      setNombre("");
      setMensaje("Cuenta creada correctamente. Ahora puedes iniciar sesión.");
      setVista("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setToken("");
    limpiarFormulario();
    setVista("login");
  };

  const actualizarCatalogo = () => {
    setVersionProductos((version) => version + 1);
  };

  return (
    <div className="app">
      <header>
        <h1>🏍️ MOTO STORE</h1>
        <p>Venta de motocicletas, repuestos y accesorios</p>
      </header>

      <nav>
        <a href="#inicio" onClick={() => cambiarVista("catalogo")}>
          Inicio
        </a>

        <a href="#productos" onClick={() => cambiarVista("catalogo")}>
          Productos
        </a>

        {!usuario ? (
          <>
            <button
              type="button"
              onClick={() => cambiarVista("login")}
            >
              Iniciar sesión
            </button>

            <button
              type="button"
              onClick={() => cambiarVista("registro")}
            >
              Registrarse
            </button>
          </>
        ) : (
          <>
            <span className="usuario-nav">
              {usuario.nombre} | {usuario.rol}
            </span>

            <button type="button" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </>
        )}
      </nav>

      <main id="inicio">
        <h2>Bienvenido a MOTO STORE</h2>

        <p>
          Encuentra motocicletas, repuestos y accesorios para tu próxima aventura.
        </p>

        {mensaje && (
          <p className="mensaje-exito" role="status">
            {mensaje}
          </p>
        )}

        {(vista === "login" || vista === "registro") && !usuario && (
          <section className="panel-auth">
            <h2>
              {vista === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </h2>

            <form
              onSubmit={vista === "login" ? iniciarSesion : registrarUsuario}
            >
              {vista === "registro" && (
                <label>
                  Nombre completo
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    autoComplete="name"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </label>
              )}

              <label>
                Correo electrónico
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                Contraseña
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  autoComplete={
                    vista === "login" ? "current-password" : "new-password"
                  }
                  minLength={vista === "registro" ? 12 : undefined}
                  maxLength={vista === "registro" ? 72 : undefined}
                  required
                />
              </label>

              {vista === "registro" && (
                <p className="ayuda-password">
                  La contraseña debe tener entre 12 y 72 caracteres.
                </p>
              )}

              {error && (
                <p className="mensaje-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" disabled={procesando}>
                {procesando
                  ? "Procesando..."
                  : vista === "login"
                    ? "Ingresar"
                    : "Crear cuenta"}
              </button>
            </form>

            <p>
              {vista === "login"
                ? "¿Todavía no tienes una cuenta?"
                : "¿Ya tienes una cuenta?"}
            </p>

            <button
              type="button"
              className="boton-secundario"
              onClick={() =>
                cambiarVista(vista === "login" ? "registro" : "login")
              }
            >
              {vista === "login" ? "Registrarme" : "Iniciar sesión"}
            </button>
          </section>
        )}

        {usuario && (
          <section className="panel-usuario">
            <h2>Bienvenido, {usuario.nombre}</h2>
            <p>
              Rol: <strong>{usuario.rol}</strong>
            </p>

            {esAdmin ? (
              <p>Tienes permisos para administrar los productos.</p>
            ) : (
              <p>Puedes consultar nuestro catálogo de productos.</p>
            )}
          </section>
        )}

        {esAdmin && (
          <FormularioProducto
            usuario={usuario}
            token={token}
            onProductoRegistrado={actualizarCatalogo}
          />
        )}

        <Productos
          key={versionProductos}
          usuario={usuario}
          token={token}
        />
      </main>

      <footer>
        <p>© 2026 MOTO STORE | Tecnología Web II</p>
      </footer>
    </div>
  );
}

export default App;
