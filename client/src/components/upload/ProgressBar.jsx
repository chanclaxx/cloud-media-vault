// Barra de progreso de subida.  Dueño: Rol 4
//
// Props:
//   valor: number (0-100)
//
// TODO(Rol 4): puede ser <progress max="100" value={valor} /> con estilos, o un div con width: `${valor}%`.
//   Mostrar también el texto "45 %". Accesibilidad: role="progressbar" + aria-valuenow si usas div.

export default function ProgressBar({ valor }) {
  return <progress max="100" value={valor} />;
}
