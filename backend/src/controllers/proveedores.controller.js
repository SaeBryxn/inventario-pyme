// Controlador de proveedores (HU-15).
import { query } from '../config/db.js';

export async function listar(req, res, next) {
  try {
    const { rows } = await query(
      'SELECT id, nombre, ruc, telefono, email FROM proveedores ORDER BY nombre'
    );
    res.json({ ok: true, data: rows });
  } catch (err) { next(err); }
}

export async function crear(req, res, next) {
  try {
    const { nombre, ruc, telefono, email } = req.body;
    if (!nombre) return res.status(400).json({ ok: false, error: 'El nombre es obligatorio' });
    const { rows } = await query(
      `INSERT INTO proveedores (nombre, ruc, telefono, email)
       VALUES ($1, $2, $3, $4) RETURNING id, nombre, ruc, telefono, email`,
      [nombre, ruc || null, telefono || null, email || null]
    );
    res.status(201).json({ ok: true, data: rows[0] });
  } catch (err) { next(err); }
}

export async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre, ruc, telefono, email } = req.body;
    const { rows, rowCount } = await query(
      `UPDATE proveedores SET
         nombre = COALESCE($1, nombre), ruc = $2, telefono = $3, email = $4
       WHERE id = $5 RETURNING id, nombre, ruc, telefono, email`,
      [nombre, ruc ?? null, telefono ?? null, email ?? null, id]
    );
    if (rowCount === 0) return res.status(404).json({ ok: false, error: 'Proveedor no encontrado' });
    res.json({ ok: true, data: rows[0] });
  } catch (err) { next(err); }
}

export async function eliminar(req, res, next) {
  try {
    const { id } = req.params;
    const enUso = await query('SELECT 1 FROM movimientos WHERE proveedor_id = $1 LIMIT 1', [id]);
    if (enUso.rowCount > 0) {
      return res.status(409).json({ ok: false, error: 'No se puede eliminar: tiene movimientos asociados' });
    }
    const { rowCount } = await query('DELETE FROM proveedores WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ ok: false, error: 'Proveedor no encontrado' });
    res.json({ ok: true, data: { id: Number(id) } });
  } catch (err) { next(err); }
}
