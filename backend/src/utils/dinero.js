// Utilidades de dinero: redondeo, desglose de IGV y total de un carrito.
export function redondear(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

// Desglosa un total que YA incluye IGV en subtotal + IGV.
export function desglosarIgv(total, porcentaje) {
  const t = Number(total) || 0;
  const p = Number(porcentaje) || 0;
  const subtotal = p > 0 ? t / (1 + p / 100) : t;
  return { subtotal: redondear(subtotal), igv: redondear(t - subtotal), total: redondear(t) };
}

// Suma precio * cantidad de una lista de items.
export function calcularTotal(items) {
  return redondear((items || []).reduce((s, i) => s + Number(i.precio) * Number(i.cantidad), 0));
}
