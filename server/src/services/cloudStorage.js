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
 * Elimina un recurso de Cloudinary.  Dueño: Rol 3
 * @param {string} publicId      guardado en la BD
 * @param {string} resourceType  guardado en la BD ('image' | 'video' | 'raw')
 * @returns {Promise<{ estado: 'eliminado' | 'no_existia' }>}
 * @throws {HttpError} 502 ERROR_NUBE si Cloudinary falla
 */
export async function eliminarDeCloud(publicId, resourceType) {
  // ⚠️ resource_type debe ser el mismo con el que se subió (por eso se guarda en la BD):
  //    si no coincide, Cloudinary responde 'not found' aunque el archivo exista.
  let resultado;
  try {
    resultado = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true, // limpia la copia en caché del CDN para que la URL deje de servir el archivo
    });
  } catch (error) {
    // El SDK a veces rechaza con { error: { message } } en lugar de un Error normal.
    console.error('[cloudinary] Falló la eliminación de', publicId, '-', error?.message ?? error?.error?.message ?? error);
    throw new HttpError(502, 'ERROR_NUBE', 'No se pudo eliminar el archivo de la nube. Intenta de nuevo.');
  }

  if (resultado?.result === 'ok') return { estado: 'eliminado' };

  // Ya no estaba en la nube: se considera borrado para poder limpiar la BD (docs/API.md).
  if (resultado?.result === 'not found') {
    console.warn(`[cloudinary] ${publicId} no existía en la nube; se continúa con la BD.`);
    return { estado: 'no_existia' };
  }

  console.error('[cloudinary] Respuesta inesperada al eliminar', publicId, resultado);
  throw new HttpError(502, 'ERROR_NUBE', 'No se pudo eliminar el archivo de la nube. Intenta de nuevo.');
}
