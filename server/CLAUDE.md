# server/CLAUDE.md — Notas del backend (Roles 1, 2 y 3)

> Complementa el [CLAUDE.md raíz](../CLAUDE.md). Las reglas de allá aplican aquí también
> (repo limpio, no commits sin permiso, actualizar docs/ESTADO.md).

## Stack

- Node 22+, **Express 5**, **multer 2** (memoryStorage), **cloudinary 2** (SDK v2), **mongoose 9**.
- ES Modules (`"type": "module"`): siempre `import`/`export` y extensión `.js` en los imports relativos.
- Variables de entorno con `process.loadEnvFile()` (sin dotenv). Ver `src/config/env.js`.
- `npm run dev` usa `node --watch` (se reinicia solo al guardar; no hace falta nodemon).

## Flujo de una subida (POST)

```
navegador --multipart--> multer (memoria, valida tamaño y MIME)
          --> crearArchivo: valida campos --> subirACloud(buffer) --> Cloudinary
          --> Archivo.create(metadatos) --> MongoDB Atlas
          --> 201 { ok: true, data: Archivo }
   (si falla la BD: eliminarDeCloud(publicId) = rollback, luego 500)
```

## Flujo de un borrado (DELETE) — el orden importa

```
findById --> eliminarDeCloud(publicId, resourceType) --> findByIdAndDelete --> 200
   (si Cloudinary falla: 502 y NO se toca la BD)
```

## Dónde está cada cosa

| Archivo | Dueño | Qué hace |
|---|---|---|
| `src/index.js` | compartido | arranque (env → cloudinary → db → listen) |
| `src/app.js` | compartido | CORS, JSON, `/api/health`, rutas, 404, errorHandler |
| `src/config/env.js` | Rol 1 | lee `.env` |
| `src/config/db.js` | Rol 1 | conexión Mongoose |
| `src/config/cloudinary.js` | Rol 1 | `cloudinary.config(...)`, exporta la instancia |
| `src/models/Archivo.js` | Rol 1 | esquema de metadatos |
| `src/constants/archivos.js` | Rol 2 | MIME permitidos y 10 MB (copia en el client) |
| `src/middlewares/upload.js` | Rol 2 | multer |
| `src/middlewares/errorHandler.js` | Rol 2 | errores → JSON del contrato |
| `src/services/cloudStorage.js` | Rol 2 / Rol 3 | `subirACloud` / `eliminarDeCloud` |
| `src/controllers/archivos.controller.js` | Rol 2 / Rol 3 | lógica de los endpoints |
| `src/routes/archivos.routes.js` | Rol 3 | rutas |
| `src/utils/HttpError.js` | compartido | `throw new HttpError(status, codigo, mensaje)` |

Busca `TODO(Rol N)` para ver lo pendiente de cada rol.

## Cosas de Cloudinary que hay que saber (evitan horas de depuración)

- **PDF bloqueados por defecto** en cuentas gratuitas: activar *Settings → Security → "Allow delivery
  of PDF and ZIP files"*. Si no, la URL del PDF devuelve 401.
- Con `resource_type: 'auto'`: imágenes → `image`, videos → `video`, **PDF → `image`**.
  Guardar siempre el `resource_type` que devuelve Cloudinary en `resourceType`.
- Para borrar, `destroy(publicId, { resource_type })` necesita el **mismo** tipo con el que se subió.
  Si no coincide, responde `{ result: 'not found' }` aunque el archivo exista.
- `upload()` no recibe un Buffer: usar `upload_stream` y `stream.end(buffer)`.
- Límite del plan gratis: imágenes 10 MB, videos 100 MB (nuestro límite es 10 MB para todo).

## Cosas de MongoDB/Mongoose

- `fechaSubida` debe ser tipo `Date` (no string). El JSON la devuelve en ISO 8601.
- El `toJSON` del modelo convierte `_id` → `id` para respetar el contrato.
- Validar el id con `mongoose.isValidObjectId(id)` antes de `findById` (si no, Mongoose lanza CastError → 500).
- Escapar el texto de búsqueda antes de usarlo en `$regex`.

## Cómo probar sin ensuciar el repo

- Usa `curl`, Postman o Thunder Client (ejemplos en [docs/API.md](../docs/API.md)).
- Los archivos de prueba (imágenes, videos, PDF) se toman de **tu carpeta personal**, no del repo.
- Si necesitas un script de prueba, créalo **fuera** del repo (`../taller3-pruebas/`) o en el
  scratchpad de Claude. Nunca `server/test.js`, `server/prueba.js`, etc.
- Para limpiar datos de prueba, borra desde la propia app (DELETE) para no dejar huérfanos.
