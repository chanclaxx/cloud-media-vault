// Manejador de errores central.  Dueño: Rol 2
// Todos los errores terminan aquí y salen con el formato { ok: false, error: { codigo, mensaje } }.
// Express 5 ya envía aquí los errores de funciones async (no hace falta try/catch + next(err)).
import { HttpError } from '../utils/HttpError.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  // TODO(Rol 2): traducir los errores de multer (err instanceof multer.MulterError):
  //   - err.code === 'LIMIT_FILE_SIZE'       -> 413 'ARCHIVO_MUY_GRANDE' ("El archivo supera el límite de 10 MB.")
  //   - err.code === 'LIMIT_UNEXPECTED_FILE' -> 400 'DATOS_INVALIDOS'  (campo con nombre distinto a "archivo"
  //                                             o más de un archivo)
  //   - otros códigos de multer               -> 400 'DATOS_INVALIDOS'
  //   (Importar: import multer from 'multer';)

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
