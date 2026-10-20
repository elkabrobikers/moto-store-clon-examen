
const express = require("express");
const helmet = require("helmet");

const app = express();
const PORT = 3000;

const apiRoutes = require("./routes/apiRoutes");

// Activar encabezados HTTP de seguridad
app.use(helmet());

// Permitir que el servidor reciba datos JSON
app.use(express.json());

// Ruta 1: Nombre del sistema
app.get("/", (req, res) => {
    res.send("Bienvenido al Sistema Web de Venta de Motos, Repuestos y Accesorios");
});

// Ruta 2: Información del sistema
app.get("/info", (req, res) => {
    res.send("Sistema especializado en la comercialización de motocicletas de diversas cilindradas, repuestos originales y accesorios de seguridad.");
});

// Ruta 3: Información de contacto
app.get("/contacto", (req, res) => {
    res.send("Correo: contacto@ventademotosweb.com | Teléfono: +591 4-4000000");
});

// Ruta 4: Módulo de motocicletas
app.get("/motos", (req, res) => {
    res.send("Módulo de gestión y catálogo de motocicletas, repuestos y accesorios.");
});

// Conectar las rutas de la API REST
app.use("/api", apiRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
