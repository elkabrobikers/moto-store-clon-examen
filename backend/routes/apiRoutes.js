
const express = require("express");
const router = express.Router();

const productosController = require("../controllers/productosController");

router.get("/", (req, res) => {
    res.json({
        mensaje: "API funcionando correctamente",
        curso: "Tecnología Web II",
        estado: "activo"
    });
});

router.get("/productos", productosController.listarProductos);

router.get("/productos/:id", productosController.obtenerProductoPorId);

router.post("/productos", productosController.registrarProducto);

router.put("/productos/:id", productosController.actualizarProducto);

router.delete("/productos/:id", productosController.eliminarProducto);

module.exports = router;
