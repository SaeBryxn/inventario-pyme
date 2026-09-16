// Log de auditoría (solo admin).
import { query } from '../config/db.js';

export async function listar(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT id, usuario_nombre, accion, entidad, ruta, fecha
         FROM auditoria ORDER BY fecha DESC LIMIT 200`
    );
    res.json({ ok: true, data: rows });
  } catch (err) { next(err); }
}
