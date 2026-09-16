// Código de barras Code 39 renderizado como SVG (usa la lógica pura de utils).
import { code39Bars, sanitizar } from '../utils/barcode.js';

export default function Barcode({ value = '', height = 56, narrow = 2 }) {
  const texto = sanitizar(value);
  const { bars, width } = code39Bars(value, narrow);

  return (
    <svg className="barcode" viewBox={`0 0 ${width} ${height}`} width={width} height={height}
         role="img" aria-label={`Código de barras ${texto}`}>
      <rect x="0" y="0" width={width} height={height} fill="#fff" />
      {bars.map((b, i) => <rect key={i} x={b.x} y={0} width={b.w} height={height} fill="#111" />)}
    </svg>
  );
}
