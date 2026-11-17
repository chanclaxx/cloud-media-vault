// Zona de arrastrar y soltar + selector de archivo.  Dueño: Rol 4
//
// Props:
//   onArchivo(file: File)  -> se llama con el archivo elegido (arrastrado o seleccionado)
//   deshabilitado: boolean -> true mientras se sube
import { useRef, useState } from 'react';
import { ACCEPT, MAX_MB } from '../../constants/archivos.js';
import './Upload.css';

export default function DropZone({ onArchivo, deshabilitado }) {
  const inputRef = useRef(null);
  const [arrastrando, setArrastrando] = useState(false);

  function manejarDragOver(e) {
    // Sin preventDefault el navegador abre el archivo en la pestaña en vez de soltarlo.
    e.preventDefault();
    if (!deshabilitado) setArrastrando(true);
  }

  function manejarDrop(e) {
    e.preventDefault();
    setArrastrando(false);
    if (deshabilitado) return;
    const archivo = e.dataTransfer.files[0];
    if (archivo) onArchivo(archivo);
  }

  function manejarSeleccion(e) {
    const archivo = e.target.files[0];
    if (archivo) onArchivo(archivo);
    // permite volver a elegir el mismo archivo después de un error
    e.target.value = '';
  }

  return (
    <div
      className={`dropzone${arrastrando ? ' dropzone--activa' : ''}${deshabilitado ? ' dropzone--deshabilitada' : ''}`}
      onDragOver={manejarDragOver}
      onDragLeave={() => setArrastrando(false)}
      onDrop={manejarDrop}
    >
      <p className="dropzone__titulo">
        {arrastrando ? 'Suelta el archivo aquí' : 'Arrastra un archivo aquí'}
      </p>
      <p className="dropzone__ayuda">Imágenes, videos o PDF · máximo {MAX_MB} MB</p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={manejarSeleccion}
        disabled={deshabilitado}
      />
      <button
        type="button"
        className="boton boton--secundario"
        onClick={() => inputRef.current?.click()}
        disabled={deshabilitado}
      >
        Seleccionar archivo
      </button>
    </div>
  );
}
