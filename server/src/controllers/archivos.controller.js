// Controladores de /api/archivos. Contrato completo en docs/API.md.
//   crearArchivo   -> Rol 2 (validar + subir a la nube) y Rol 3 (guardar en BD)
//   listarArchivos -> Rol 3
//   eliminarArchivo -> Rol 3
// Express 5: si una función async lanza un error, llega solo a errorHandler (no hace falta try/catch
// salvo que quieras hacer algo antes, como el rollback de crearArchivo).
import path from 'node:path';
import mongoose from 'mongoose';
import { HttpError } from '../utils/HttpError.js';
import { CATEGORIAS, categoriaDeMime } from '../constants/archivos.js';
import { subirACloud, eliminarDeCloud } from '../services/cloudStorage.js';
import { firmaCoincideConMime } from '../utils/firmaArchivo.js';
import { Archivo } from '../models/Archivo.js';

const MAX_LARGO_BUSQUEDA = 100;

/**
 * Lee un parámetro de la query como texto. Express 5 convierte `?tipo=a&tipo=b` en un arreglo:
 * eso no es válido en nuestra API, así que se rechaza con 400.
 */
function textoDeQuery(valor, nombre) {
  if (valor === undefined) return '';
  if (typeof valor !== 'string') {
    throw new HttpError(400, 'DATOS_INVALIDOS', `El parámetro "${nombre}" debe enviarse una sola vez.`);
  }
  return valor.trim();
}

/** Escapa los caracteres especiales de una expresión regular (la búsqueda es texto literal). */
function escaparRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** POST /api/archivos  (multipart/form-data: archivo, titulo?, subidoPor) */
export async function crearArchivo(req, res) {
  // ---------- Parte 1 (Rol 2): validar y subir ----------
  if (!req.file) {
    throw new HttpError(400, 'ARCHIVO_REQUERIDO', 'Debes adjuntar un archivo.');
  }

  const subidoPor = req.body.subidoPor?.trim();
  if (!subidoPor) {
    throw new HttpError(400, 'DATOS_INVALIDOS', 'El campo "subidoPor" es obligatorio.');
  }

  // El MIME lo declara el navegador: se contrasta con los primeros bytes reales del archivo.
  if (!firmaCoincideConMime(req.file.buffer, req.file.mimetype)) {
    throw new HttpError(415, 'TIPO_NO_PERMITIDO', 'El contenido del archivo no corresponde a su tipo declarado.');
  }

  const titulo = req.body.titulo?.trim() || path.parse(req.file.originalname).name;
  const tipoArchivo = categoriaDeMime(req.file.mimetype);
  const subida = await subirACloud(req.file.buffer);

  // ---------- Parte 2 (Rol 3): guardar los metadatos en la BD ----------
  // Solo se llega aquí si la subida a la nube se confirmó (subirACloud lanza error si falla).
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
      // fechaSubida: la pone el modelo (default: Date.now)
    });
  } catch (error) {
    // Rollback: la BD falló, así que se borra lo recién subido para no dejar archivos huérfanos en la nube.
    await eliminarDeCloud(subida.publicId, subida.resourceType).catch(() => {
      console.error(`[rollback] Quedó un archivo huérfano en la nube: ${subida.publicId}`);
    });

    // Datos que no cumplen el esquema (ej. título de más de 120 caracteres) -> error del usuario, no del servidor.
    if (error instanceof mongoose.Error.ValidationError) {
      const campos = Object.keys(error.errors).join(', ');
      throw new HttpError(400, 'DATOS_INVALIDOS', `Datos inválidos en: ${campos}. (El título admite máximo 120 caracteres.)`);
    }
    throw error; // -> errorHandler responde 500 ERROR_INTERNO
  }

  return res.status(201).json({ ok: true, data: archivo });
}

/** GET /api/archivos?tipo=imagen|video|pdf&q=texto&orden=reciente|antiguo */
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
    // Búsqueda parcial en el título, sin distinguir mayúsculas. Se escapa para que "(" o "." se busquen
    // literalmente y no rompan la consulta; se limita el largo para evitar consultas abusivas.
    filtro.titulo = { $regex: escaparRegex(q.slice(0, MAX_LARGO_BUSQUEDA)), $options: 'i' };
  }

  // Más reciente primero por defecto. _id desempata archivos subidos en el mismo milisegundo.
  const direccion = orden === 'antiguo' ? 1 : -1;
  const archivos = await Archivo.find(filtro).sort({ fechaSubida: direccion, _id: direccion });

  res.json({ ok: true, data: archivos });
}

/** DELETE /api/archivos/:id */
export async function eliminarArchivo(req, res) {
  const { id } = req.params;

  // Sin esta validación, Mongoose lanzaría un CastError y la API respondería 500.
  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(400, 'ID_INVALIDO', 'El id del archivo no es válido.');
  }

  const archivo = await Archivo.findById(id);
  if (!archivo) {
    throw new HttpError(404, 'NO_ENCONTRADO', 'El archivo no existe o ya fue eliminado.');
  }

  // ORDEN OBLIGATORIO (lo pide el profesor): 1º la nube, 2º la BD.
  // Si la nube falla, eliminarDeCloud lanza 502 y la ejecución se detiene aquí: el registro sigue en la
  // BD (con su publicId), así se puede reintentar y nunca queda un archivo en la nube sin referencia.
  await eliminarDeCloud(archivo.publicId, archivo.resourceType);
  await Archivo.findByIdAndDelete(id);

  res.json({ ok: true, data: { id } });
}
