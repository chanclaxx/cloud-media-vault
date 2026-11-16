// Funciones de formato para mostrar metadatos.  Dueño: Rol 5

/**
 * 482133 -> "470.8 KB", 5242880 -> "5.0 MB", 900 -> "900 B"
 * @param {number} bytes
 */
export function formatearBytes(bytes) {
  // TODO(Rol 5): B si < 1024, KB si < 1024², si no MB. Una cifra decimal.
  return `${bytes} B`;
}

/**
 * "2026-11-16T15:04:05.000Z" -> "16 nov 2026, 10:04 a. m." (hora local de Colombia)
 * @param {string} fechaISO
 */
export function formatearFecha(fechaISO) {
  // TODO(Rol 5): usar Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).
  return fechaISO;
}
