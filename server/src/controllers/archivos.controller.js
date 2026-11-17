import path from 'node:path';
import mongoose from 'mongoose';
import { HttpError } from '../utils/HttpError.js';
import { CATEGORIAS, categoriaDeMime } from '../constants/archivos.js';
import { subirACloud, eliminarDeCloud } from '../services/cloudStorage.js';
import { firmaCoincideConMime } from '../utils/firmaArchivo.js';
import { Archivo } from '../models/Archivo.js';

const MAX_LARGO_BUSQUEDA = 100;

function textoDeQuery(valor, nombre) {
  if (valor === undefined) return '';
  if (typeof valor !== 'string') {
    throw new HttpError(400, 'DATOS_INVALIDOS', `El parámetro "${nombre}" debe enviarse una sola vez.`);
  }
  return valor.trim();
}

function escaparRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function crearArchivo(req, res) {
  if (!req.file) {
    throw new HttpError(400, 'ARCHIVO_REQUERIDO', 'Debes adjuntar un archivo.');
  }

  const subidoPor = req.body.subidoPor?.trim();
  if (!subidoPor) {
    throw new HttpError(400, 'DATOS_INVALIDOS', 'El campo "subidoPor" es obligatorio.');
  }

  if (!firmaCoincideConMime(req.file.buffer, req.file.mimetype)) {
    throw new HttpError(415, 'TIPO_NO_PERMITIDO', 'El contenido del archivo no corresponde a su tipo declarado.');
  }

  const titulo = req.body.titulo?.trim() || path.parse(req.file.originalname).name;
  const tipoArchivo = categoriaDeMime(req.file.mimetype);
  const subida = await subirACloud(req.file.buffer);

  let archivo;
  try {
    archivo = await Archivo.create({
      titulo,
      nombreOriginal: req.file.originalname,
      url: subida.url,
      publicId: subida.publicId,
      resourceType: subida.resourceType,
      tipoArchivo,
      mimeType: req.file.mimetype,
      tamanoBytes: req.file.size,
      subidoPor,
    });
  } catch (error) {
    await eliminarDeCloud(subida.publicId, subida.resourceType).catch(() => {
      console.error(`[rollback] Quedó un archivo huérfano en la nube: ${subida.publicId}`);
    });

    if (error instanceof mongoose.Error.ValidationError) {
      const campos = Object.keys(error.errors).join(', ');
      throw new HttpError(400, 'DATOS_INVALIDOS', `Datos inválidos en: ${campos}. (El título admite máximo 120 caracteres.)`);
    }
    throw error;
  }

  return res.status(201).json({ ok: true, data: archivo });
}

export async function listarArchivos(req, res) {
  const tipo = textoDeQuery(req.query.tipo, 'tipo');
  const q = textoDeQuery(req.query.q, 'q');
  const orden = textoDeQuery(req.query.orden, 'orden');

  const filtro = {};

  if (tipo) {
    if (!CATEGORIAS.includes(tipo)) {
      throw new HttpError(400, 'DATOS_INVALIDOS', `Tipo no válido: "${tipo}". Usa: ${CATEGORIAS.join(', ')}.`);
    }
    filtro.tipoArchivo = tipo;
  }

  if (q) {
    filtro.titulo = { $regex: escaparRegex(q.slice(0, MAX_LARGO_BUSQUEDA)), $options: 'i' };
  }

  const direccion = orden === 'antiguo' ? 1 : -1;
  const archivos = await Archivo.find(filtro).sort({ fechaSubida: direccion, _id: direccion });

  res.json({ ok: true, data: archivos });
}

export async function eliminarArchivo(req, res) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(400, 'ID_INVALIDO', 'El id del archivo no es válido.');
  }

  const archivo = await Archivo.findById(id);
  if (!archivo) {
    throw new HttpError(404, 'NO_ENCONTRADO', 'El archivo no existe o ya fue eliminado.');
  }

  await eliminarDeCloud(archivo.publicId, archivo.resourceType);
  await Archivo.findByIdAndDelete(id);

  res.json({ ok: true, data: { id } });
}
