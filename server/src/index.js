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
