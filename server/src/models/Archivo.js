// Modelo de metadatos de un archivo subido.
// El archivo físico vive en Cloudinary; aquí se guarda su referencia y metadatos.
import mongoose from 'mongoose';
import { CATEGORIAS } from '../constants/archivos.js';

const archivoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    nombreOriginal: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    resourceType: {
      type: String,
      required: true,
      enum: ['image', 'video', 'raw'],
    },
    tipoArchivo: {
      type: String,
      required: true,
      enum: CATEGORIAS,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    tamanoBytes: {
      type: Number,
      required: true,
      min: 0,
    },
    fechaSubida: {
      type: Date,
      default: Date.now,
    },
    subidoPor: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: 'archivos',
    versionKey: false,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  },
);

archivoSchema.index({ tipoArchivo: 1 });
archivoSchema.index({ fechaSubida: -1 });
archivoSchema.index({ titulo: 'text' });

export const Archivo = mongoose.model('Archivo', archivoSchema);
