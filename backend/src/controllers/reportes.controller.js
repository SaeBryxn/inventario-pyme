// Controlador de reportes (HU-14). Devuelve JSON; el frontend exporta a CSV.
import { query } from '../config/db.js';

// GET /api/reportes/mas-vendidos
export async function masVendidos(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT p.sku, p.nombre,
              SUM(d.cantidad)::int AS cantidad_vendida,
              SUM(d.subtotal)::float AS total_vendido
         FROM detalle_venta d
         JOIN productos p ON p.id = d.producto_id
         GROUP BY p.id, p.sku, p.nombre
         ORDER BY cantidad_vendida DESC
         LIMIT 50`
    );
    res.json({ ok: true, data: rows });
  } catch (err) { next(err); }
}

// GET /api/reportes/stock-bajo
export async function stockBajo(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT sku, nombre, stock_actual, stock_minimo
         FROM productos
        WHERE activo = TRUE AND stock_actual <= stock_minimo
        ORDER BY stock_actual ASC`
    );
    res.json({ ok: true, data: rows });
  } catch (err) { next(err); }
}
