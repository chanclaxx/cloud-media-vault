// Mensaje de retroalimentación (éxito / error / aviso).  Dueño: Rol 4 (lo usa también Rol 5)
//
// Props:
//   tipo: 'exito' | 'error' | 'aviso'
//   children: el texto
//   onCerrar?: () => void   (si se pasa, mostrar botón ×)
//
// TODO(Rol 4): estilos por tipo (usar --color-exito, --color-error, --color-aviso de index.css).
//   role="alert" para errores (los lectores de pantalla lo anuncian), role="status" para éxito.

export default function Alert({ tipo = 'aviso', children, onCerrar }) {
  return (
    <div role={tipo === 'error' ? 'alert' : 'status'} data-tipo={tipo}>
      {children}
      {onCerrar && (
        <button type="button" onClick={onCerrar} aria-label="Cerrar">
          ×
        </button>
      )}
    </div>
  );
}
