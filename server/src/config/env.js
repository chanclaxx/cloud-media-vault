// Carga y expone las variables de entorno. Dueño: Sebastian Montaño
// Requiere Node.js >= 21.7 para process.loadEnvFile().

try {
  process.loadEnvFile();
} catch {
  console.warn(
    '[env] No se pudo cargar .env. Copia server/.env.example como server/.env y complétalo.'
  );
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

const obligatorias = [
  'MONGODB_URI',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

const faltantes = obligatorias.filter(
  (nombre) => !process.env[nombre]?.trim()
);

if (faltantes.length > 0) {
  console.error(
    `[env] Faltan variables obligatorias: ${faltantes.join(', ')}`
  );
  process.exit(1);
}