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
  const [aviso, setAviso] = useState(null);
  const [filtros, setFiltros] = useState({ tipo: '', q: '' });
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const temporizador = setTimeout(() => setBusqueda(filtros.q.trim()), ESPERA_BUSQUEDA_MS);
    return () => clearTimeout(temporizador);
  }, [filtros.q]);

  useEffect(() => {
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
        setArchivos((prev) => prev.filter((a) => a.id !== id));
        setAviso({ tipo: 'aviso', texto: 'Ese archivo ya no existía; se quitó de la galería.' });
        return;
      }
      setAviso({ tipo: 'error', texto: err.message });
      throw err;
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
