# Guion de la sustentación (máximo 8 minutos)

> Ensayar al menos una vez completo con cronómetro. Tener todo abierto **antes** de empezar.

## Preparación (antes de que empiece el turno)

- [ ] `server` corriendo (`npm run dev` en `server/`) → consola muestra MongoDB y Cloudinary conectados.
- [ ] `client` corriendo (`npm run dev` en `client/`) → `http://localhost:5173` abierto.
- [ ] Pestaña con **Cloudinary → Media Library** (carpeta `cloud-media-vault`).
- [ ] Pestaña con **MongoDB Atlas → Browse Collections** → colección `archivos`.
- [ ] Pestaña con el **repositorio de GitHub** (Insights → Contributors y el README).
- [ ] En el escritorio: 1 imagen, 1 video corto (< 10 MB), 1 PDF y 1 archivo de más de 10 MB.
- [ ] Probar el internet del salón; tener plan B (datos del celular).

## Guion

| Tiempo | Quién | Qué se muestra |
|---|---|---|
| 0:00–1:00 | Rol 1 | Arquitectura (diagrama del README), por qué Ruta B, Cloudinary y MongoDB Atlas. Mostrar `.env.example` y que `.env` no está en GitHub. |
| 1:00–2:30 | Rol 4 | Subir una imagen arrastrándola: validación, barra de progreso, mensaje de éxito. Intentar subir el archivo de > 10 MB → rechazo. |
| 2:30–3:30 | Rol 2 + Rol 1 | Mostrar que **apareció en Cloudinary** (refrescar Media Library). Explicar multer + validación en servidor. |
| 3:30–4:30 | Rol 3 + Rol 1 | Mostrar el **nuevo documento en Atlas** (url, publicId, tamaño, MIME, fecha, autor). |
| 4:30–5:30 | Rol 5 | Galería: vista previa de imagen, video y PDF; filtros por tipo y búsqueda. |
| 5:30–7:00 | Rol 3 + Rol 5 | **Eliminar** desde la web → la tarjeta desaparece al instante → refrescar Cloudinary y Atlas: ya no está en ninguno. |
| 7:00–8:00 | Todos | GitHub: Contributors / commits por rol, README. Preguntas. |

## Preguntas probables (preparar respuesta)

- ¿Por qué el archivo no se guarda en el servidor? → multer `memoryStorage`, se envía el buffer a
  Cloudinary; la BD solo guarda la referencia.
- ¿Por qué se borra primero en la nube y luego en la BD? → si se borrara primero la BD y falla la
  nube, quedaría un archivo huérfano imposible de encontrar (perdimos su `publicId`).
- ¿Qué pasa si falla la BD después de subir? → se borra lo subido a Cloudinary (rollback).
- ¿Por qué validar en cliente **y** servidor? → el cliente da buena UX; el servidor es la seguridad
  real (se puede saltar el frontend con curl).
- ¿Para qué sirve CORS? → el navegador bloquea peticiones entre orígenes distintos (5173 → 4000)
  salvo que el servidor lo permita explícitamente.
- ¿Para qué `resourceType`? → Cloudinary exige el tipo (image/video/raw) para borrar un recurso.
