// Configuración del SDK de Cloudinary.  Dueño: Rol 1
// Los demás módulos importan `cloudinary` desde aquí (no directamente del paquete) para usar
// siempre la instancia ya configurada.
import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

export function configurarCloudinary() {
  // TODO(Rol 1): configurar Cloudinary con las credenciales del .env.
  //   cloudinary.config({
  //     cloud_name: env.CLOUDINARY_CLOUD_NAME,
  //     api_key: env.CLOUDINARY_API_KEY,
  //     api_secret: env.CLOUDINARY_API_SECRET,
  //     secure: true, // URLs https
  //   });
  //   console.log(`[cloudinary] Configurado para la cuenta "${env.CLOUDINARY_CLOUD_NAME}"`);
  //   (NO imprimir api_key ni api_secret.)
  //
  //   Recordatorio de panel: Settings -> Security -> activar "Allow delivery of PDF and ZIP files",
  //   si no, los PDF subidos devuelven 401 al abrirlos.
  void env;
  console.warn('[cloudinary] TODO(Rol 1): la configuración de Cloudinary aún no está implementada.');
}

export default cloudinary;
