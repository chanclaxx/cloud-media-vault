// Galería de archivos.  Dueño: Rol 5
//
// Props:
//   version: number -> cambia cada vez que se sube un archivo; al cambiar se recarga la lista.
//
// Flujo:
//   1. Pide la lista a GET /api/archivos con los filtros (tipo y búsqueda) y muestra
//      cargando / error / vacío / grid de tarjetas.
//   2. La búsqueda espera 300 ms después de la última tecla (debounce) para no hacer una
//      petición por cada letra.
//   3. Al eliminar: DELETE /api/archivos/:id y, si el servidor responde bien, se quita la tarjeta
//      del estado -> desaparece al instante, sin recargar la página (borrado reactivo).
import { useEffect, useState } from 'react';
import FileCard from './FileCard.jsx';
import Filters from './Filters.jsx';
import Spinner from '../ui/Spinner.jsx';
import Alert from '../ui/Alert.jsx';
import { listarArchivos, eliminarArchivo } from '../../services/api.js';
import './Gallery.css';

const ESPERA_BUSQUEDA_MS = 300;

export default function Gallery({ version }) {
  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState(null); // { tipo: 'error' | 'aviso' | 'exito', texto }
  const [filtros, setFiltros] = useState({ tipo: '', q: '' });
  // Texto de búsqueda que realmente se envía al servidor (con debounce).
  const [busqueda, setBusqueda] = useState('');

  // Debounce: cada tecla reinicia el temporizador; solo cuando el usuario deja de escribir
  // 300 ms se actualiza `busqueda` (y eso dispara la petición).
  useEffect(() => {
    const temporizador = setTimeout(() => setBusqueda(filtros.q.trim()), ESPERA_BUSQUEDA_MS);
    return () => clearTimeout(temporizador);
  }, [filtros.q]);

  // Cargar la lista cuando cambia: un archivo nuevo (version), el tipo o la búsqueda.
  useEffect(() => {
    // Si el usuario cambia el filtro antes de que llegue la respuesta anterior,
    // `cancelado` evita que una respuesta vieja sobrescriba la nueva.
    let cancelado = false;
    setCargando(true);
    setError('');

    listarArchivos({ tipo: filtros.tipo, q: busqueda })
      .then((lista) => {
        if (!cancelado) setArchivos(lista);
      })
      .catch((err) => {
        if (!cancelado) setError(err.message);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [version, filtros.tipo, busqueda]);

  async function manejarEliminar(id) {
    setAviso(null);
    try {
      await eliminarArchivo(id);
      setArchivos((prev) => prev.filter((a) => a.id !== id));
      setAviso({ tipo: 'exito', texto: 'Archivo eliminado de la nube y de la base de datos.' });
    } catch (err) {
      if (err.codigo === 'NO_ENCONTRADO') {
        // Ya lo había borrado alguien más: se quita de la vista igualmente.
        setArchivos((prev) => prev.filter((a) => a.id !== id));
        setAviso({ tipo: 'aviso', texto: 'Ese archivo ya no existía; se quitó de la galería.' });
        return;
      }
      // Cualquier otro error: la tarjeta se queda y se muestra el motivo.
      setAviso({ tipo: 'error', texto: err.message });
      throw err; // para que FileCard reactive su botón
    }
  }

  const hayFiltros = Boolean(filtros.tipo || busqueda);

  return (
    <div className="galeria">
      <Filters valor={filtros} onCambiar={setFiltros} />

      {aviso && (
        <Alert tipo={aviso.tipo} onCerrar={() => setAviso(null)}>
          {aviso.texto}
        </Alert>
      )}

      {renderContenido()}
    </div>
  );

  function renderContenido() {
    // Primera carga (todavía no hay nada que mostrar).
    if (cargando && archivos.length === 0 && !error) {
      return <Spinner texto="Cargando archivos..." />;
    }

    if (error) {
      return <Alert tipo="error">No se pudo cargar la galería: {error}</Alert>;
    }

    if (archivos.length === 0) {
      return (
        <p className="galeria__vacia">
          {hayFiltros
            ? 'No hay archivos que coincidan con los filtros.'
            : 'Todavía no hay archivos. ¡Sube el primero!'}
        </p>
      );
    }

    return (
      <>
        <p className="galeria__conteo" aria-live="polite">
          {archivos.length} {archivos.length === 1 ? 'archivo' : 'archivos'}
          {cargando && ' · actualizando...'}
        </p>
        <div className="galeria__grid">
          {archivos.map((archivo) => (
            <FileCard key={archivo.id} archivo={archivo} onEliminar={manejarEliminar} />
          ))}
        </div>
      </>
    );
  }
}
