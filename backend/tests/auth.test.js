
const { test } = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    verificarCredenciales
} = require("../services/usuariosService");

test("bcrypt genera una contraseña cifrada", async () => {
    const password = "ClaveSegura123!";

    const hash = await bcrypt.hash(password, 12);

    assert.notEqual(hash, password);
    assert.equal(hash.startsWith("$2"), true);
});

test("bcrypt acepta la contraseña correcta", async () => {
    const password = "ClaveSegura123!";

    const hash = await bcrypt.hash(password, 12);

    const resultado = await bcrypt.compare(password, hash);

    assert.equal(resultado, true);
});

test("bcrypt rechaza una contraseña incorrecta", async () => {
    const hash = await bcrypt.hash("ClaveSegura123!", 12);

    const resultado = await bcrypt.compare(
        "OtraClave123!",
        hash
    );

    assert.equal(resultado, false);
});

test("JWT genera un token válido", () => {
    const token = jwt.sign(
        {
            id: 1,
            rol: "cliente"
        },
        process.env.JWT_SECRET,
        {
            algorithm: "HS256",
            expiresIn: "2h"
        }
    );

    const datos = jwt.verify(
        token,
        process.env.JWT_SECRET,
        {
            algorithms: ["HS256"]
        }
    );

    assert.equal(datos.id, 1);
    assert.equal(datos.rol, "cliente");
});

test("JWT rechaza un token manipulado", () => {
    const token = jwt.sign(
        {
            id: 1,
            rol: "cliente"
        },
        process.env.JWT_SECRET,
        {
            algorithm: "HS256",
            expiresIn: "2h"
        }
    );

    const tokenManipulado = token.slice(0, -8) + "12345678";

    assert.throws(() => {
        jwt.verify(
            tokenManipulado,
            process.env.JWT_SECRET,
            {
                algorithms: ["HS256"]
            }
        );
    });
});

test("JWT rechaza un token expirado", () => {
    const token = jwt.sign(
        {
            id: 1,
            rol: "cliente"
        },
        process.env.JWT_SECRET,
        {
            algorithm: "HS256",
            expiresIn: -10
        }
    );

    assert.throws(() => {
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: ["HS256"]
            }
        );
    }, {
        name: "TokenExpiredError"
    });
});
