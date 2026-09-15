// Controlador de usuarios (HU-02). Solo accesible por Admin (ver rutas).
import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';

// Listar usuarios (sin exponer el hash de contraseña)
export async function listar(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT id, nombre, email, rol, activo, created_at
         FROM usuarios ORDER BY id`
    );
    res.json({ ok: true, data: rows });
  } catch (err) { next(err); }
}

// Crear usuario
export async function crear(req, res, next) {
  try {
    const { nombre, email, password, rol } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, error: 'Nombre, email y contraseña son obligatorios' });
    }
    if (rol && !['admin', 'vendedor'].includes(rol)) {
      return res.status(400).json({ ok: false, error: 'Rol inválido' });
    }

    const existe = await query('SELECT 1 FROM usuarios WHERE email = $1', [email]);
    if (existe.rowCount > 0) {
      return res.status(409).json({ ok: false, error: 'Ya existe un usuario con ese email' });
    }

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol, activo, created_at`,
      [nombre, email, hash, rol || 'vendedor']
    );
    res.status(201).json({ ok: true, data: rows[0] });
  } catch (err) { next(err); }
}

// Actualizar usuario (nombre, email, rol y, opcionalmente, contraseña)
export async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre, email, rol, password } = req.body;

    if (rol && !['admin', 'vendedor'].includes(rol)) {
      return res.status(400).json({ ok: false, error: 'Rol inválido' });
    }

    // Si envían contraseña, la re-hasheamos; si no, la dejamos igual.
    const hash = password ? await bcrypt.hash(password, 10) : null;

    const { rows, rowCount } = await query(
      `UPDATE usuarios SET
         nombre = COALESCE($1, nombre),
         email  = COALESCE($2, email),
         rol    = COALESCE($3, rol),
         password_hash = COALESCE($4, password_hash)
       WHERE id = $5
       RETURNING id, nombre, email, rol, activo, created_at`,
      [nombre, email, rol, hash, id]
    );
    if (rowCount === 0) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    res.json({ ok: true, data: rows[0] });
  } catch (err) { next(err); }
}

// Activar/desactivar usuario (borrado lógico). No puedo desactivarme a mí mismo.
export async function toggleActivo(req, res, next) {
  try {
    const { id } = req.params;
    if (Number(id) === req.user.id) {
      return res.status(400).json({ ok: false, error: 'No puedes desactivar tu propia cuenta' });
    }
    const { rows, rowCount } = await query(
      `UPDATE usuarios SET activo = NOT activo
       WHERE id = $1
       RETURNING id, nombre, email, rol, activo, created_at`,
      [id]
    );
    if (rowCount === 0) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    res.json({ ok: true, data: rows[0] });
  } catch (err) { next(err); }
}
