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

    // Ventas de hoy
    const ventasHoy = await query(
      `SELECT COUNT(*)::int AS c, COALESCE(SUM(total), 0)::float AS t
         FROM ventas WHERE estado = 'completada' AND fecha::date = CURRENT_DATE`
    );

    // Ventas de los últimos 7 días (para el gráfico), rellenando días sin ventas
    const ventas7dias = await query(
      `SELECT to_char(d.dia, 'DD/MM') AS etiqueta,
              COALESCE(SUM(v.total), 0)::float AS total
         FROM generate_series(CURRENT_DATE - 6, CURRENT_DATE, '1 day') AS d(dia)
         LEFT JOIN ventas v ON v.fecha::date = d.dia AND v.estado = 'completada'
        GROUP BY d.dia ORDER BY d.dia`
    );

    // Top 5 productos más vendidos (para el gráfico)
    const topProductos = await query(
      `SELECT p.nombre, SUM(dv.cantidad)::int AS cantidad
         FROM detalle_venta dv JOIN productos p ON p.id = dv.producto_id
        GROUP BY p.id, p.nombre ORDER BY cantidad DESC LIMIT 5`
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
        ventas7dias: ventas7dias.rows,
        topProductos: topProductos.rows,
      },
    });
  } catch (err) { next(err); }
}
