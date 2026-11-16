// Punto de entrada del servidor.
// Orden: cargar variables -> configurar Cloudinary -> conectar MongoDB -> escuchar peticiones.
// (Base compartida: coordinar con Rol 2 / Rol 3 antes de modificar.)
import { env } from './config/env.js';
import { configurarCloudinary } from './config/cloudinary.js';
import { conectarDB } from './config/db.js';
import app from './app.js';

configurarCloudinary();
await conectarDB();

app.listen(env.PORT, () => {
  console.log(`[server] API escuchando en http://localhost:${env.PORT}`);
  console.log(`[server] CORS permitido para: ${env.CORS_ORIGINS.join(', ')}`);
});
