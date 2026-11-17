import cloudinary from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

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
      resourceType: resultado.resource_type,
      bytes: resultado.bytes,
    };
  } catch (error) {
    console.error('[cloudinary] Falló la subida:', error?.message ?? error);
    throw new HttpError(502, 'ERROR_NUBE', 'No se pudo subir el archivo a la nube. Intenta de nuevo.');
  }
}

export async function eliminarDeCloud(publicId, resourceType) {
  let resultado;
  try {
    resultado = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
  } catch (error) {
    console.error('[cloudinary] Falló la eliminación de', publicId, '-', error?.message ?? error?.error?.message ?? error);
    throw new HttpError(502, 'ERROR_NUBE', 'No se pudo eliminar el archivo de la nube. Intenta de nuevo.');
  }

  if (resultado?.result === 'ok') return { estado: 'eliminado' };

  if (resultado?.result === 'not found') {
    console.warn(`[cloudinary] ${publicId} no existía en la nube; se continúa con la BD.`);
    return { estado: 'no_existia' };
  }

  console.error('[cloudinary] Respuesta inesperada al eliminar', publicId, resultado);
  throw new HttpError(502, 'ERROR_NUBE', 'No se pudo eliminar el archivo de la nube. Intenta de nuevo.');
}
