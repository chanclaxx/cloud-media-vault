# Estado del proyecto

> **Tablero de avance.** Cada integrante (o su Claude) actualiza esta página al empezar y al terminar
> una tarea. Así todos saben en qué va cada cosa sin tener que preguntar.
>
> Leyenda: ⬜ pendiente · 🟡 en progreso · ✅ terminado · ⛔ bloqueado (explicar en *Notas*)

## Resumen

| Rol | Responsable | Estado general |
|---|---|---|
| 1 — Arquitecto Cloud y BD | Sebastian Montaño | ✅ |
| 2 — Backend: Ingesta y subida | _(nombre)_ | ⬜ |
| 3 — Backend: CRUD y sincronización | _(nombre)_ | ⬜ |
| 4 — Frontend: Formulario de carga | _(nombre)_ | ⬜ |
| 5 — Frontend: Galería, filtros y QA | _(nombre)_ | ⬜ |

## Base del repositorio (ya hecho)

| Tarea | Estado |
|---|---|
| Estructura `server/` + `client/`, `.gitignore`, `.env.example` | ✅ |
| Express con CORS, JSON, `/api/health`, 404 y manejador de errores base | ✅ |
| Rutas `/api/archivos` montadas (responden 501 hasta que se implementen) | ✅ |
| React + Vite con layout base (formulario + galería como esqueleto) | ✅ |
| Documentación: CLAUDE.md, ROLES, API, FLUJO-GIT, SUSTENTACION | ✅ |

## Rol 1 — Arquitecto Cloud y BD

| Tarea | Estado | Notas |
|---|---|---|
| Cuenta Cloudinary + activar entrega de PDF | ✅ | |
| Cluster MongoDB Atlas M0 + usuario + Network Access | ✅ | |
| Compartir credenciales por canal privado | ✅ | |
| `config/db.js` (conexión Mongoose) | ✅ | |
| `config/cloudinary.js` | ✅ | |
| `config/env.js` validación de variables obligatorias | ✅ | |
| `models/Archivo.js` (esquema + índices + `toJSON`) | ✅ | |

## Rol 2 — Backend: Ingesta y subida

| Tarea | Estado | Notas |
|---|---|---|
| `middlewares/upload.js` (multer memoryStorage + límite + filtro MIME) | ⬜ | |
| `services/cloudStorage.js` → `subirACloud` | ⬜ | |
| `crearArchivo` parte 1: validar campos + subir | ⬜ | |
| `middlewares/errorHandler.js` (MulterError → 413/415, etc.) | ⬜ | |

## Rol 3 — Backend: CRUD y sincronización

| Tarea | Estado | Notas |
|---|---|---|
| `crearArchivo` parte 2: guardar en BD (+ rollback en la nube si falla) | ⬜ | |
| `listarArchivos` (orden + filtro `tipo` + búsqueda `q`) | ⬜ | |
| `services/cloudStorage.js` → `eliminarDeCloud` | ⬜ | |
| `eliminarArchivo` (nube primero, luego BD) | ⬜ | |

## Rol 4 — Frontend: Formulario de carga

| Tarea | Estado | Notas |
|---|---|---|
| `DropZone.jsx` (drag & drop + selector) | ⬜ | |
| Validación de tipo y peso antes de enviar | ⬜ | |
| `api.js` → `subirArchivo` con XHR y progreso | ⬜ | |
| `ProgressBar.jsx`, `Spinner.jsx`, `Alert.jsx` | ⬜ | |
| `UploadForm.jsx` (estados + `onSubido`) | ⬜ | |

## Rol 5 — Frontend: Galería, filtros y QA

| Tarea | Estado | Notas |
|---|---|---|
| `utils/formato.js` (bytes → KB/MB, fecha legible) | ⬜ | |
| `api.js` → `listarArchivos`, `eliminarArchivo` | ⬜ | |
| `MediaPreview.jsx` (img / video / pdf) | ⬜ | |
| `FileCard.jsx` (metadatos + botón eliminar) | ⬜ | |
| `Filters.jsx` (tipo + búsqueda) | ⬜ | |
| `Gallery.jsx` (carga, vacío, error, borrado reactivo) | ⬜ | |
| Diseño responsivo | ⬜ | |

## QA — Pruebas de integración (Rol 5 lidera, todos ayudan)

| Prueba | Resultado | Fecha / quién |
|---|---|---|
| Subir imagen → aparece en galería, Cloudinary y Atlas | ⬜ | |
| Subir video → reproduce en la tarjeta | ⬜ | |
| Subir PDF → se ve / abre desde la tarjeta | ⬜ | |
| Archivo > 10 MB → rechazado en el navegador | ⬜ | |
| Archivo > 10 MB enviado con curl → 413 del servidor | ⬜ | |
| Tipo no permitido (.exe/.zip) → rechazado (cliente y servidor) | ⬜ | |
| Filtros por tipo y búsqueda por título | ⬜ | |
| Eliminar → desaparece de la UI, de Cloudinary y de Atlas | ⬜ | |
| Servidor apagado → la UI muestra error claro (no se rompe) | ⬜ | |
| Consola del navegador sin errores ni warnings | ⬜ | |
| Vista en celular (responsive) | ⬜ | |
| `git status` limpio, sin `.env` ni archivos de prueba en el repo | ⬜ | |
| README con nombres y roles completos | ⬜ | |

## Bitácora

> Una línea por avance, la más reciente arriba. Formato: `AAAA-MM-DD · Rol N · Nombre · qué se hizo`.

- 2026-11-16 · Base · Creación de la estructura del repositorio, documentación y esqueletos por rol.

## Bloqueos / decisiones pendientes

- _(Escribir aquí si algo bloquea a alguien o si hay que decidir algo en equipo.)_
