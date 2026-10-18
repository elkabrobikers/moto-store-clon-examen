
# DOCUMENTACIÓN DE API REST

## Sistema Web de Venta de Motos, Repuestos y Accesorios

### Actividad 2 - Desarrollo Backend, Base de Datos y API REST

## 1. Tecnologías utilizadas

- Node.js
- Express.js
- JavaScript
- PostgreSQL 18
- Prisma ORM 6

## 2. Arquitectura del backend

El backend está organizado en:

- routes: Definición de rutas REST.
- controllers: Validaciones y respuestas HTTP.
- services: Operaciones con la base de datos.
- prisma: Modelo de datos y migraciones.

## 3. Base de datos

Motor: PostgreSQL

Base de datos: venta_motos_db

Modelo: Producto

Campos:

- id: Identificador único y automático.
- nombre: Nombre del producto.
- precio: Precio del producto.
- categoria: Categoría del producto.

## 4. URL base

http://localhost:3000/api

## 5. Endpoints REST

### GET /api/productos

Lista todos los productos registrados.

Respuesta exitosa: HTTP 200.

### GET /api/productos/:id

Busca un producto por su identificador.

Respuestas:

- 200: Producto encontrado.
- 400: ID inválido.
- 404: Producto no encontrado.

### POST /api/productos

Registra un nuevo producto.

Ejemplo de JSON:

{
  "nombre": "Casco Integral",
  "precio": 450,
  "categoria": "Accesorios"
}

Respuestas:

- 201: Producto registrado.
- 400: Datos inválidos.

### PUT /api/productos/:id

Actualiza un producto existente.

Ejemplo de JSON:

{
  "nombre": "Casco Integral Premium",
  "precio": 550,
  "categoria": "Accesorios"
}

Respuestas:

- 200: Producto actualizado.
- 400: Datos inválidos.
- 404: Producto no encontrado.

### DELETE /api/productos/:id

Elimina un producto existente.

Respuestas:

- 200: Producto eliminado.
- 400: ID inválido.
- 404: Producto no encontrado.

## 6. Validaciones

El backend comprueba que:

- El nombre sea un texto no vacío.
- La categoría sea un texto no vacío.
- El precio sea un número positivo.
- El ID sea un número entero positivo.

## 7. Manejo de errores HTTP

- 200: Operación exitosa.
- 201: Recurso creado.
- 400: Solicitud inválida.
- 404: Recurso no encontrado.
- 500: Error interno del servidor.

## 8. Pruebas realizadas

Se realizaron pruebas mediante PowerShell:

1. GET: Listar productos.
2. GET: Buscar productos por ID.
3. POST: Registrar un producto.
4. PUT: Actualizar un producto.
5. DELETE: Eliminar un producto.
6. Validación de precios negativos.
7. Respuesta HTTP 404.
8. Persistencia de productos después de reiniciar el servidor.

## 9. Migraciones

Se utilizó Prisma ORM para crear la tabla
Producto mediante una migración.

Comando utilizado:

npx prisma migrate dev --name crear_tabla_productos

## 10. Conclusión

El backend permite administrar productos mediante
una API REST conectada a PostgreSQL.

Las operaciones CRUD fueron probadas y los datos
permanecen almacenados después de reiniciar el servidor.
