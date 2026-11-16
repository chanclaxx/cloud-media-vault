# Contrato de la API REST

> Este documento es el **acuerdo** entre backend (Roles 2 y 3) y frontend (Roles 4 y 5).
> Si alguien necesita cambiarlo, lo actualiza aquí **y avisa al equipo**.

- URL base en desarrollo: `http://localhost:4000`
- Todas las respuestas son JSON.
- CORS: solo se permite el origen definido en `CORS_ORIGIN` (por defecto `http://localhost:5173`).

## Formato de respuesta

Éxito:
```json
{ "ok": true, "data": ... }
```

Error (siempre con esta forma, para que el frontend pueda mostrar `mensaje`):
```json
{ "ok": false, "error": { "codigo": "ARCHIVO_MUY_GRANDE", "mensaje": "El archivo supera el límite de 10 MB." } }
```

## Objeto `Archivo`

```json
{
  "id": "6730f1c2a1b2c3d4e5f60718",
  "titulo": "Logo del equipo",
  "nombreOriginal": "logo-final.png",
  "url": "https://res.cloudinary.com/<cloud>/image/upload/v1731/cloud-media-vault/abc123.png",
  "publicId": "cloud-media-vault/abc123",
  "resourceType": "image",
  "tipoArchivo": "imagen",
  "mimeType": "image/png",
  "tamanoBytes": 482133,
  "fechaSubida": "2026-11-16T15:04:05.000Z",
  "subidoPor": "Ana Pérez"
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | string | `_id` de MongoDB convertido a texto (el modelo lo transforma en `toJSON`). |
| `titulo` | string | Si el usuario no envía título, se usa el nombre del archivo sin extensión. |
| `nombreOriginal` | string | Nombre del archivo como lo subió el usuario. |
| `url` | string | `secure_url` (https) que devuelve Cloudinary. |
| `publicId` | string | `public_id` de Cloudinary. **Necesario para borrar.** |
| `resourceType` | `"image" \| "video" \| "raw"` | `resource_type` de Cloudinary. **Necesario para borrar** (Cloudinary exige el tipo correcto). |
| `tipoArchivo` | `"imagen" \| "video" \| "pdf"` | Categoría para filtros en la UI. |
| `mimeType` | string | Ej. `image/png`, `video/mp4`, `application/pdf`. |
| `tamanoBytes` | number | Tamaño en bytes (el frontend lo formatea a KB/MB). |
| `fechaSubida` | string (ISO 8601) | Se guarda como `Date` en MongoDB. |
| `subidoPor` | string | Autor (nombre escrito en el formulario; no hay login). |

## Tipos y límites permitidos

Definidos en `server/src/constants/archivos.js` (y copiados en `client/src/constants/archivos.js`):

| Categoría | MIME permitidos |
|---|---|
| imagen | `image/jpeg`, `image/png`, `image/webp`, `image/gif` |
| video | `video/mp4`, `video/webm`, `video/quicktime` |
| pdf | `application/pdf` |

Tamaño máximo: **10 MB** (10 × 1024 × 1024 bytes).

---

## `GET /api/health`

Verifica que el servidor está vivo.

```json
200 { "ok": true, "data": { "estado": "ok" } }
```

## `POST /api/archivos` — Rol 2 (subida) + Rol 3 (persistencia)

`Content-Type: multipart/form-data`

| Campo | Tipo | Obligatorio |
|---|---|---|
| `archivo` | file | Sí |
| `subidoPor` | text | Sí |
| `titulo` | text | No |

Flujo: multer valida → sube a Cloudinary → guarda metadatos en MongoDB → responde.
Si falla el guardado en la BD, se borra de Cloudinary lo recién subido (no dejar huérfanos).

| Código | Cuándo | `error.codigo` |
|---|---|---|
| 201 | Subido y guardado. `data` = objeto `Archivo` | — |
| 400 | No se envió archivo / falta `subidoPor` | `ARCHIVO_REQUERIDO` / `DATOS_INVALIDOS` |
| 413 | Archivo > 10 MB | `ARCHIVO_MUY_GRANDE` |
| 415 | Tipo MIME no permitido | `TIPO_NO_PERMITIDO` |
| 502 | Cloudinary falló | `ERROR_NUBE` |
| 500 | Error inesperado / BD | `ERROR_INTERNO` |

Prueba con curl (desde **fuera** del repo, con un archivo de tu carpeta personal):
```bash
curl -X POST http://localhost:4000/api/archivos \
  -F "archivo=@C:/Users/tu-usuario/Downloads/foto.jpg" \
  -F "titulo=Foto de prueba" \
  -F "subidoPor=Tu Nombre"
```

## `GET /api/archivos` — Rol 3

Query params (todos opcionales):

| Param | Valores | Efecto |
|---|---|---|
| `tipo` | `imagen` \| `video` \| `pdf` | Filtra por categoría. Otro valor → 400 `DATOS_INVALIDOS`. |
| `q` | texto | Busca en `titulo` (sin distinguir mayúsculas). |
| `orden` | `reciente` (defecto) \| `antiguo` | Orden por `fechaSubida`. |

```json
200 { "ok": true, "data": [ Archivo, Archivo, ... ] }
```

```bash
curl "http://localhost:4000/api/archivos?tipo=imagen&q=logo"
```

## `DELETE /api/archivos/:id` — Rol 3

Flujo **obligatorio** (lo pide el profesor): buscar registro → borrar en Cloudinary con
`publicId` + `resourceType` → **después** borrar en MongoDB.

| Código | Cuándo | `error.codigo` |
|---|---|---|
| 200 | Borrado en ambos. `data` = `{ "id": "..." }` | — |
| 400 | `id` no es un ObjectId válido | `ID_INVALIDO` |
| 404 | No existe el registro | `NO_ENCONTRADO` |
| 502 | Cloudinary falló → **no** se borra de la BD | `ERROR_NUBE` |

Nota: si Cloudinary responde `"not found"` (el archivo ya no estaba en la nube), se considera borrado
y se elimina el registro de la BD para no dejar datos huérfanos.

```bash
curl -X DELETE http://localhost:4000/api/archivos/6730f1c2a1b2c3d4e5f60718
```
