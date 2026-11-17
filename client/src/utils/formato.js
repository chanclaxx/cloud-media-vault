// Funciones de formato para mostrar metadatos.  Dueño: Rol 5

const KB = 1024;
const MB = KB * 1024;

/**
 * 482133 -> "470.8 KB", 5242880 -> "5.0 MB", 900 -> "900 B"
 * @param {number} bytes
 */
export function formatearBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < KB) return `${bytes} B`;
  if (bytes < MB) return `${(bytes / KB).toFixed(1)} KB`;
  return `${(bytes / MB).toFixed(1)} MB`;
}

// Se crea una sola vez (crearlo en cada render es más costoso).
const formatoFecha = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

/**
 * "2026-11-16T15:04:05.000Z" -> "16 nov 2026, 10:04 a. m." (hora de Colombia)
 * @param {string} fechaISO
 */
export function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  if (Number.isNaN(fecha.getTime())) return '—';
  return formatoFecha.format(fecha);
}