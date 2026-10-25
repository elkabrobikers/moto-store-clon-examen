
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const buscarUsuarioPorCorreo = async (correo) => {
    return await prisma.usuario.findUnique({
        where: {
            correo: correo
        }
    });
};

const registrarUsuario = async (datos) => {
    const nombre = datos.nombre.trim();
    const correo = datos.correo.trim().toLowerCase();

    const passwordHash = await bcrypt.hash(datos.password, 12);

    const usuario = await prisma.usuario.create({
        data: {
            nombre,
            correo,
            passwordHash,
            rol: "cliente",
            activo: true
        }
    });

    return {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        activo: usuario.activo
    };
};

const verificarCredenciales = async (correo, password) => {
    const usuario = await buscarUsuarioPorCorreo(
        correo.trim().toLowerCase()
    );

    if (!usuario || !usuario.activo) {
        return null;
    }

    const passwordCorrecta = await bcrypt.compare(
        password,
        usuario.passwordHash
    );

    if (!passwordCorrecta) {
        return null;
    }

    return {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        activo: usuario.activo
    };
};

module.exports = {
    buscarUsuarioPorCorreo,
    registrarUsuario,
    verificarCredenciales
};
