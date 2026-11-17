import './Upload.css';

export default function ProgressBar({ valor }) {
  const porcentaje = Math.max(0, Math.min(100, Math.round(valor)));

  return (
    <div className="progreso">
      <div
        className="progreso__pista"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={porcentaje}
        aria-label="Progreso de la subida"
      >
        <div className="progreso__relleno" style={{ width: `${porcentaje}%` }} />
      </div>
      <span className="progreso__texto">{porcentaje} %</span>
    </div>
  );
}
