# Enunciado del taller (resumen) y checklist de la rúbrica

> Fuente: *Taller Práctico Colaborativo: Gestor de Activos Multimedia en la Nube (Cloud Media Vault)*,
> Desarrollo de Experiencias Multimedia para la Web, UAO. Equipos de 4 a 5. Nota máxima: 5.0.
> Este archivo resume el PDF del profesor para tenerlo a mano en el repo.

## Objetivo

Aplicación web fullstack que:
1. Sube archivos multimedia (imágenes, videos, PDF) a un **almacenamiento en la nube**.
2. Guarda sus **metadatos** (URL pública, nombre, tamaño, tipo MIME, fecha y autor) en una
   **base de datos** mediante una **API REST**.

## Decisiones del equipo

| Tema | Elegido | Alternativas permitidas por el profesor |
|---|---|---|
| Arquitectura | **Ruta B**: React (Vite) + API Express (multer, cors) | Ruta A: Next.js App Router |
| Almacenamiento | **Cloudinary** | Supabase Storage, UploadThing, Firebase Storage |
| Base de datos | **MongoDB Atlas + Mongoose** | PostgreSQL en Neon + Prisma |

Todo en capa gratuita, sin tarjeta de crédito.

## Requerimientos funcionales

1. **Carga multimedia validada**: al menos 3 categorías (imagen, video, PDF), límite de **10 MB**,
   retroalimentación clara durante la subida.
2. **Almacenamiento dual desacoplado**: el archivo físico vive **solo** en Cloudinary; la BD guarda
   **solo** la referencia (`url`, `publicId`) y metadatos.
3. **Visualización y filtrado**: cada tarjeta muestra vista previa, nombre, peso formateado (KB/MB),
   tipo, fecha de subida; se puede filtrar por categoría.
4. **Eliminación sincronizada**: al borrar desde la UI, el backend borra **primero en la nube**
   (por `publicId`) y **después** en la BD.

## Modelo de metadatos pedido (Rol 1)

`id`, `titulo`, `url`, `publicId`, `tipoArchivo`, `tamanoBytes`, `fechaSubida`, `subidoPor`
(+ `mimeType` y `resourceType`, que agregamos nosotros; ver [API.md](API.md)).

## Entregables

1. **Repositorio en GitHub**
   - [ ] Commits de **todos** los integrantes, acordes a su rol.
   - [ ] Sin `node_modules` ni `.env` reales; con `.env.example`.
   - [ ] `README.md` con nombres, rol de cada uno, diagrama/explicación de arquitectura e
         instrucciones de ejecución.
2. **Sustentación en vivo (máx. 8 min)** — ver [SUSTENTACION.md](SUSTENTACION.md)
   - [ ] Subir archivo desde la web → mostrarlo en el panel de Cloudinary → mostrar el registro en la BD.
   - [ ] Eliminar desde la web → comprobar que se borró en Cloudinary **y** en la BD.

## Rúbrica — qué hace falta para sacar 5 en cada criterio

| # | Criterio (peso) | Para 5.0 ("Excelente") | Responsables |
|---|---|---|---|
| 1 | Subida a la nube y binarios (25%) | Flujo impecable de `multipart/form-data`, transferencia segura a la nube, validación de formato/peso y **manejo robusto de errores** | Rol 2 (+ Rol 4) |
| 2 | Persistencia de metadatos (25%) | Persistencia completa (`url`, `publicId`, tamaño, MIME, fecha, autor) con **consultas ordenadas** y óptimas (índices) | Rol 1, Rol 3 |
| 3 | Interfaz y experiencia multimedia (20%) | UI intuitiva y **responsiva**, **Drag & Drop**, estados de carga/éxito/error, vistas previas nativas, **filtros por tipo** | Rol 4, Rol 5 |
| 4 | Eliminación sincronizada y seguridad (15%) | Eliminación sincronizada (nube + BD), **UI se actualiza al instante**, **CORS configurado**, `.env` protegido | Rol 3, Rol 5, Rol 1 |
| 5 | Trabajo colaborativo y sustentación (15%) | Historial de GitHub **equilibrado por roles**, README documentado, demo fluida del flujo completo | Todos |

### Lo que baja la nota (evitarlo)
- Subir sin validar tipos/tamaños o sin manejar errores de red → 3.0 en criterio 1.
- Fechas o tipos de datos mal guardados → 3.0 en criterio 2.
- Sin vista previa diferenciada imagen/video/PDF → 3.0 en criterio 3.
- Borrar sin que la UI se actualice, o errores de CORS → 3.0 en criterio 4.
- Archivos huérfanos en la nube (o en la BD) → 2.0 en criterio 4.
- Credenciales expuestas o historial desordenado → 2.0 en criterio 5.
- Trabajo hecho visiblemente por 1 o 2 personas → 1.0 en criterio 5.
