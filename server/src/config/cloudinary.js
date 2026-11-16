// Configuración del SDK de Cloudinary. Dueño: Sebastian Montaño
import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

export function configurarCloudinary() {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  console.log(
    `[cloudinary] Configurado para la cuenta "${env.CLOUDINARY_CLOUD_NAME}"`
  );

  return cloudinary;
}

export default cloudinary;
