// Controlador de categorías (HU-04).
import { query } from '../config/db.js';

export async function listar(req, res, next) {
  try {
    const { rows } = await query('SELECT id, nombre, descripcion FROM categorias ORDER BY nombre');
    res.json({ ok: true, data: rows });
  } catch (err) { next(err); }
}

export async function crear(req, res, next) {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ ok: false, error: 'El nombre es obligatorio' });
    const { rows } = await query(
      'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING id, nombre, descripcion',
      [nombre, descripcion || null]
    );
    res.status(201).json({ ok: true, data: rows[0] });
  } catch (err) { next(err); }
}

export async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const { rows, rowCount } = await query(
      `UPDATE categorias SET nombre = COALESCE($1, nombre), descripcion = $2
       WHERE id = $3 RETURNING id, nombre, descripcion`,
      [nombre, descripcion ?? null, id]
    );
    if (rowCount === 0) return res.status(404).json({ ok: false, error: 'Categoría no encontrada' });
    res.json({ ok: true, data: rows[0] });
  } catch (err) { next(err); }
}

export async function eliminar(req, res, next) {
  try {
    const { id } = req.params;
    // HU-04: no permitir borrar una categoría con productos asociados.
    const enUso = await query('SELECT 1 FROM productos WHERE categoria_id = $1 LIMIT 1', [id]);
    if (enUso.rowCount > 0) {
      return res.status(409).json({ ok: false, error: 'No se puede eliminar: tiene productos asociados' });
    }
    const { rowCount } = await query('DELETE FROM categorias WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ ok: false, error: 'Categoría no encontrada' });
    res.json({ ok: true, data: { id: Number(id) } });
  } catch (err) { next(err); }
}
