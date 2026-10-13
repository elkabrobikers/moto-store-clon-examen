const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    mensaje: "API de Tienda de Motos funcionando correctamente",
    curso: "Tecnología Web II",
    estado: "activo"
  });
});

router.get("/estado", (req, res) => {
  res.json({
    sistema: "Venta de Motos y Repuestos Web",
    estado: "funcionando",
    servidor: "Node.js + Express"
  });
});

router.get("/productos", (req, res) => {
  const productos = [
    { id: 1, nombre: "Casco Integral Steelpro", precio: 450, categoria: "Accesorios" },
    { id: 2, nombre: "Kit de Transmisión Suzuki Katana GSX750F", precio: 850, categoria: "Repuestos" },
    { id: 3, nombre: "Aceite Sintético Motul 10W40", precio: 95, categoria: "Mantenimiento" }
  ];
  res.json(productos);
});

router.get("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  res.json({
    mensaje: "Producto de moto solicitado",
    id: id,
    detalle: "Información detallada del repuesto o accesorio en stock"
  });
});

module.exports = router;