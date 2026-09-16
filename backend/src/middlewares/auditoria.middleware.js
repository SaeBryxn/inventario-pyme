// Auditoría automática: registra cada operación que modifica datos
// (POST/PUT/PATCH/DELETE con éxito) junto al usuario que la hizo.
import { query } from '../config/db.js';

const ACCION = { POST: 'crear', PUT: 'editar', PATCH: 'editar', DELETE: 'eliminar' };

export function auditoria(req, res, next) {
  res.on('finish', () => {
    try {
      if (!ACCION[req.method]) return;             // solo mutaciones
      if (res.statusCode >= 400) return;           // solo si salió bien
      if (!req.user) return;                       // solo con sesión
      const ruta = req.originalUrl.split('?')[0];
      if (ruta.includes('/auth/')) return;         // login/perfil no se auditan aquí
      const entidad = ruta.split('/')[2] || 'api'; // /api/<entidad>/...
      query(
        `INSERT INTO auditoria (usuario_id, usuario_nombre, accion, entidad, ruta)
         VALUES ($1, $2, $3, $4, $5)`,
        [req.user.id, req.user.nombre, ACCION[req.method], entidad, `${req.method} ${ruta}`]
      ).catch(() => {});
    } catch { /* la auditoría nunca debe romper la respuesta */ }
  });
  next();
}
