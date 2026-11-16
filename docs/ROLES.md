# Roles, responsabilidades y archivos de cada uno

> **Regla:** cada rol trabaja en *sus* archivos. Si necesitas cambiar un archivo de otro rol,
> avísale primero (o pídele que lo haga él). Así evitamos conflictos de Git y el historial
> muestra claramente el aporte de cada uno.
>
> En equipos de **4** personas, los Roles 4 y 5 se fusionan en uno solo (UI/UX y Galería).

Los nombres reales de los integrantes se escriben en el [README.md](../README.md#integrantes-y-roles).

---

## Rol 1 — Arquitecto Cloud y Base de Datos

**Objetivo:** que existan los servicios en la nube y que el backend se pueda conectar a ellos.

**Tareas fuera del código**
- [ ] Crear cuenta de **Cloudinary** (gratuita). Copiar `Cloud name`, `API Key`, `API Secret`.
- [ ] En Cloudinary → *Settings → Security*: activar **"Allow delivery of PDF and ZIP files"**
      (si no, los PDF subidos dan error 401 al abrirlos). Ver [server/CLAUDE.md](../server/CLAUDE.md).
- [ ] Crear cluster gratuito **M0** en **MongoDB Atlas**, un usuario de BD y en *Network Access*
      permitir `0.0.0.0/0` (para que todos los integrantes y la demo puedan conectarse).
- [ ] Compartir las credenciales con el equipo por un **canal privado** (nunca por GitHub).
- [ ] Invitar al equipo al panel de Cloudinary/Atlas o tener sesión abierta para la demo.

**Archivos que le pertenecen**
- `server/src/config/db.js` — conexión a MongoDB con Mongoose.
- `server/src/config/cloudinary.js` — configuración del SDK de Cloudinary.
- `server/src/config/env.js` — lectura/validación de variables de entorno.
- `server/src/models/Archivo.js` — esquema de metadatos.
- `server/.env.example`, `client/.env.example`.

**Criterio de terminado:** `npm run dev` en `server/` muestra "MongoDB conectado" y
"Cloudinary configurado", y el modelo `Archivo` tiene todos los campos de [API.md](API.md).

---

## Rol 2 — Backend: Ingesta y Subida a la Nube

**Objetivo:** `POST /api/archivos` recibe el archivo, lo valida y lo sube a Cloudinary.

**Tareas**
- [ ] Configurar **multer** con `memoryStorage` (el archivo NO se guarda en el disco del servidor),
      límite de 10 MB y filtro de tipos MIME permitidos.
- [ ] Función que sube el `buffer` a Cloudinary (`upload_stream`) y devuelve `secure_url`,
      `public_id`, `resource_type`, `bytes`.
- [ ] Validar campos del formulario (`subidoPor` obligatorio, `titulo` opcional).
- [ ] Manejo robusto de errores: sin archivo (400), tipo no permitido (415), muy grande (413),
      fallo de Cloudinary (502). Formato de error de [API.md](API.md).

**Archivos que le pertenecen**
- `server/src/middlewares/upload.js`
- `server/src/middlewares/errorHandler.js`
- `server/src/constants/archivos.js` (coordinar con Rol 4, que tiene la copia del frontend)
- `server/src/services/cloudStorage.js` → función `subirACloud`
- `server/src/controllers/archivos.controller.js` → **primera parte** de `crearArchivo` (validar + subir)

**Criterio de terminado:** con `curl` (ver [API.md](API.md)) un archivo válido aparece en el panel
de Cloudinary; un `.exe` o un archivo de 15 MB devuelven el error correcto **sin** llegar a la nube.

---

## Rol 3 — Backend: Persistencia CRUD y Sincronización

**Objetivo:** guardar/leer/borrar metadatos y mantener Cloudinary y la BD sincronizados.

**Tareas**
- [ ] En `crearArchivo`: después de que Rol 2 sube a la nube, **guardar el documento** en MongoDB.
      Si guardar en la BD falla, **borrar el archivo recién subido** de Cloudinary (para no dejar
      huérfanos) y responder error.
- [ ] `GET /api/archivos`: ordenado por `fechaSubida` (más reciente primero), con filtros
      `?tipo=imagen|video|pdf` y búsqueda `?q=` por título (sin distinguir mayúsculas).
- [ ] `DELETE /api/archivos/:id`: buscar el registro → borrar en Cloudinary con `publicId` y
      `resourceType` → **luego** borrar en la BD. Si Cloudinary falla, NO borrar de la BD.
- [ ] Validar que `:id` sea un ObjectId válido (400) y que exista (404).

**Archivos que le pertenecen**
- `server/src/controllers/archivos.controller.js` → `listarArchivos`, `eliminarArchivo` y la
  **segunda parte** de `crearArchivo` (persistir)
- `server/src/services/cloudStorage.js` → función `eliminarDeCloud`
- `server/src/routes/archivos.routes.js`

**Criterio de terminado:** al borrar con `curl -X DELETE`, el archivo desaparece de Cloudinary y de
Atlas; `GET` con filtros devuelve lo esperado.

---

## Rol 4 — Frontend: Formulario de Carga y Validaciones

**Objetivo:** subir archivos desde la interfaz con buena experiencia de usuario.

**Tareas**
- [ ] Zona de **Drag & Drop** + botón para seleccionar archivo.
- [ ] Validar en el navegador **antes de enviar**: tipo permitido y máximo 10 MB.
- [ ] Previsualizar el archivo seleccionado antes de subirlo (opcional pero suma).
- [ ] Empaquetar con **`FormData`** (`archivo`, `titulo`, `subidoPor`) y enviar con
      **XMLHttpRequest** para tener **barra de progreso** real.
- [ ] Estados visuales: inactivo / subiendo (spinner + %) / éxito / error, con alertas claras.
- [ ] Al subir con éxito, llamar `onSubido(archivo)` para que la galería se recargue.

**Archivos que le pertenecen**
- `client/src/components/upload/*` (`UploadForm.jsx`, `DropZone.jsx`, `ProgressBar.jsx`)
- `client/src/components/ui/*` (`Alert.jsx`, `Spinner.jsx`) — compartidos, los crea Rol 4
- `client/src/services/api.js` → función `subirArchivo`
- `client/src/constants/archivos.js` (coordinar con Rol 2)

**Criterio de terminado:** se puede arrastrar una imagen, ver el progreso, ver mensaje de éxito y la
galería se actualiza sola. Un archivo de 15 MB se rechaza **sin** hacer petición al servidor.

---

## Rol 5 — Frontend: Galería Multimedia, Filtros y QA

**Objetivo:** mostrar los archivos con vista previa nativa, filtrar, borrar y asegurar calidad.

**Tareas**
- [ ] Galería que consume `GET /api/archivos` (con estados cargando / vacío / error).
- [ ] Tarjeta con vista previa según tipo: `<img>` para imagen, `<video controls>` para video,
      `<iframe>`/`<embed>` o enlace "Abrir PDF" para PDF.
- [ ] Mostrar metadatos: título, peso formateado (KB/MB), tipo, fecha legible, autor.
- [ ] Filtros por tipo (Todos / Imágenes / Videos / PDF) y búsqueda por título.
- [ ] Botón eliminar con confirmación → `DELETE` → quitar la tarjeta **inmediatamente** de la UI.
- [ ] Diseño **responsivo** (grid que se adapta a celular).
- [ ] **QA**: probar el flujo completo, revisar que no haya errores en consola (navegador y servidor),
      llenar la sección de pruebas en [ESTADO.md](ESTADO.md).

**Archivos que le pertenecen**
- `client/src/components/gallery/*` (`Gallery.jsx`, `FileCard.jsx`, `MediaPreview.jsx`, `Filters.jsx`)
- `client/src/services/api.js` → funciones `listarArchivos`, `eliminarArchivo`
- `client/src/utils/formato.js`

**Criterio de terminado:** los 3 tipos se ven con su vista previa correcta, los filtros funcionan, y
borrar quita la tarjeta sin recargar la página. Consola del navegador sin errores.

---

## Archivos compartidos (avisar antes de tocarlos)

| Archivo | Quién lo coordina |
|---|---|
| `server/src/app.js`, `server/src/index.js` | Rol 2 / Rol 3 (base ya hecha) |
| `client/src/App.jsx`, `client/src/index.css` | Rol 4 / Rol 5 (base ya hecha) |
| `README.md` | Todos (cada uno llena su fila) |
| `docs/API.md` | Rol 2 / Rol 3 |
| `docs/ESTADO.md` | Todos (cada uno actualiza lo suyo) |
