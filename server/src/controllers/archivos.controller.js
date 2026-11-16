// Controladores de /api/archivos. Contrato completo en docs/API.md.
//   crearArchivo   -> Rol 2 (validar + subir a la nube) y Rol 3 (guardar en BD)
//   listarArchivos -> Rol 3
//   eliminarArchivo -> Rol 3
// Express 5: si una función async lanza un error, llega solo a errorHandler (no hace falta try/catch
// salvo que quieras hacer algo antes, como el rollback de crearArchivo).
import { HttpError } from '../utils/HttpError.js';

const noImplementado = (que, rol) =>
  new HttpError(501, 'NO_IMPLEMENTADO', `${que} aún no está implementado (${rol}).`);

/** POST /api/archivos  (multipart/form-data: archivo, titulo?, subidoPor) */
export async function crearArchivo(req, res) {
  // ---------- Parte 1 — TODO(Rol 2): validar y subir ----------
  //   1. Si no hay req.file -> HttpError(400, 'ARCHIVO_REQUERIDO', 'Debes adjuntar un archivo.')
  //   2. subidoPor = req.body.subidoPor?.trim(); si está vacío -> HttpError(400, 'DATOS_INVALIDOS', ...)
  //   3. titulo = req.body.titulo?.trim() || nombre del archivo sin extensión
  //   4. tipoArchivo = categoriaDeMime(req.file.mimetype)   (import desde ../constants/archivos.js)
  //   5. const subida = await subirACloud(req.file.buffer)  (import desde ../services/cloudStorage.js)
  //
  // ---------- Parte 2 — TODO(Rol 3): guardar en la BD ----------
  //   6. try {
  //        const archivo = await Archivo.create({
  //          titulo, nombreOriginal: req.file.originalname, url: subida.url, publicId: subida.publicId,
  //          resourceType: subida.resourceType, tipoArchivo, mimeType: req.file.mimetype,
  //          tamanoBytes: req.file.size, subidoPor,
  //        });
  //        return res.status(201).json({ ok: true, data: archivo });
  //      } catch (error) {
  //        // Rollback: si la BD falla, borrar lo que se acaba de subir para no dejar huérfanos.
  //        await eliminarDeCloud(subida.publicId, subida.resourceType).catch(() => {});
  //        throw error;   // -> errorHandler responde 500
  //      }
  void req;
  void res;
  throw noImplementado('POST /api/archivos', 'Rol 2 y Rol 3');
}

/** GET /api/archivos?tipo=imagen|video|pdf&q=texto&orden=reciente|antiguo */
export async function listarArchivos(req, res) {
  // TODO(Rol 3):
  //   1. Construir el filtro:
  //        - tipo: si viene y no está en CATEGORIAS -> HttpError(400, 'DATOS_INVALIDOS', ...)
  //        - q: búsqueda por título sin distinguir mayúsculas. ¡Escapar caracteres especiales de regex!
  //             const seguro = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  //             filtro.titulo = { $regex: seguro, $options: 'i' };
  //   2. orden: 'antiguo' -> { fechaSubida: 1 }, cualquier otro -> { fechaSubida: -1 }
  //   3. const archivos = await Archivo.find(filtro).sort(orden);
  //   4. res.json({ ok: true, data: archivos });
  void req;
  void res;
  throw noImplementado('GET /api/archivos', 'Rol 3');
}

/** DELETE /api/archivos/:id */
export async function eliminarArchivo(req, res) {
  // TODO(Rol 3): ORDEN OBLIGATORIO (lo pide el profesor): primero la nube, después la BD.
  //   1. Si !mongoose.isValidObjectId(req.params.id) -> HttpError(400, 'ID_INVALIDO', ...)
  //   2. const archivo = await Archivo.findById(id); si no existe -> HttpError(404, 'NO_ENCONTRADO', ...)
  //   3. await eliminarDeCloud(archivo.publicId, archivo.resourceType);
  //      (si lanza error, se detiene aquí y NO se borra de la BD -> no quedan registros sin archivo)
  //   4. await Archivo.findByIdAndDelete(id);
  //   5. res.json({ ok: true, data: { id } });
  void req;
  void res;
  throw noImplementado('DELETE /api/archivos/:id', 'Rol 3');
}
