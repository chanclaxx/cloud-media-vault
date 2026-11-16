// Zona de arrastrar y soltar + selector de archivo.  Dueño: Rol 4
//
// Props:
//   onArchivo(file: File)  -> se llama con el archivo elegido (arrastrado o seleccionado)
//   deshabilitado: boolean -> true mientras se sube
//
// TODO(Rol 4):
//   - Un <div> con onDragOver (e.preventDefault() + marcar "arrastrando"), onDragLeave y onDrop
//     (e.preventDefault(); const file = e.dataTransfer.files[0]).
//     ⚠️ Sin preventDefault en dragover, el navegador abre el archivo en la pestaña en vez de soltarlo.
//   - Un <input type="file" accept={ACCEPT} hidden> + botón "Seleccionar archivo" que lo abre (useRef).
//   - Estilo distinto cuando se está arrastrando encima (clase CSS).
//   - Accesible con teclado: el botón debe poder usarse con Tab + Enter.
//   - Texto de ayuda: "Imágenes, videos o PDF · máximo 10 MB".

export default function DropZone({ onArchivo, deshabilitado }) {
  void onArchivo;
  void deshabilitado;
  return <div className="pendiente">Zona de Drag &amp; Drop — pendiente (Rol 4)</div>;
}
