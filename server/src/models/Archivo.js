// Modelo de metadatos de un archivo subido.  Dueño: Rol 1
// El archivo físico vive SOLO en Cloudinary; aquí guardamos la referencia (url, publicId) y metadatos.
// La forma final del JSON que devuelve la API está en docs/API.md ("Objeto Archivo").
import mongoose from 'mongoose';
import { CATEGORIAS } from '../constants/archivos.js';

const archivoSchema = new mongoose.Schema(
  {
    // TODO(Rol 1): definir los campos. Campos pedidos por el profesor + 3 nuestros:
    //
    //   titulo         String, requerido, trim, maxlength ~120
    //   nombreOriginal String, requerido            (nombre del archivo que subió el usuario)
    //   url            String, requerido            (secure_url de Cloudinary)
    //   publicId       String, requerido, unique    (public_id de Cloudinary, para borrar)
    //   resourceType   String, requerido, enum ['image', 'video', 'raw']  (para borrar en Cloudinary)
    //   tipoArchivo    String, requerido, enum CATEGORIAS  ('imagen' | 'video' | 'pdf')
    //   mimeType       String, requerido            (ej. 'image/png')
    //   tamanoBytes    Number, requerido, min 0
    //   fechaSubida    Date, default: Date.now      (tipo Date, NO string: la rúbrica revisa fechas)
    //   subidoPor      String, requerido, trim      (autor)
  },
  {
    collection: 'archivos',
    versionKey: false,
    // TODO(Rol 1): en toJSON, transformar `_id` -> `id` (string) y quitar `_id`,
    //   para que el frontend reciba exactamente el formato de docs/API.md. Ejemplo:
    //   toJSON: { transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; return ret; } }
  },
);

// TODO(Rol 1): índices para que las consultas sean "ordenadas y óptimas" (rúbrica criterio 2):
//   archivoSchema.index({ fechaSubida: -1 });
//   archivoSchema.index({ tipoArchivo: 1, fechaSubida: -1 });
void CATEGORIAS;

export const Archivo = mongoose.model('Archivo', archivoSchema);
