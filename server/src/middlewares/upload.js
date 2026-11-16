// Middleware de multer para recibir el archivo (multipart/form-data).  Dueño: Rol 2
import multer from 'multer';
import { MAX_BYTES, categoriaDeMime } from '../constants/archivos.js';
import { HttpError } from '../utils/HttpError.js';

// TODO(Rol 2): reemplazar el middleware temporal por multer real:
//
//   const upload = multer({
//     storage: multer.memoryStorage(),   // el archivo queda en req.file.buffer, NO en el disco
//     limits: { fileSize: MAX_BYTES, files: 1 },
//     fileFilter: (req, file, cb) => {
//       if (categoriaDeMime(file.mimetype)) return cb(null, true);
//       cb(new HttpError(415, 'TIPO_NO_PERMITIDO',
//          `Tipo de archivo no permitido (${file.mimetype}). Solo imágenes, videos y PDF.`));
//     },
//   });
//
//   export const uploadArchivo = upload.single('archivo');   // "archivo" = nombre del campo (docs/API.md)
//
// Notas:
//   - NO usar diskStorage: el requisito es que el archivo viva SOLO en la nube.
//   - El error de tamaño (LIMIT_FILE_SIZE) lo traduce errorHandler.js a 413.
//   - Extra (suma en "manejo robusto"): file.mimetype lo declara el navegador y se puede falsificar.
//     Se puede verificar la "firma" real del archivo (primeros bytes del buffer) en el controlador.

void multer;
void MAX_BYTES;
void categoriaDeMime;
void HttpError;

// Temporal: deja pasar la petición sin procesar el archivo (el controlador responde 501).
export function uploadArchivo(req, res, next) {
  next();
}
