// Carga y expone las variables de entorno.  Dueño: Rol 1
//
// Usa process.loadEnvFile() (incluido en Node >= 21.7), así no necesitamos la librería dotenv.
// Lee el archivo .env de la carpeta desde donde se ejecuta `npm run dev` (server/).

try {
  process.loadEnvFile();
} catch {
  console.warn('[env] No se encontró server/.env. Copia server/.env.example como server/.env y llénalo.');
}

export const env = {
  PORT: Number(process.env.PORT) || 4000,
  CORS_ORIGINS: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origen) => origen.trim())
    .filter(Boolean),
  MONGODB_URI: process.env.MONGODB_URI || '',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER || 'cloud-media-vault',
};

// TODO(Rol 1): validar las variables obligatorias al arrancar.
//   - Obligatorias: MONGODB_URI, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
//   - Si falta alguna, mostrar UN mensaje claro con la lista de las que faltan y terminar el proceso
//     (process.exit(1)). Es mejor fallar al inicio que con un error raro en la primera subida.
//   - NUNCA imprimir los valores (son secretos); solo los nombres de las que faltan.
