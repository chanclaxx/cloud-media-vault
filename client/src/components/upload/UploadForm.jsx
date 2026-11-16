// Formulario de subida.  Dueño: Rol 4
//
// Props:
//   onSubido(archivo)  -> llamar cuando el servidor responda 201 (App recarga la galería).
//
// TODO(Rol 4):
//   Estado sugerido:
//     archivo (File | null), titulo, subidoPor,
//     estado: 'inactivo' | 'subiendo' | 'exito' | 'error', progreso (0-100), mensaje
//   Flujo:
//     1. <DropZone onArchivo={...} /> entrega el File elegido.
//     2. Validar con categoriaDeMime(file.type) y file.size <= MAX_BYTES (constants/archivos.js).
//        Si no pasa: mostrar <Alert tipo="error"> y NO enviar nada al servidor.
//     3. Al enviar:
//          const datos = new FormData();
//          datos.append('archivo', archivo);
//          datos.append('titulo', titulo);
//          datos.append('subidoPor', subidoPor);
//          const creado = await subirArchivo(datos, { onProgreso: setProgreso });
//     4. Mientras sube: deshabilitar el botón, mostrar <Spinner /> y <ProgressBar valor={progreso} />.
//     5. Éxito: <Alert tipo="exito">, limpiar el formulario, onSubido(creado).
//        Error: <Alert tipo="error">{error.message}</Alert> (el mensaje ya viene en español del servidor).
//   Extra (suma en la rúbrica): previsualizar el archivo antes de subirlo con URL.createObjectURL(file)
//   (y liberar con URL.revokeObjectURL en el cleanup del useEffect).

export default function UploadForm({ onSubido }) {
  void onSubido;
  return (
    <div className="pendiente">
      <strong>Formulario de carga</strong>
      <p>Pendiente — Rol 4 (Drag &amp; Drop, validaciones, progreso y alertas).</p>
    </div>
  );
}
