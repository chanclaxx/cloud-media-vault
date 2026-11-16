# client/CLAUDE.md — Notas del frontend (Roles 4 y 5)

> Complementa el [CLAUDE.md raíz](../CLAUDE.md). Las reglas de allá aplican aquí también
> (repo limpio, no commits sin permiso, actualizar docs/ESTADO.md).

## Stack

- **React 19** + **Vite 8**, JavaScript (JSX), ES Modules. Sin TypeScript, sin librerías de UI.
- Sin librerías extra para HTTP: `fetch` (listar/borrar) y `XMLHttpRequest` (subir, por el progreso).
- Estilos: CSS plano. Variables de color en `src/index.css` (tiene modo oscuro). Cada componente puede
  tener su `.css` al lado e importarlo.
- `npm run dev` → `http://localhost:5173` (puerto fijo: el servidor solo permite ese origen por CORS).

## Estructura

| Archivo | Dueño | Qué hace |
|---|---|---|
| `src/App.jsx` | compartido | layout; conecta formulario y galería con `version` |
| `src/index.css` | compartido | estilos globales y variables |
| `src/config.js` | compartido | `API_URL` desde `VITE_API_URL` |
| `src/services/api.js` | Rol 4 / Rol 5 | `subirArchivo` (Rol 4), `listarArchivos` y `eliminarArchivo` (Rol 5); `pedirJSON` ya está hecho |
| `src/constants/archivos.js` | Rol 4 | MIME permitidos, 10 MB, `ACCEPT`, `FILTROS_TIPO` (copia del server) |
| `src/components/upload/*` | Rol 4 | `UploadForm`, `DropZone`, `ProgressBar` |
| `src/components/ui/*` | Rol 4 | `Alert`, `Spinner` (los usa también Rol 5) |
| `src/components/gallery/*` | Rol 5 | `Gallery`, `FileCard`, `MediaPreview`, `Filters` |
| `src/utils/formato.js` | Rol 5 | `formatearBytes`, `formatearFecha` |

Cada componente tiene arriba un comentario con sus **props** (el acuerdo entre Rol 4 y Rol 5) y los
`TODO(Rol N)` con los pasos. No cambies las props de un componente de otro rol sin avisar.

## Comunicación entre formulario y galería

```
UploadForm --onSubido()--> App (version + 1) --version--> Gallery (vuelve a pedir la lista)
Gallery --eliminarArchivo(id)--> API --200--> setArchivos(prev => prev.filter(...))  (sin recargar)
```

## Lo que la rúbrica revisa en la UI (criterio 3 y 4)

- Drag & Drop funcionando (y también selector normal).
- Validación de tipo/peso **antes** de enviar (sin petición si no pasa).
- Estados visibles: cargando (spinner/barra), éxito, error.
- Vista previa **diferenciada**: `<img>`, `<video controls>`, PDF (`<iframe>`/miniatura + enlace).
- Peso en KB/MB, tipo, fecha legible, autor.
- Filtros por tipo + búsqueda por título.
- Al eliminar, la tarjeta desaparece **al instante**.
- Responsivo (probar con DevTools en modo celular).
- **Consola del navegador sin errores ni warnings** (ej. falta de `key` en listas → usar `key={archivo.id}`).

## Errores típicos

- "blocked by CORS policy" → el server no está corriendo, o el client no está en el puerto 5173,
  o `CORS_ORIGIN` en `server/.env` no coincide.
- Al soltar un archivo el navegador lo abre → falta `e.preventDefault()` en `onDragOver` **y** `onDrop`.
- `FormData` con `Content-Type` puesto a mano → el servidor no encuentra el archivo. No ponerlo.
- PDF da 401 → falta activar la entrega de PDF en Cloudinary (Rol 1).
- `useEffect` se ejecuta dos veces en desarrollo → es normal por `StrictMode`; no es un bug.

## Cómo probar sin ensuciar el repo

- Prueba en el navegador con archivos de tu carpeta personal (Descargas, Escritorio). **No copies
  imágenes/videos/PDF de prueba dentro de `client/`** (ni en `public/` ni en `src/assets/`).
- Si quieres un componente de prueba o un experimento, hazlo **fuera** del repo (`../taller3-pruebas/`)
  o en el scratchpad de Claude.
- No dejes `console.log` de depuración al hacer commit.
