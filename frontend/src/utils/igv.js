// Desglosa un total (que ya incluye IGV) en subtotal + IGV.
export function desglosarIgv(total, porcentaje) {
  const t = Number(total) || 0;
  const p = Number(porcentaje) || 0;
  const sub = p > 0 ? t / (1 + p / 100) : t;
  return { sub, igv: t - sub, total: t };
}
