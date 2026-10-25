
const express = require("express");
const router = express.Router();

const productosController = require("../controllers/productosController");
const authController = require("../controllers/authController");

const {
    verificarToken,
    permitirRoles
} = require("../middlewares/authMiddleware");

router.get("/", (req, res) => {
    res.json({
        mensaje: "API funcionando correctamente",
        curso: "Tecnología Web II",
        estado: "activo"
    });
});

router.post("/auth/registro", authController.registro);

router.post("/auth/login", authController.login);

router.get("/productos", productosController.listarProductos);

router.get("/productos/:id", productosController.obtenerProductoPorId);

router.post(
    "/productos",
    verificarToken,
    permitirRoles("admin"),
    productosController.registrarProducto
);

router.put(
    "/productos/:id",
    verificarToken,
    permitirRoles("admin"),
    productosController.actualizarProducto
);

router.delete(
    "/productos/:id",
    verificarToken,
    permitirRoles("admin"),
    productosController.eliminarProducto
);

module.exports = router;
