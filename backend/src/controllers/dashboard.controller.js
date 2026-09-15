// Controlador del dashboard (HU-09 alertas + HU-13 métricas).
import { query } from '../config/db.js';

// GET /api/dashboard
export async function resumen(req, res, next) {
  try {
    const totalProd = await query('SELECT COUNT(*)::int AS c FROM productos WHERE activo = TRUE');

    const stockBajo = await query(
      `SELECT id, sku, nombre, stock_actual, stock_minimo
         FROM productos
        WHERE activo = TRUE AND stock_actual <= stock_minimo
        ORDER BY stock_actual ASC`
    );

    const valor = await query(
      'SELECT COALESCE(SUM(precio_compra * stock_actual), 0)::float AS v FROM productos WHERE activo = TRUE'
    );

    // Ventas de hoy (la tabla existe; se llenará en el Sprint 4)
    const ventasHoy = await query(
      `SELECT COUNT(*)::int AS c, COALESCE(SUM(total), 0)::float AS t
         FROM ventas WHERE estado = 'completada' AND fecha::date = CURRENT_DATE`
    );

    res.json({
      ok: true,
      data: {
        totalProductos: totalProd.rows[0].c,
        stockBajoCount: stockBajo.rowCount,
        valorInventario: valor.rows[0].v,
        ventasHoyCount: ventasHoy.rows[0].c,
        ventasHoyTotal: ventasHoy.rows[0].t,
        listaStockBajo: stockBajo.rows,
      },
    });
  } catch (err) { next(err); }
}
