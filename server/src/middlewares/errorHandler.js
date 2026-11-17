import multer from 'multer';
import { HttpError } from '../utils/HttpError.js';
import { MAX_MB } from '../constants/archivos.js';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

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

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      ok: false,
      error: { codigo: 'DATOS_INVALIDOS', mensaje: 'El cuerpo de la petición no es JSON válido.' },
    });
  }

  console.error('[error]', err);
  return res.status(500).json({
    ok: false,
    error: { codigo: 'ERROR_INTERNO', mensaje: 'Ocurrió un error inesperado en el servidor.' },
  });
}
