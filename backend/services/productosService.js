
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const listarProductos = async () => {
    return await prisma.producto.findMany({
        orderBy: {
            id: "asc"
        }
    });
};

const obtenerProductoPorId = async (id) => {
    return await prisma.producto.findUnique({
        where: {
            id: Number(id)
        }
    });
};

const registrarProducto = async (datos) => {
    return await prisma.producto.create({
        data: {
            nombre: datos.nombre,
            precio: datos.precio,
            categoria: datos.categoria,
            stock: datos.stock
        }
    });
};

const actualizarProducto = async (id, datos) => {
    const producto = await obtenerProductoPorId(id);

    if (!producto) {
        return null;
    }

    return await prisma.producto.update({
        where: {
            id: Number(id)
        },
        data: {
            nombre: datos.nombre,
            precio: datos.precio,
            categoria: datos.categoria,
            stock: datos.stock
        }
    });
};

const eliminarProducto = async (id) => {
    const producto = await obtenerProductoPorId(id);

    if (!producto) {
        return null;
    }

    return await prisma.producto.delete({
        where: {
            id: Number(id)
        }
    });
};

module.exports = {
    listarProductos,
    obtenerProductoPorId,
    registrarProducto,
    actualizarProducto,
    eliminarProducto
};
