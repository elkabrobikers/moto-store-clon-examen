
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

Esta organización permite separar las responsabilidades
del sistema y facilita su mantenimiento.

## 3. Base de datos

Motor: PostgreSQL

Base de datos: venta_motos_db

Modelo: Producto

Campos:

- id: Identificador único y automático.
- nombre: Nombre del producto.
- precio: Precio del producto.
- categoria: Categoría del producto.

La base de datos almacena la información de los productos
registrados mediante la API REST.

## 4. URL base

http://localhost:3000/api

El servidor backend utiliza el puerto 3000.

## 5. Endpoints REST

### GET /api/productos

Lista todos los productos registrados.

Respuesta exitosa: HTTP 200.

Si no existen productos, devuelve una lista vacía.

### GET /api/productos/:id

Busca un producto por su identificador.

Respuestas:

- 200: Producto encontrado.
- 400: ID inválido.
- 404: Producto no encontrado.

### POST /api/productos

Registra un nuevo producto.

Ejemplo de JSON:

```json
{
  "nombre": "Casco Integral",
  "precio": 450,
  "categoria": "Accesorios"
}
```

Respuestas:

- 201: Producto registrado correctamente.
- 400: Datos inválidos.
- 500: Error interno del servidor.

### PUT /api/productos/:id

Actualiza un producto existente.

Ejemplo de JSON:

```json
{
  "nombre": "Casco Integral Premium",
  "precio": 550,
  "categoria": "Accesorios"
}
```

Respuestas:

- 200: Producto actualizado.
- 400: Datos inválidos.
- 404: Producto no encontrado.
- 500: Error interno del servidor.

### DELETE /api/productos/:id

Elimina un producto existente mediante su ID.

Ejemplo de solicitud:

DELETE http://localhost:3000/api/productos/1

Respuestas:

- 200: Producto eliminado.
- 400: ID inválido.
- 404: Producto no encontrado.
- 500: Error interno del servidor.

## 6. Validaciones

El backend comprueba que:

- El nombre sea un texto no vacío.
- La categoría sea un texto no vacío.
- El precio sea un número positivo.
- El ID sea un número entero positivo.

Estas validaciones ayudan a evitar el registro de
información incorrecta en la base de datos.

## 7. Manejo de errores HTTP

- 200: Operación exitosa.
- 201: Recurso creado.
- 400: Solicitud inválida.
- 404: Recurso no encontrado.
- 500: Error interno del servidor.

El backend devuelve respuestas HTTP para indicar
el resultado de las operaciones realizadas.

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

Las operaciones CRUD fueron comprobadas durante
el desarrollo del backend.

## 9. Migraciones

Se utilizó Prisma ORM para crear la tabla
Producto mediante una migración.

Comando utilizado:

```bash
npx prisma migrate dev --name crear_tabla_productos
```

También se verificó el esquema con:

```bash
npx prisma validate
```

Resultado obtenido:

The schema at prisma/schema.prisma is valid.

Se comprobó el estado de las migraciones con:

```bash
npx prisma migrate status
```

Resultado obtenido:

Database schema is up to date!

Esto confirma que la migración registrada está
aplicada y que el esquema se encuentra actualizado.

## 10. Conclusión

El backend permite administrar productos mediante
una API REST conectada a PostgreSQL.

Las operaciones CRUD fueron probadas y los datos
permanecen almacenados después de reiniciar el servidor.

La arquitectura está organizada en rutas,
controladores, servicios y configuración de Prisma.

El sistema constituye la base para integrar
posteriormente una interfaz web de venta de
motocicletas, repuestos y accesorios.

## 11. Estado de seguridad de las dependencias

Durante las pruebas del backend se ejecutaron
los siguientes comandos:

```bash
npm audit
npm audit --omit=dev
```

La herramienta reportó 3 vulnerabilidades
de severidad alta relacionadas con:

- Paquete: deepmerge-ts
- Versión instalada: 7.1.5
- Paquete dependiente: @prisma/config
- Versión de Prisma: 6.19.3

La vulnerabilidad reportada está relacionada
con el agotamiento de la pila al procesar
estructuras de objetos recursivas.

Referencia de seguridad:

https://github.com/advisories/GHSA-ggr8-5vv4-36mx

### 11.1 Medidas realizadas

Se organizaron las dependencias del proyecto:

Dependencias de producción:

- express
- @prisma/client

Dependencias de desarrollo:

- prisma

Se mantuvo Prisma 6.19.3 para evitar una
actualización incompatible con el código actual.

No se ejecutó npm audit fix --force debido
a que propone actualizar a Prisma 7,
lo cual requiere evaluar cambios importantes.

### 11.2 Verificaciones realizadas

Después de organizar las dependencias:

- El esquema de Prisma continuó siendo válido.
- La conexión con PostgreSQL funcionó.
- Las migraciones permanecieron actualizadas.
- El archivo .env quedó excluido del repositorio Git.
- Las operaciones CRUD habían sido probadas previamente.

### 11.3 Estado pendiente

Las 3 vulnerabilidades reportadas por npm
continúan pendientes de corrección.

Antes de utilizar el sistema en un entorno
de producción, será necesario:

- Evaluar una actualización compatible de Prisma.
- Revisar las dependencias afectadas.
- Ejecutar nuevamente npm audit.
- Comprobar la conexión con PostgreSQL.
- Repetir las pruebas de las operaciones CRUD.

La reorganización de las dependencias no
representa una solución definitiva a
las vulnerabilidades detectadas.

## 12. Repositorio del proyecto

El código fuente del proyecto se administra
mediante Git y GitHub.

Repositorio:

https://github.com/gus3091/venta-motos-web

Rama principal:

main

El archivo .env no debe publicarse porque
contiene información privada de conexión
con la base de datos.
