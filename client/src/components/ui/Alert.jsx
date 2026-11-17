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
