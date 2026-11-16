// Manejador de errores central.  Dueño: Rol 2
// Todos los errores terminan aquí y salen con el formato { ok: false, error: { codigo, mensaje } }.
// Express 5 ya envía aquí los errores de funciones async (no hace falta try/catch + next(err)).
import multer from 'multer';
import { HttpError } from '../utils/HttpError.js';
import { MAX_MB } from '../constants/archivos.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  // Errores de multer -> formato del contrato (docs/API.md)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        ok: false,
        error: { codigo: 'ARCHIVO_MUY_GRANDE', mensaje: `El archivo supera el límite de ${MAX_MB} MB.` },
      });
    }
    const mensaje =
      err.code === 'LIMIT_UNEXPECTED_FILE'
        ? 'Envía un solo archivo en el campo "archivo".'
        : 'La petición de subida no es válida.';
    return res.status(400).json({ ok: false, error: { codigo: 'DATOS_INVALIDOS', mensaje } });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      ok: false,
      error: { codigo: err.codigo, mensaje: err.message },
    });
  }

  // JSON mal formado en el body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      ok: false,
      error: { codigo: 'DATOS_INVALIDOS', mensaje: 'El cuerpo de la petición no es JSON válido.' },
    });
  }

  // Error inesperado: se registra completo en la consola del servidor, pero al cliente
  // solo le llega un mensaje genérico (no exponer detalles internos).
  console.error('[error]', err);
  return res.status(500).json({
    ok: false,
    error: { codigo: 'ERROR_INTERNO', mensaje: 'Ocurrió un error inesperado en el servidor.' },
  });
}
