# Estado del proyecto

> **Tablero de avance.** Cada integrante (o su Claude) actualiza esta página al empezar y al terminar
> una tarea. Así todos saben en qué va cada cosa sin tener que preguntar.
>
> Leyenda: ⬜ pendiente · 🟡 en progreso · ✅ terminado · ⛔ bloqueado (explicar en *Notas*)

## Resumen

| Rol | Responsable | Estado general |
|---|---|---|
| 1 — Arquitecto Cloud y BD | Sebastian Montaño | 🟡 |
| 2 — Backend: Ingesta y subida |Elias Castro| 🟡 |
| 3 — Backend: CRUD y sincronización | _(nombre)_ | ✅ |
| 4 — Frontend: Formulario de carga | _(nombre)_ | ✅ |
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
| `config/db.js` (conexión Mongoose) | 🟡 | |
| `config/cloudinary.js` | 🟡 | |
| `config/env.js` validación de variables obligatorias | 🟡 | |
| `models/Archivo.js` (esquema + índices + `toJSON`) | 🟡 | |

## Rol 2 — Backend: Ingesta y subida

| Tarea | Estado | Notas |
|---|---|---|
| `middlewares/upload.js` (multer memoryStorage + límite + filtro MIME) | 🟡 | |
| `services/cloudStorage.js` → `subirACloud` | 🟡 | |
| `crearArchivo` parte 1: validar campos + subir | 🟡 | |
| `middlewares/errorHandler.js` (MulterError → 413/415, etc.) | 🟡 | |

## Rol 3 — Backend: CRUD y sincronización

| Tarea | Estado | Notas |
|---|---|---|
| `crearArchivo` parte 2: guardar en BD (+ rollback en la nube si falla) | ✅ | Probado con Cloudinary + Atlas reales (imagen y PDF → 201). Título > 120 → 400 con rollback. |
| `listarArchivos` (orden + filtro `tipo` + búsqueda `q`) | ✅ | Probado real: `?q=` y `?tipo=pdf` OK. `q` se escapa y se limita a 100 caracteres. |
| `services/cloudStorage.js` → `eliminarDeCloud` | ✅ | Probado real: el recurso desaparece de Cloudinary (Admin API → 404). |
| `eliminarArchivo` (nube primero, luego BD) | ✅ | Probado real: borra en Cloudinary y en Atlas; repetir → 404. Si la nube falla → 502 y NO borra la BD. |

## Rol 4 — Frontend: Formulario de carga

| Tarea | Estado | Notas |
|---|---|---|
| `DropZone.jsx` (drag & drop + selector) | ✅ | Arrastrar y soltar con `preventDefault`, selector con teclado, resaltado al arrastrar y texto de ayuda. |
| Validación de tipo y peso antes de enviar | ✅ | Tipo no permitido y > 10 MB se rechazan en el navegador con alerta, sin petición al servidor. |
| `api.js` → `subirArchivo` con XHR y progreso | ✅ | XHR con `upload.onprogress`; errores con el mensaje del servidor. |
| `ProgressBar.jsx`, `Spinner.jsx`, `Alert.jsx` | ✅ | Barra con `role="progressbar"`, spinner animado y alertas por tipo (éxito/error/aviso). |
| `UploadForm.jsx` (estados + `onSubido`) | ✅ | Estados inactivo/subiendo/éxito/error, vista previa local, campos título y autor; llama `onSubido` al recibir 201. |

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

- 2026-11-17 · Rol 4 · _(nombre)_ · Formulario de carga completo: DropZone (drag & drop + selector), validación de tipo y peso en el navegador, `subirArchivo` con XHR y progreso, `ProgressBar`/`Spinner`/`Alert` y `UploadForm`. Probado en navegador contra Cloudinary/Atlas reales: subida de imagen → 201 con progreso 0→100 % y mensaje de éxito; tipo no permitido y > 10 MB rechazados sin petición; consola sin errores; sin desborde a 375 px. Archivo de prueba eliminado.
- 2026-11-16 · Rol 3 · _(nombre)_ · Prueba real completa: subir imagen + PDF → aparecen en Cloudinary y Atlas; GET con filtros OK; DELETE → borrados en ambos (verificado directo en Cloudinary y Atlas). Datos de prueba eliminados.
- 2026-11-16 · Rol 3 · _(nombre)_ · persistencia en `crearArchivo` con rollback, `GET` con filtros/orden, `DELETE` sincronizado (nube → BD) y `eliminarDeCloud`. Lógica probada fuera del repo con Cloudinary/BD simulados (12/12).
- 2026-11-16 · Rol 2 · _(nombre)_ · multer real, errorHandler (413/400), subirACloud, validación de firma y crearArchivo parte 1 (pendiente probar con credenciales).
- 2026-11-16 · Base · Creación de la estructura del repositorio, documentación y esqueletos por rol.

## Bloqueos / decisiones pendientes

- _(Escribir aquí si algo bloquea a alguien o si hay que decidir algo en equipo.)_
- **`querySrv ECONNREFUSED` al conectar a MongoDB** (le pasó al Rol 3): no es la contraseña, es el DNS del
  computador, que no resuelve direcciones `mongodb+srv://`. Soluciones (cualquiera):
  1. Cambiar el DNS de Windows a `8.8.8.8` / `1.1.1.1` (Configuración → Red → Adaptador → DNS).
  2. En tu propio `server/.env`, usar la cadena *sin* `+srv` que da Atlas (Connect → Drivers → versión antigua del driver).
  3. Decisión del Rol 1: hacer que `config/db.js` use DNS públicos si falla el SRV.
