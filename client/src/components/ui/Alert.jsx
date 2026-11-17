// Mensaje de retroalimentación (éxito / error / aviso).  Dueño: Rol 4 (lo usa también Rol 5)
//
// Props:
//   tipo: 'exito' | 'error' | 'aviso'
//   children: el texto
//   onCerrar?: () => void   (si se pasa, muestra el botón ×)
import './Alert.css';

export default function Alert({ tipo = 'aviso', children, onCerrar }) {
  return (
    <div
      className={`alerta alerta--${tipo}`}
      role={tipo === 'error' ? 'alert' : 'status'}
      data-tipo={tipo}
    >
      <span className="alerta__texto">{children}</span>
      {onCerrar && (
        <button type="button" className="alerta__cerrar" onClick={onCerrar} aria-label="Cerrar">
          ×
        </button>
      )}
    </div>
  );
}
