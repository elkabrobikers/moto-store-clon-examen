
import { useEffect, useState } from "react";

function Productos({ usuario, token }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [procesando, setProcesando] = useState(false);

  const esAdmin = usuario?.rol === "admin" && Boolean(token);

  const cargarProductos = async () => {
    try {
      setError("");

      const respuesta = await fetch("/api/productos");

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los productos");
      }

      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    if (!esAdmin) {
      setEditando(null);
      setNombre("");
      setPrecio("");
      setCategoria("");
    }
  }, [esAdmin]);

  const iniciarEdicion = (producto) => {
    if (!esAdmin) {
      return;
    }

    setEditando(producto.id);
    setNombre(producto.nombre);
    setPrecio(String(producto.precio));
    setCategoria(producto.categoria);
    setMensaje("");
    setError("");
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setNombre("");
    setPrecio("");
    setCategoria("");
  };

  const guardarCambios = async (e) => {
    e.preventDefault();

    if (!esAdmin) {
      setError("Debes iniciar sesión como administrador.");
      return;
    }

    const precioNumero = Number(precio);

    if (
      !nombre.trim() ||
      !categoria.trim() ||
      !Number.isFinite(precioNumero) ||
      precioNumero <= 0
    ) {
      setError("Completa todos los campos con datos válidos.");
      return;
    }

    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      const respuesta = await fetch(`/api/productos/${editando}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          precio: precioNumero,
          categoria: categoria.trim()
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al actualizar el producto");
      }

      cancelarEdicion();
      await cargarProductos();
      setMensaje("Producto actualizado correctamente.");
    } catch (error) {
      setError(error.message);
    } finally {
      setProcesando(false);
    }
  };

  const eliminarProducto = async (id) => {
    if (!esAdmin) {
      setError("Debes iniciar sesión como administrador.");
      return;
    }

    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      const respuesta = await fetch(`/api/productos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al eliminar el producto");
      }

      if (editando === id) {
        cancelarEdicion();
      }

      await cargarProductos();
      setMensaje("Producto eliminado correctamente.");
    } catch (error) {
      setError(error.message);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <section id="productos">
      <h2>Nuestros productos</h2>

      {esAdmin && (
        <p>Modo administrador: puedes editar y eliminar productos.</p>
      )}

      {cargando && <p>Cargando productos...</p>}

      {error && <p style={{ color: "#ff4d6d" }}>{error}</p>}

      {mensaje && <p style={{ color: "#4ade80" }}>{mensaje}</p>}

      {!cargando && !error && productos.length === 0 && (
        <p>No hay productos registrados todavía.</p>
      )}

      {!cargando && productos.length > 0 && (
        <div className="lista-productos">
          {productos.map((producto) => (
            <div className="producto" key={producto.id}>
              {esAdmin && editando === producto.id ? (
                <form onSubmit={guardarCambios}>
                  <h3>Editar producto</h3>

                  <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />

                  <input
                    type="number"
                    placeholder="Precio en Bs."
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                  />

                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="Motocicletas">Motocicletas</option>
                    <option value="Repuestos">Repuestos</option>
                    <option value="Accesorios">Accesorios</option>
                  </select>

                  <div className="acciones-producto">
                    <button type="submit" disabled={procesando}>
                      {procesando ? "Guardando..." : "Guardar cambios"}
                    </button>

                    <button
                      type="button"
                      onClick={cancelarEdicion}
                      disabled={procesando}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3>{producto.nombre}</h3>
                  <p>Categoría: {producto.categoria}</p>
                  <p>Precio: Bs. {producto.precio}</p>

                  {esAdmin && (
                    <div className="acciones-producto">
                      <button
                        type="button"
                        onClick={() => iniciarEdicion(producto)}
                        disabled={procesando}
                      >
                        ✏️ Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => eliminarProducto(producto.id)}
                        disabled={procesando}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Productos;
