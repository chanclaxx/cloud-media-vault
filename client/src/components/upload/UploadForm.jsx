import { useEffect, useState } from 'react';
import { MAX_BYTES, MAX_MB, categoriaDeMime } from '../../constants/archivos.js';
import { subirArchivo } from '../../services/api.js';
import { formatearBytes } from '../../utils/formato.js';
import DropZone from './DropZone.jsx';
import ProgressBar from './ProgressBar.jsx';
import Alert from '../ui/Alert.jsx';
import Spinner from '../ui/Spinner.jsx';
import './Upload.css';

function validarArchivo(archivo) {
  if (!categoriaDeMime(archivo.type)) {
    return 'Tipo de archivo no permitido. Solo imágenes (JPG, PNG, WEBP, GIF), videos (MP4, WEBM, MOV) y PDF.';
  }
  if (archivo.size > MAX_BYTES) {
    return `El archivo supera el límite de ${MAX_MB} MB.`;
  }
  return null;
}

export default function UploadForm({ onSubido }) {
  const [archivo, setArchivo] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [subidoPor, setSubidoPor] = useState('');
  const [estado, setEstado] = useState('inactivo'); 
  const [progreso, setProgreso] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [vistaPrevia, setVistaPrevia] = useState(null);

  const subiendo = estado === 'subiendo';

  useEffect(() => {
    if (!archivo) {
      setVistaPrevia(null);
      return undefined;
    }
    const url = URL.createObjectURL(archivo);
    setVistaPrevia({ url, categoria: categoriaDeMime(archivo.type) });
    return () => URL.revokeObjectURL(url);
  }, [archivo]);

  function elegirArchivo(nuevo) {
    const problema = validarArchivo(nuevo);
    if (problema) {
      setArchivo(null);
      setEstado('error');
      setMensaje(problema);
      return;
    }
    setArchivo(nuevo);
    setEstado('inactivo');
    setMensaje('');
  }

  function limpiar() {
    setArchivo(null);
    setTitulo('');
    setProgreso(0);
  }

  async function enviar(e) {
    e.preventDefault();
    if (!archivo || subiendo) return;

    if (!subidoPor.trim()) {
      setEstado('error');
      setMensaje('Escribe tu nombre en el campo «Subido por».');
      return;
    }

    const datos = new FormData();
    datos.append('archivo', archivo);
    datos.append('titulo', titulo.trim());
    datos.append('subidoPor', subidoPor.trim());

    setEstado('subiendo');
    setProgreso(0);
    setMensaje('');

    try {
      const creado = await subirArchivo(datos, { onProgreso: setProgreso });
      setEstado('exito');
      setMensaje(`«${creado.titulo}» se subió correctamente.`);
      limpiar();
      onSubido?.(creado);
    } catch (error) {
      setEstado('error');
      setMensaje(error.message);
    }
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <DropZone onArchivo={elegirArchivo} deshabilitado={subiendo} />

      {archivo && vistaPrevia && (
        <div className="seleccion">
          <div className="seleccion__previa">
            {vistaPrevia.categoria === 'imagen' && <img src={vistaPrevia.url} alt="Vista previa" />}
            {vistaPrevia.categoria === 'video' && <video src={vistaPrevia.url} controls muted />}
            {vistaPrevia.categoria === 'pdf' && <span className="seleccion__pdf">PDF</span>}
          </div>
          <p className="seleccion__nombre">
            {archivo.name}
            <span> · {formatearBytes(archivo.size)}</span>
          </p>
        </div>
      )}

      <label className="campo">
        <span>Título (opcional)</span>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          maxLength={120}
          placeholder="Si lo dejas vacío se usa el nombre del archivo"
          disabled={subiendo}
        />
      </label>

      <label className="campo">
        <span>Subido por</span>
        <input
          type="text"
          value={subidoPor}
          onChange={(e) => setSubidoPor(e.target.value)}
          maxLength={60}
          placeholder="Tu nombre"
          required
          disabled={subiendo}
        />
      </label>

      <button type="submit" className="boton boton--primario" disabled={!archivo || subiendo}>
        {subiendo ? 'Subiendo...' : 'Subir archivo'}
      </button>

      {subiendo && (
        <div className="estado-subida">
          <Spinner texto="Subiendo..." />
          <ProgressBar valor={progreso} />
        </div>
      )}

      {mensaje && !subiendo && (
        <Alert tipo={estado === 'exito' ? 'exito' : 'error'} onCerrar={() => setMensaje('')}>
          {mensaje}
        </Alert>
      )}
    </form>
  );
}
