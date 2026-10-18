
import { useState } from "react";

function FormularioProducto() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  const registrarProducto = async (e) => {
    e.preventDefault();
    setMensaje("");

    const precioNumero = Number(precio);

    if (!nombre.trim() || !categoria.trim() || !Number.isFinite(precioNumero) || precioNumero <= 0) {
      setMensaje("Completa los datos e ingresa un precio mayor a cero.");
      return;
    }

    try {
      setGuardando(true);

      const respuesta = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          precio: precioNumero,
          categoria: categoria.trim()
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al registrar el producto");
      }

      setMensaje("Producto registrado correctamente.");
      setNombre("");
      setPrecio("");
      setCategoria("");
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="formulario-producto">
      <h2>Registrar producto</h2>

      <form onSubmit={registrarProducto}>
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

        <button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : "Registrar producto"}
        </button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </section>
  );
}

export default FormularioProducto;
