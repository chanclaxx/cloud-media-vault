// Tipos de archivo y límites permitidos en el navegador.  Dueño: Rol 4 (coordinar con Rol 2)
//
// ⚠️ COPIA de server/src/constants/archivos.js. Si cambias algo aquí, cambia lo mismo allá
//    (y en docs/API.md). El servidor vuelve a validar todo: esto es solo para buena UX.

export const MAX_MB = 10;
export const MAX_BYTES = MAX_MB * 1024 * 1024;

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

// Para <input type="file" accept={ACCEPT}>
export const ACCEPT = Object.keys(MIME_A_CATEGORIA).join(',');

// Opciones de filtro de la galería (Rol 5). `valor` = lo que se envía en ?tipo=
export const FILTROS_TIPO = Object.freeze([
  { valor: '', etiqueta: 'Todos' },
  { valor: 'imagen', etiqueta: 'Imágenes' },
  { valor: 'video', etiqueta: 'Videos' },
  { valor: 'pdf', etiqueta: 'PDF' },
]);

/** 'imagen' | 'video' | 'pdf', o null si el tipo no está permitido. */
export function categoriaDeMime(mimeType) {
  return MIME_A_CATEGORIA[mimeType] ?? null;
}
