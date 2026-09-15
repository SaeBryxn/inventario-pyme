// Controlador de productos (HU-05 CRUD, HU-06 búsqueda/filtros/paginación).
import { query } from '../config/db.js';

// GET /api/productos?buscar=&categoria=&estado=&page=&limit=
export async function listar(req, res, next) {
  try {
    const buscar = (req.query.buscar || '').trim();
    const categoria = req.query.categoria;
    const estado = req.query.estado || 'activos'; // activos | inactivos | todos
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const cond = [];
    const params = [];

    if (buscar) {
      params.push(`%${buscar}%`);
      cond.push(`(p.nombre ILIKE $${params.length} OR p.sku ILIKE $${params.length})`);
    }
    if (categoria) {
      params.push(categoria);
      cond.push(`p.categoria_id = $${params.length}`);
    }
    if (estado === 'activos') cond.push('p.activo = TRUE');
    else if (estado === 'inactivos') cond.push('p.activo = FALSE');

    const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';

    // Total para la paginación
    const totalRes = await query(`SELECT COUNT(*)::int AS total FROM productos p ${where}`, params);
    const total = totalRes.rows[0].total;

    // Página de resultados (con nombre de categoría)
    const dataParams = [...params, limit, offset];
    const { rows } = await query(
      `SELECT p.id, p.sku, p.nombre, p.categoria_id, c.nombre AS categoria,
              p.precio_compra, p.precio_venta, p.stock_actual, p.stock_minimo, p.activo,
              (p.stock_actual <= p.stock_minimo) AS stock_bajo
         FROM productos p
         LEFT JOIN categorias c ON c.id = p.categoria_id
         ${where}
         ORDER BY p.nombre
         LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams
    );

    res.json({
      ok: true,
      data: { items: rows, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (err) { next(err); }
}

export async function crear(req, res, next) {
  try {
    const { sku, nombre, categoria_id, precio_compra, precio_venta, stock_minimo } = req.body;
    if (!sku || !nombre) {
      return res.status(400).json({ ok: false, error: 'SKU y nombre son obligatorios' });
    }
    const existe = await query('SELECT 1 FROM productos WHERE sku = $1', [sku]);
    if (existe.rowCount > 0) {
      return res.status(409).json({ ok: false, error: 'Ya existe un producto con ese SKU' });
    }
    const { rows } = await query(
      `INSERT INTO productos (sku, nombre, categoria_id, precio_compra, precio_venta, stock_minimo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, sku, nombre, categoria_id, precio_compra, precio_venta, stock_actual, stock_minimo, activo`,
      [sku, nombre, categoria_id || null, precio_compra || 0, precio_venta || 0, stock_minimo || 0]
    );
    res.status(201).json({ ok: true, data: rows[0] });
  } catch (err) { next(err); }
}

export async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const { sku, nombre, categoria_id, precio_compra, precio_venta, stock_minimo } = req.body;

    // Si cambian el SKU, verificar que no choque con otro producto.
    if (sku) {
      const dup = await query('SELECT 1 FROM productos WHERE sku = $1 AND id <> $2', [sku, id]);
      if (dup.rowCount > 0) return res.status(409).json({ ok: false, error: 'Ese SKU ya está en uso' });
    }

    const { rows, rowCount } = await query(
      `UPDATE productos SET
         sku = COALESCE($1, sku),
         nombre = COALESCE($2, nombre),
         categoria_id = $3,
         precio_compra = COALESCE($4, precio_compra),
         precio_venta = COALESCE($5, precio_venta),
         stock_minimo = COALESCE($6, stock_minimo)
       WHERE id = $7
       RETURNING id, sku, nombre, categoria_id, precio_compra, precio_venta, stock_actual, stock_minimo, activo`,
      [sku, nombre, categoria_id || null, precio_compra, precio_venta, stock_minimo, id]
    );
    if (rowCount === 0) return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    res.json({ ok: true, data: rows[0] });
  } catch (err) { next(err); }
}

// HU-05: desactivar un producto sin borrarlo (borrado lógico).
export async function toggleActivo(req, res, next) {
  try {
    const { id } = req.params;
    const { rows, rowCount } = await query(
      `UPDATE productos SET activo = NOT activo WHERE id = $1
       RETURNING id, sku, nombre, activo`,
      [id]
    );
    if (rowCount === 0) return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    res.json({ ok: true, data: rows[0] });
  } catch (err) { next(err); }
}
