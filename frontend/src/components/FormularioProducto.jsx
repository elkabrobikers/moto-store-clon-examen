
import { useState } from "react";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

function FormularioProducto({ usuario, token, onProductoRegistrado }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const esAdmin = usuario?.rol === "admin" && Boolean(token);

  const registrarProducto = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    if (!esAdmin) {
      setError("No tienes permisos para registrar productos.");
      return;
    }

    const precioNumero = Number(precio);

    if (
      !nombre.trim() ||
      !categoria.trim() ||
      !Number.isFinite(precioNumero) ||
      precioNumero <= 0
    ) {
      setError("Completa los datos e ingresa un precio mayor a cero.");
      return;
    }

    try {
      setGuardando(true);

      const respuesta = await fetch(`${API_URL}/api/productos`, {
        method: "POST",
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
        throw new Error(
          datos.mensaje || "Error al registrar el producto"
        );
      }

      setMensaje("Producto registrado correctamente.");
      setNombre("");
      setPrecio("");
      setCategoria("");

      if (onProductoRegistrado) {
        onProductoRegistrado();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (!esAdmin) {
    return null;
  }

  return (
    <section className="formulario-producto">
      <h2>Registrar producto</h2>

      <form onSubmit={registrarProducto}>
        <input
          type="text"
          placeholder="Nombre del producto"
          aria-label="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Precio en Bs."
          aria-label="Precio en bolivianos"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          aria-label="Categoría del producto"
          required
        >
          <option value="">Selecciona una categoría</option>
          <option value="Motocicletas">Motocicletas</option>
          <option value="Repuestos">Repuestos</option>
          <option value="Accesorios">Accesorios</option>
        </select>

        <button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : "Registrar producto"}
        </button>
      </form>

      {mensaje && (
        <p style={{ color: "#4ade80" }} role="status">
          {mensaje}
        </p>
      )}

      {error && (
        <p style={{ color: "#ff4d6d" }} role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

export default FormularioProducto;
