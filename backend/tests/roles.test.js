
const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
    permitirRoles
} = require("../middlewares/authMiddleware");

const ejecutarMiddleware = (rol) => {
    return new Promise((resolve) => {
        const req = {
            usuario: rol ? {
                id: 1,
                nombre: "Usuario de prueba",
                rol
            } : undefined
        };

        const resultado = {
            status: null,
            body: null,
            autorizado: false
        };

        const res = {
            status(codigo) {
                resultado.status = codigo;
                return this;
            },
            json(datos) {
                resultado.body = datos;
                resolve(resultado);
                return this;
            }
        };

        const next = () => {
            resultado.autorizado = true;
            resolve(resultado);
        };

        permitirRoles("admin")(req, res, next);
    });
};

test("Administrador puede acceder a rutas protegidas", async () => {
    const resultado = await ejecutarMiddleware("admin");

    assert.equal(resultado.autorizado, true);
});

test("Cliente no puede acceder a rutas de administrador", async () => {
    const resultado = await ejecutarMiddleware("cliente");

    assert.equal(resultado.status, 403);
    assert.equal(resultado.autorizado, false);
});

test("Usuario sin sesión recibe 401", async () => {
    const resultado = await ejecutarMiddleware(null);

    assert.equal(resultado.status, 401);
    assert.equal(resultado.autorizado, false);
});

test("Mecánico no puede acceder a rutas de administrador", async () => {
    const resultado = await ejecutarMiddleware("mecanico");

    assert.equal(resultado.status, 403);
    assert.equal(resultado.autorizado, false);
});
