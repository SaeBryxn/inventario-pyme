// Controlador de movimientos de inventario (HU-07 entrada, HU-08 salida/ajuste, HU-10 historial).
// El stock del producto SIEMPRE se mueve aquí, dentro de una transacción,
// para que el stock y el movimiento queden consistentes.
import { pool, query } from '../config/db.js';

const TIPOS = ['entrada', 'salida', 'ajuste'];

// POST /api/movimientos
export async function registrar(req, res, next) {
  const client = await pool.connect();
  try {
    const { producto_id, tipo, cantidad, motivo, proveedor_id } = req.body;
    const cant = Number(cantidad);

    if (!producto_id || !tipo || Number.isNaN(cant)) {
      return res.status(400).json({ ok: false, error: 'Producto, tipo y cantidad son obligatorios' });
    }
    if (!TIPOS.includes(tipo)) {
      return res.status(400).json({ ok: false, error: 'Tipo inválido' });
    }
    if (tipo !== 'ajuste' && cant <= 0) {
      return res.status(400).json({ ok: false, error: 'La cantidad debe ser mayor a 0' });
    }
    if (tipo === 'ajuste' && cant < 0) {
      return res.status(400).json({ ok: false, error: 'El ajuste no puede ser negativo' });
    }

    await client.query('BEGIN');

    // Bloqueamos la fila del producto para evitar condiciones de carrera.
    const prod = await client.query('SELECT stock_actual FROM productos WHERE id = $1 FOR UPDATE', [producto_id]);
    if (prod.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    }

    const actual = prod.rows[0].stock_actual;
    let nuevo;
    if (tipo === 'entrada') nuevo = actual + cant;
    else if (tipo === 'salida') {
      if (cant > actual) {
        await client.query('ROLLBACK');
        return res.status(400).json({ ok: false, error: `Stock insuficiente (disponible: ${actual})` });
      }
      nuevo = actual - cant;
    } else {
      nuevo = cant; // ajuste: fija el stock al valor real contado
    }

    await client.query('UPDATE productos SET stock_actual = $1 WHERE id = $2', [nuevo, producto_id]);
    const mov = await client.query(
      `INSERT INTO movimientos (producto_id, usuario_id, proveedor_id, tipo, cantidad, motivo)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [producto_id, req.user.id, proveedor_id || null, tipo, cant, motivo || null]
    );

    await client.query('COMMIT');
    res.status(201).json({ ok: true, data: { id: mov.rows[0].id, stock_actual: nuevo } });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    next(err);
  } finally {
    client.release();
  }
}

// GET /api/movimientos?producto_id=&tipo=&desde=&hasta=  (HU-10)
export async function listar(req, res, next) {
  try {
    const { producto_id, tipo, desde, hasta } = req.query;
    const cond = [];
    const params = [];

    if (producto_id) { params.push(producto_id); cond.push(`m.producto_id = $${params.length}`); }
    if (tipo) { params.push(tipo); cond.push(`m.tipo = $${params.length}`); }
    if (desde) { params.push(desde); cond.push(`m.fecha >= $${params.length}`); }
    if (hasta) { params.push(hasta); cond.push(`m.fecha <= ($${params.length}::date + 1)`); }

    const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';
    const { rows } = await query(
      `SELECT m.id, m.tipo, m.cantidad, m.motivo, m.fecha,
              p.nombre AS producto, p.sku, u.nombre AS usuario, pr.nombre AS proveedor
         FROM movimientos m
         JOIN productos p ON p.id = m.producto_id
         JOIN usuarios u ON u.id = m.usuario_id
         LEFT JOIN proveedores pr ON pr.id = m.proveedor_id
         ${where}
         ORDER BY m.fecha DESC
         LIMIT 100`,
      params
    );
    res.json({ ok: true, data: rows });
  } catch (err) { next(err); }
}
