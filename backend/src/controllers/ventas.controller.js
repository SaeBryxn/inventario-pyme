// Controlador de ventas (HU-11 registrar, HU-12 historial + detalle).
// Registrar una venta: valida stock, descuenta, crea el detalle y deja
// un movimiento de "salida" por cada producto — todo en una transacción.
import { pool, query } from '../config/db.js';

// POST /api/ventas   body: { items: [{ producto_id, cantidad }] }
export async function registrar(req, res, next) {
  const client = await pool.connect();
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: 'Agrega al menos un producto a la venta' });
    }

    await client.query('BEGIN');

    let total = 0;
    const detalles = [];
    for (const it of items) {
      const cant = Number(it.cantidad);
      if (!it.producto_id || !cant || cant <= 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ ok: false, error: 'Cantidad inválida en un producto' });
      }
      const pr = await client.query(
        'SELECT nombre, precio_venta, stock_actual FROM productos WHERE id = $1 FOR UPDATE',
        [it.producto_id]
      );
      if (pr.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
      }
      const { nombre, precio_venta, stock_actual } = pr.rows[0];
      if (cant > stock_actual) {
        await client.query('ROLLBACK');
        return res.status(400).json({ ok: false, error: `Stock insuficiente de ${nombre} (disponible: ${stock_actual})` });
      }
      const subtotal = Number(precio_venta) * cant;
      total += subtotal;
      detalles.push({ producto_id: it.producto_id, cantidad: cant, precio_unitario: precio_venta, subtotal });
    }

    // Código correlativo tipo V-00001
    const n = await client.query('SELECT COUNT(*) + 1 AS n FROM ventas');
    const codigo = 'V-' + String(n.rows[0].n).padStart(5, '0');

    const venta = await client.query(
      'INSERT INTO ventas (codigo, usuario_id, total) VALUES ($1, $2, $3) RETURNING id, codigo, total, fecha',
      [codigo, req.user.id, total]
    );
    const ventaId = venta.rows[0].id;

    for (const d of detalles) {
      await client.query(
        `INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [ventaId, d.producto_id, d.cantidad, d.precio_unitario, d.subtotal]
      );
      await client.query('UPDATE productos SET stock_actual = stock_actual - $1 WHERE id = $2', [d.cantidad, d.producto_id]);
      await client.query(
        `INSERT INTO movimientos (producto_id, usuario_id, tipo, cantidad, motivo)
         VALUES ($1, $2, 'salida', $3, $4)`,
        [d.producto_id, req.user.id, d.cantidad, `Venta ${codigo}`]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ ok: true, data: venta.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    next(err);
  } finally {
    client.release();
  }
}

// GET /api/ventas?desde=&hasta=   (HU-12)
export async function listar(req, res, next) {
  try {
    const { desde, hasta } = req.query;
    const cond = [];
    const params = [];
    if (desde) { params.push(desde); cond.push(`v.fecha >= $${params.length}`); }
    if (hasta) { params.push(hasta); cond.push(`v.fecha <= ($${params.length}::date + 1)`); }
    const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';

    const { rows } = await query(
      `SELECT v.id, v.codigo, v.total, v.fecha, u.nombre AS vendedor,
              (SELECT COUNT(*) FROM detalle_venta d WHERE d.venta_id = v.id)::int AS items
         FROM ventas v JOIN usuarios u ON u.id = v.usuario_id
         ${where}
         ORDER BY v.fecha DESC LIMIT 100`,
      params
    );
    res.json({ ok: true, data: rows });
  } catch (err) { next(err); }
}

// GET /api/ventas/:id   (detalle de una venta)
export async function detalle(req, res, next) {
  try {
    const { id } = req.params;
    const venta = await query(
      `SELECT v.id, v.codigo, v.total, v.fecha, u.nombre AS vendedor
         FROM ventas v JOIN usuarios u ON u.id = v.usuario_id WHERE v.id = $1`,
      [id]
    );
    if (venta.rowCount === 0) return res.status(404).json({ ok: false, error: 'Venta no encontrada' });
    const items = await query(
      `SELECT p.sku, p.nombre, d.cantidad, d.precio_unitario, d.subtotal
         FROM detalle_venta d JOIN productos p ON p.id = d.producto_id
        WHERE d.venta_id = $1`,
      [id]
    );
    res.json({ ok: true, data: { ...venta.rows[0], items: items.rows } });
  } catch (err) { next(err); }
}
