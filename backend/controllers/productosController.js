
const productosService = require("../services/productosService");

const validarId = (id) => {
    return Number.isSafeInteger(id) && id > 0;
};

const validarProducto = (nombre, precio, categoria) => {
    return (
        typeof nombre === "string" &&
        nombre.trim().length >= 3 &&
        nombre.trim().length <= 120 &&
        typeof categoria === "string" &&
        categoria.trim() !== "" &&
        typeof precio === "number" &&
        Number.isFinite(precio) &&
        precio > 0
    );
};

const manejarError = (error, res) => {
    console.error("Error en productos:", error);

    return res.status(500).json({
        mensaje: "Error interno del servidor"
    });
};

const listarProductos = async (req, res) => {
    try {
        const productos = await productosService.listarProductos();

        return res.status(200).json(productos);
    } catch (error) {
        return manejarError(error, res);
    }
};

const obtenerProductoPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!validarId(id)) {
            return res.status(400).json({
                mensaje: "El ID debe ser un número entero positivo"
            });
        }

        const producto = await productosService.obtenerProductoPorId(id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        return res.status(200).json(producto);
    } catch (error) {
        return manejarError(error, res);
    }
};

const registrarProducto = async (req, res) => {
    try {
        const { nombre, precio, categoria } = req.body || {};

        if (!validarProducto(nombre, precio, categoria)) {
            return res.status(400).json({
                mensaje: "Datos inválidos. El nombre debe tener entre 3 y 120 caracteres, el precio debe ser positivo y la categoría es obligatoria."
            });
        }

        const nuevoProducto = await productosService.registrarProducto({
            nombre: nombre.trim(),
            precio: precio,
            categoria: categoria.trim()
        });

        return res.status(201).json({
            mensaje: "Producto registrado correctamente",
            producto: nuevoProducto
        });
    } catch (error) {
        return manejarError(error, res);
    }
};

const actualizarProducto = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nombre, precio, categoria } = req.body || {};

        if (!validarId(id)) {
            return res.status(400).json({
                mensaje: "El ID debe ser un número entero positivo"
            });
        }

        if (!validarProducto(nombre, precio, categoria)) {
            return res.status(400).json({
                mensaje: "Datos inválidos. El nombre debe tener entre 3 y 120 caracteres, el precio debe ser positivo y la categoría es obligatoria."
            });
        }

        const productoActualizado = await productosService.actualizarProducto(id, {
            nombre: nombre.trim(),
            precio: precio,
            categoria: categoria.trim()
        });

        if (!productoActualizado) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        return res.status(200).json({
            mensaje: "Producto actualizado correctamente",
            producto: productoActualizado
        });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        return manejarError(error, res);
    }
};

const eliminarProducto = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!validarId(id)) {
            return res.status(400).json({
                mensaje: "El ID debe ser un número entero positivo"
            });
        }

        const productoEliminado = await productosService.eliminarProducto(id);

        if (!productoEliminado) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        return res.status(200).json({
            mensaje: "Producto eliminado correctamente",
            producto: productoEliminado
        });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        return manejarError(error, res);
    }
};

module.exports = {
    listarProductos,
    obtenerProductoPorId,
    registrarProducto,
    actualizarProducto,
    eliminarProducto
};
