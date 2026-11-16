// Comunicación con Cloudinary (subir y eliminar).
//   subirACloud    -> Dueño: Rol 2 ya lo hice si algo
//   eliminarDeCloud -> Dueño: Rol 3
import cloudinary from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

/**
 * Sube un archivo (buffer en memoria) a Cloudinary.
 * @param {Buffer} buffer  req.file.buffer
 * @returns {Promise<{ url: string, publicId: string, resourceType: string, bytes: number }>}
 */
export async function subirACloud(buffer) {
  try {
    const resultado = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: env.CLOUDINARY_FOLDER, resource_type: 'auto' },
        (error, result) => (error ? reject(error) : resolve(result)),
      );
      stream.end(buffer);
    });
    return {
      url: resultado.secure_url,
      publicId: resultado.public_id,
      resourceType: resultado.resource_type, // 'image' | 'video' | 'raw'  (un PDF queda como 'image')
      bytes: resultado.bytes,
    };
  } catch (error) {
    console.error('[cloudinary] Falló la subida:', error?.message ?? error);
    throw new HttpError(502, 'ERROR_NUBE', 'No se pudo subir el archivo a la nube. Intenta de nuevo.');
  }
}

/**
 * Elimina un recurso de Cloudinary.
 * @param {string} publicId      guardado en la BD
 * @param {string} resourceType  guardado en la BD ('image' | 'video' | 'raw')
 */
export async function eliminarDeCloud(publicId, resourceType) {
  // TODO(Rol 3):
  //   const r = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
  //   - r.result === 'ok'        -> borrado.
  //   - r.result === 'not found' -> ya no existía en la nube; tratarlo como borrado (ver docs/API.md).
  //   - cualquier otra cosa o excepción -> new HttpError(502, 'ERROR_NUBE', 'No se pudo eliminar el archivo de la nube.')
  //    Si resource_type no coincide con el real, Cloudinary responde 'not found' aunque exista:
  //      por eso guardamos resourceType en la BD al subir.
  void publicId;
  void resourceType;
  throw new HttpError(501, 'NO_IMPLEMENTADO', 'eliminarDeCloud aún no está implementado (Rol 3).');
}
