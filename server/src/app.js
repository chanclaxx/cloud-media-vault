// Configuración de la aplicación Express (middlewares globales, rutas y manejo de errores).
// (Base compartida: coordinar con Rol 2 / Rol 3 antes de modificar.)
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import archivosRoutes from './routes/archivos.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { HttpError } from './utils/HttpError.js';

const app = express();

// CORS: solo el frontend configurado en CORS_ORIGIN puede llamar a la API desde el navegador.
app.use(
  cors({
    origin: env.CORS_ORIGINS,
    methods: ['GET', 'POST', 'DELETE'],
  }),
);

// JSON para peticiones que no son de archivos. Los archivos (multipart/form-data) los procesa multer.
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, data: { estado: 'ok' } });
});

app.use('/api/archivos', archivosRoutes);

// Cualquier ruta que no exista -> 404 con el formato de error del contrato (docs/API.md).
app.use((req, res, next) => {
  next(new HttpError(404, 'RUTA_NO_ENCONTRADA', `No existe la ruta ${req.method} ${req.originalUrl}`));
});

// Debe ir de último.
app.use(errorHandler);

export default app;
