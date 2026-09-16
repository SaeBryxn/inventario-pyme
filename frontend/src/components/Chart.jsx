// Gráfico de barras dibujado a mano con la Canvas API (sin librerías).
// Soporta orientación vertical/horizontal, alta resolución (DPI), colores del
// tema (claro/oscuro) y se redibuja al cambiar de tamaño.
import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
const trunc = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

export function BarChart({ data = [], horizontal = false, format = (v) => v, height = 220 }) {
  const ref = useRef(null);
  const { theme } = useTheme(); // redibuja al cambiar de tema

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    function draw() {
      // El CSS fija canvas a width:100%; leemos su ancho real ya renderizado
      // (excluye el padding de la tarjeta) para no desbordar.
      const cssW = canvas.clientWidth;
      if (!cssW) return;
      const cssH = height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.height = cssH + 'px';
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      const cs = getComputedStyle(document.documentElement);
      const accent = cs.getPropertyValue('--accent').trim() || '#7c3aed';
      const fg = cs.getPropertyValue('--fg').trim() || '#111';
      const muted = cs.getPropertyValue('--muted').trim() || '#888';
      const border = cs.getPropertyValue('--border').trim() || '#eee';
      ctx.font = '12px ui-sans-serif, system-ui, sans-serif';

      const max = Math.max(1, ...data.map((d) => d.value));

      if (!horizontal) {
        const padL = 44, padR = 10, padT = 14, padB = 26;
        const cw = cssW - padL - padR, ch = cssH - padT - padB;
        ctx.strokeStyle = border; ctx.lineWidth = 1;
        const grid = 4;
        for (let i = 0; i <= grid; i++) {
          const y = padT + ch * (i / grid);
          ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(cssW - padR, y); ctx.stroke();
          ctx.fillStyle = muted; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText(format(Math.round(max * (1 - i / grid))), padL - 8, y);
        }
        const n = data.length || 1;
        const step = cw / n, bw = step * 0.55;
        data.forEach((d, i) => {
          const x = padL + i * step + (step - bw) / 2;
          const bh = Math.max(ch * (d.value / max), d.value > 0 ? 2 : 0);
          const y = padT + ch - bh;
          const grad = ctx.createLinearGradient(0, y, 0, padT + ch);
          grad.addColorStop(0, accent); grad.addColorStop(1, accent + '55');
          ctx.fillStyle = grad; roundRect(ctx, x, y, bw, bh, 4); ctx.fill();
          ctx.fillStyle = muted; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(d.label, x + bw / 2, padT + ch + 7);
        });
      } else {
        const padL = 118, padR = 44, padT = 4, padB = 4;
        const cw = cssW - padL - padR, n = data.length || 1;
        const rowH = (cssH - padT - padB) / n, bh = Math.min(rowH * 0.6, 26);
        data.forEach((d, i) => {
          const y = padT + i * rowH + (rowH - bh) / 2;
          const bw = Math.max(cw * (d.value / max), 2);
          const grad = ctx.createLinearGradient(padL, 0, padL + bw, 0);
          grad.addColorStop(0, accent + '99'); grad.addColorStop(1, accent);
          ctx.fillStyle = grad; roundRect(ctx, padL, y, bw, bh, 5); ctx.fill();
          ctx.fillStyle = fg; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText(trunc(d.label, 17), padL - 10, y + bh / 2);
          ctx.fillStyle = muted; ctx.textAlign = 'left';
          ctx.fillText(format(d.value), padL + bw + 8, y + bh / 2);
        });
      }
    }

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [data, horizontal, height, theme]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={ref} aria-hidden="true" />;
}
