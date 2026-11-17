import multer from 'multer';
import { MAX_BYTES, categoriaDeMime } from '../constants/archivos.js';
import { HttpError } from '../utils/HttpError.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    if (categoriaDeMime(file.mimetype)) return cb(null, true);
    cb(
      new HttpError(
        415,
        'TIPO_NO_PERMITIDO',
        `Tipo de archivo no permitido (${file.mimetype}). Solo imágenes, videos y PDF.`,
      ),
    );
  },
});

export const uploadArchivo = upload.single('archivo');
