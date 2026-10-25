
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const verificarToken = async (req, res, next) => {
    try {
        const autorizacion = req.headers.authorization;

        if (
            !autorizacion ||
            !autorizacion.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                mensaje: "Acceso denegado. Debes iniciar sesión"
            });
        }

        const token = autorizacion.slice(7).trim();

        if (!token || !process.env.JWT_SECRET) {
            return res.status(401).json({
                mensaje: "Token no válido"
            });
        }

        const datos = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"]
        });

        if (!Number.isInteger(datos.id) || datos.id <= 0) {
            return res.status(401).json({
                mensaje: "Token no válido"
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                id: datos.id
            },
            select: {
                id: true,
                nombre: true,
                correo: true,
                rol: true,
                activo: true
            }
        });

        if (!usuario || !usuario.activo) {
            return res.status(401).json({
                mensaje: "Usuario no autorizado"
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError"
        ) {
            return res.status(401).json({
                mensaje: "Token inválido o expirado"
            });
        }

        console.error("Error de autenticación:", error.message);

        return res.status(500).json({
            mensaje: "Error interno de autenticación"
        });
    }
};

const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({
                mensaje: "Debes iniciar sesión"
            });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                mensaje: "No tienes permisos para realizar esta acción"
            });
        }

        next();
    };
};

module.exports = {
    verificarToken,
    permitirRoles
};
