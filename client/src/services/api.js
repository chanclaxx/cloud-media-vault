// Llamadas a la API (contrato en docs/API.md).
//   pedirJSON       -> base compartida (ya hecha)
//   subirArchivo    -> Rol 4
//   listarArchivos  -> Rol 5
//   eliminarArchivo -> Rol 5
import { API_URL } from '../config.js';

/**
 * fetch + JSON + errores con mensaje entendible.
 * Devuelve `data` si { ok: true }; si no, lanza Error con el `mensaje` del servidor
 * (y error.codigo con el código, ej. 'NO_ENCONTRADO').
 */
export async function pedirJSON(ruta, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, opciones);
  } catch {
    throw new Error('No se pudo conectar con el servidor. ¿Está corriendo la API?');
  }

  let cuerpo = null;
  try {
    cuerpo = await respuesta.json();
  } catch {
    // respuesta sin JSON (no debería pasar con nuestra API)
  }

  if (!respuesta.ok || !cuerpo?.ok) {
    const error = new Error(cuerpo?.error?.mensaje || `Error ${respuesta.status} del servidor.`);
    error.codigo = cuerpo?.error?.codigo;
    error.status = respuesta.status;
    throw error;
  }
  return cuerpo.data;
}

/**
 * Sube un archivo. Rol 4.
 * @param {FormData} formData   con los campos: archivo, titulo, subidoPor
 * @param {{ onProgreso?: (porcentaje: number) => void }} opciones
 * @returns {Promise<object>}   el objeto Archivo creado
 */
export function subirArchivo(formData, { onProgreso } = {}) {
  // XMLHttpRequest porque fetch no informa el progreso de subida.
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/api/archivos`);

    xhr.upload.onprogress = (evento) => {
      if (evento.lengthComputable) {
        onProgreso?.(Math.round((evento.loaded / evento.total) * 100));
      }
    };

    xhr.onload = () => {
      let cuerpo = null;
      try {
        cuerpo = JSON.parse(xhr.responseText);
      } catch {
        // respuesta sin JSON (no debería pasar con nuestra API)
      }

      if (xhr.status >= 200 && xhr.status < 300 && cuerpo?.ok) {
        resolve(cuerpo.data);
        return;
      }
      const error = new Error(cuerpo?.error?.mensaje || `Error ${xhr.status} del servidor.`);
      error.codigo = cuerpo?.error?.codigo;
      error.status = xhr.status;
      reject(error);
    };

    xhr.onerror = () => reject(new Error('No se pudo conectar con el servidor. ¿Está corriendo la API?'));
    xhr.onabort = () => reject(new Error('La subida fue cancelada.'));

    // No poner Content-Type a mano: el navegador agrega el boundary del multipart.
    xhr.send(formData);
  });
}

/**
 * Lista archivos. Rol 5.
 * @param {{ tipo?: string, q?: string, orden?: string }} filtros
 * @returns {Promise<object[]>}
 */
export async function listarArchivos(filtros = {}) {
  // Solo se envían los filtros con valor: { tipo: '', q: 'logo' } -> "?q=logo"
  const params = new URLSearchParams();
  for (const [clave, valor] of Object.entries(filtros)) {
    const texto = typeof valor === 'string' ? valor.trim() : valor;
    if (texto) params.set(clave, texto);
  }
  const query = params.toString();
  return pedirJSON(`/api/archivos${query ? `?${query}` : ''}`);
}

/**
 * Elimina un archivo (nube + BD, lo hace el servidor). Rol 5.
 * @param {string} id
 */
export async function eliminarArchivo(id) {
  return pedirJSON(`/api/archivos/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
