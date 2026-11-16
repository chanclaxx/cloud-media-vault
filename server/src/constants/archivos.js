// Tipos de archivo y límites permitidos.  Dueño: Rol 2 (coordinar con Rol 4)
//
// ⚠️ Este archivo tiene una COPIA en client/src/constants/archivos.js.
//    Si cambias algo aquí, cambia lo mismo allá (y en docs/API.md).

export const MAX_MB = 10;
export const MAX_BYTES = MAX_MB * 1024 * 1024;

export const CATEGORIAS = Object.freeze(['imagen', 'video', 'pdf']);

// MIME permitido -> categoría que se guarda en `tipoArchivo`.
export const MIME_A_CATEGORIA = Object.freeze({
  'image/jpeg': 'imagen',
  'image/png': 'imagen',
  'image/webp': 'imagen',
  'image/gif': 'imagen',
  'video/mp4': 'video',
  'video/webm': 'video',
  'video/quicktime': 'video',
  'application/pdf': 'pdf',
});

/** Devuelve 'imagen' | 'video' | 'pdf', o null si el MIME no está permitido. */
export function categoriaDeMime(mimeType) {
  return MIME_A_CATEGORIA[mimeType] ?? null;
}
