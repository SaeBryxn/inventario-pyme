// Configuración del negocio (una sola fila). GET: cualquiera; PUT: admin.
import { query } from '../config/db.js';

export async function obtener(req, res, next) {
  try {
    const { rows } = await query('SELECT id, nombre, ruc, direccion, moneda, igv_porcentaje, logo FROM configuracion WHERE id = 1');
    res.json({ ok: true, data: rows[0] || {} });
  } catch (err) { next(err); }
}

export async function actualizar(req, res, next) {
  try {
    const { nombre, ruc, direccion, moneda, igv_porcentaje, logo } = req.body;
    const { rows } = await query(
      `UPDATE configuracion SET
         nombre = COALESCE($1, nombre),
         ruc = $2, direccion = $3,
         moneda = COALESCE($4, moneda),
         igv_porcentaje = COALESCE($5, igv_porcentaje),
         logo = COALESCE($6, logo)
       WHERE id = 1
       RETURNING id, nombre, ruc, direccion, moneda, igv_porcentaje, logo`,
      [nombre ?? null, ruc ?? null, direccion ?? null, moneda ?? null, igv_porcentaje ?? null, logo ?? null]
    );
    res.json({ ok: true, data: rows[0] });
  } catch (err) { next(err); }
}
