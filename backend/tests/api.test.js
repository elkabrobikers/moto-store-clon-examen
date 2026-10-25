
const { test } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../server");

test("GET / responde correctamente", async () => {
    const respuesta = await request(app).get("/");

    assert.equal(respuesta.status, 200);
    assert.match(respuesta.text, /Bienvenido al Sistema Web/);
});

test("GET /api devuelve información de la API", async () => {
    const respuesta = await request(app).get("/api");

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.estado, "activo");
});

test("POST /api/productos sin token devuelve 401", async () => {
    const respuesta = await request(app)
        .post("/api/productos")
        .send({
            nombre: "Producto de prueba",
            precio: 100,
            categoria: "Accesorios"
        });

    assert.equal(respuesta.status, 401);
});

test("PUT /api/productos/1 sin token devuelve 401", async () => {
    const respuesta = await request(app)
        .put("/api/productos/1")
        .send({
            nombre: "Producto modificado",
            precio: 200,
            categoria: "Accesorios"
        });

    assert.equal(respuesta.status, 401);
});

test("DELETE /api/productos/1 sin token devuelve 401", async () => {
    const respuesta = await request(app)
        .delete("/api/productos/1");

    assert.equal(respuesta.status, 401);
});

test("POST /api/productos con token inválido devuelve 401", async () => {
    const respuesta = await request(app)
        .post("/api/productos")
        .set("Authorization", "Bearer token_invalido")
        .send({
            nombre: "Producto de prueba",
            precio: 100,
            categoria: "Accesorios"
        });

    assert.equal(respuesta.status, 401);
});

test("POST /api/auth/registro sin datos devuelve 400", async () => {
    const respuesta = await request(app)
        .post("/api/auth/registro")
        .send({});

    assert.equal(respuesta.status, 400);
});

test("POST /api/auth/registro con nombre corto devuelve 400", async () => {
    const respuesta = await request(app)
        .post("/api/auth/registro")
        .send({
            nombre: "A",
            correo: "usuario@example.com",
            password: "ClaveSegura123!"
        });

    assert.equal(respuesta.status, 400);
});

test("POST /api/auth/registro con correo inválido devuelve 400", async () => {
    const respuesta = await request(app)
        .post("/api/auth/registro")
        .send({
            nombre: "Usuario Prueba",
            correo: "correo-invalido",
            password: "ClaveSegura123!"
        });

    assert.equal(respuesta.status, 400);
});

test("POST /api/auth/registro con contraseña corta devuelve 400", async () => {
    const respuesta = await request(app)
        .post("/api/auth/registro")
        .send({
            nombre: "Usuario Prueba",
            correo: "usuario@example.com",
            password: "12345"
        });

    assert.equal(respuesta.status, 400);
});

test("POST /api/auth/login sin datos devuelve 400", async () => {
    const respuesta = await request(app)
        .post("/api/auth/login")
        .send({});

    assert.equal(respuesta.status, 400);
});

test("POST /api/productos con token expirado devuelve 401", async () => {
    const tokenExpirado = jwt.sign(
        {
            id: 999999,
            rol: "admin"
        },
        process.env.JWT_SECRET,
        {
            algorithm: "HS256",
            expiresIn: -10
        }
    );

    const respuesta = await request(app)
        .post("/api/productos")
        .set("Authorization", `Bearer ${tokenExpirado}`)
        .send({
            nombre: "Producto de prueba",
            precio: 100,
            categoria: "Accesorios"
        });

    assert.equal(respuesta.status, 401);
});

test("POST /api/productos con usuario inexistente devuelve 401", async () => {
    const token = jwt.sign(
        {
            id: 2147483647,
            rol: "admin"
        },
        process.env.JWT_SECRET,
        {
            algorithm: "HS256",
            expiresIn: "5m"
        }
    );

    const respuesta = await request(app)
        .post("/api/productos")
        .set("Authorization", `Bearer ${token}`)
        .send({
            nombre: "Producto de prueba",
            precio: 100,
            categoria: "Accesorios"
        });

    assert.equal(respuesta.status, 401);
});
