// Controlador de clientes (mini-CRM).
import { query } from '../config/db.js';

export async function listar(req, res, next) {
  try {
    const { rows } = await query('SELECT id, nombre, documento, telefono, email FROM clientes ORDER BY nombre');
    res.json({ ok: true, data: rows });
  } catch (err) { next(err); }
}

export async function crear(req, res, next) {
  try {
    const { nombre, documento, telefono, email } = req.body;
    if (!nombre) return res.status(400).json({ ok: false, error: 'El nombre es obligatorio' });
    const { rows } = await query(
      `INSERT INTO clientes (nombre, documento, telefono, email)
       VALUES ($1, $2, $3, $4) RETURNING id, nombre, documento, telefono, email`,
      [nombre, documento || null, telefono || null, email || null]
    );
    res.status(201).json({ ok: true, data: rows[0] });
  } catch (err) { next(err); }
}

export async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre, documento, telefono, email } = req.body;
    const { rows, rowCount } = await query(
      `UPDATE clientes SET nombre = COALESCE($1, nombre), documento = $2, telefono = $3, email = $4
       WHERE id = $5 RETURNING id, nombre, documento, telefono, email`,
      [nombre, documento ?? null, telefono ?? null, email ?? null, id]
    );
    if (rowCount === 0) return res.status(404).json({ ok: false, error: 'Cliente no encontrado' });
    res.json({ ok: true, data: rows[0] });
  } catch (err) { next(err); }
}

export async function eliminar(req, res, next) {
  try {
    const { id } = req.params;
    const enUso = await query('SELECT 1 FROM ventas WHERE cliente_id = $1 LIMIT 1', [id]);
    if (enUso.rowCount > 0) return res.status(409).json({ ok: false, error: 'No se puede eliminar: tiene ventas asociadas' });
    const { rowCount } = await query('DELETE FROM clientes WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ ok: false, error: 'Cliente no encontrado' });
    res.json({ ok: true, data: { id: Number(id) } });
  } catch (err) { next(err); }
}
