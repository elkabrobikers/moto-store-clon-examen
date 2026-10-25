
const jwt = require("jsonwebtoken");

const {
    buscarUsuarioPorCorreo,
    registrarUsuario,
    verificarCredenciales
} = require("../services/usuariosService");

const registro = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body || {};

        if (
            typeof nombre !== "string" ||
            typeof correo !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                mensaje: "Nombre, correo y contraseña son obligatorios"
            });
        }

        const nombreLimpio = nombre.trim();
        const correoLimpio = correo.trim().toLowerCase();

        if (nombreLimpio.length < 2 || nombreLimpio.length > 100) {
            return res.status(400).json({
                mensaje: "El nombre debe tener entre 2 y 100 caracteres"
            });
        }

        if (
            correoLimpio.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)
        ) {
            return res.status(400).json({
                mensaje: "Introduce un correo electrónico válido"
            });
        }

        if (password.length < 12 || password.length > 72) {
            return res.status(400).json({
                mensaje: "La contraseña debe tener entre 12 y 72 caracteres"
            });
        }

        const existente = await buscarUsuarioPorCorreo(correoLimpio);

        if (existente) {
            return res.status(409).json({
                mensaje: "El correo electrónico ya está registrado"
            });
        }

        const usuario = await registrarUsuario({
            nombre: nombreLimpio,
            correo: correoLimpio,
            password
        });

        return res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario
        });
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                mensaje: "El correo electrónico ya está registrado"
            });
        }

        console.error("Error al registrar usuario:", error.message);

        return res.status(500).json({
            mensaje: "No se pudo registrar el usuario"
        });
    }
};

const login = async (req, res) => {
    try {
        const { correo, password } = req.body || {};

        if (
            typeof correo !== "string" ||
            typeof password !== "string" ||
            !correo.trim() ||
            !password
        ) {
            return res.status(400).json({
                mensaje: "Correo y contraseña son obligatorios"
            });
        }

        const usuario = await verificarCredenciales(correo, password);

        if (!usuario) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET no está configurada");

            return res.status(500).json({
                mensaje: "Error de configuración del servidor"
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h",
                algorithm: "HS256"
            }
        );

        return res.status(200).json({
            mensaje: "Inicio de sesión correcto",
            token,
            usuario
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);

        return res.status(500).json({
            mensaje: "No se pudo iniciar sesión"
        });
    }
};

module.exports = {
    registro,
    login
};
