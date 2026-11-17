import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import archivosRoutes from './routes/archivos.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { HttpError } from './utils/HttpError.js';

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGINS,
    methods: ['GET', 'POST', 'DELETE'],
  }),
);

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, data: { estado: 'ok' } });
});

app.use('/api/archivos', archivosRoutes);

app.use((req, res, next) => {
  next(new HttpError(404, 'RUTA_NO_ENCONTRADA', `No existe la ruta ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

export default app;
