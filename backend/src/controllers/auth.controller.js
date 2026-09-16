// Controlador de autenticación.
// login() ya trae la lógica base (HU-01): busca el usuario, compara la
// contraseña con bcrypt y devuelve un JWT. Requiere la tabla `usuarios`
// con datos (usa `npm run seed`).
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: 'Email y contraseña son obligatorios' });
    }

    const { rows } = await query(
      'SELECT id, nombre, email, password_hash, rol, activo FROM usuarios WHERE email = $1',
      [email]
    );
    const usuario = rows[0];

    // Mensaje genérico a propósito (no revelar si el email existe).
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
    }

    const passwordOk = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordOk) {
      return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '8h' }
    );

    return res.json({
      ok: true,
      data: {
        token,
        usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      },
    });
  } catch (err) {
    next(err);
  }
}

// Devuelve los datos del usuario autenticado (útil para el frontend).
export async function me(req, res) {
  return res.json({ ok: true, data: req.user });
}

// GET /api/auth/perfil — datos completos del usuario (incluye avatar y fecha).
export async function getPerfil(req, res, next) {
  try {
    const { rows } = await query(
      'SELECT id, nombre, email, rol, avatar, created_at FROM usuarios WHERE id = $1',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    res.json({ ok: true, data: rows[0] });
  } catch (err) { next(err); }
}

// PUT /api/auth/perfil — actualiza nombre, email y/o avatar del propio usuario.
export async function updatePerfil(req, res, next) {
  try {
    const { nombre, email, avatar } = req.body;
    // avatar: puede venir como data URL (nueva foto), null (quitar) o undefined (no tocar).
    const { rows } = await query(
      `UPDATE usuarios SET
         nombre = COALESCE($1, nombre),
         email  = COALESCE($2, email),
         avatar = CASE WHEN $3::text IS NULL AND $4 = true THEN NULL
                       WHEN $3::text IS NOT NULL THEN $3
                       ELSE avatar END
       WHERE id = $5
       RETURNING id, nombre, email, rol, avatar, created_at`,
      [nombre ?? null, email ?? null, avatar ?? null, req.body.quitarAvatar === true, req.user.id]
    );
    res.json({ ok: true, data: rows[0] });
  } catch (err) { next(err); }
}

// PUT /api/auth/password — cambia la contraseña verificando la actual.
export async function cambiarPassword(req, res, next) {
  try {
    const { actual, nueva } = req.body;
    if (!actual || !nueva) {
      return res.status(400).json({ ok: false, error: 'Debes indicar la contraseña actual y la nueva' });
    }
    if (String(nueva).length < 6) {
      return res.status(400).json({ ok: false, error: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }
    const { rows } = await query('SELECT password_hash FROM usuarios WHERE id = $1', [req.user.id]);
    const ok = await bcrypt.compare(actual, rows[0].password_hash);
    if (!ok) return res.status(400).json({ ok: false, error: 'La contraseña actual no es correcta' });

    const hash = await bcrypt.hash(nueva, 10);
    await query('UPDATE usuarios SET password_hash = $1 WHERE id = $2', [hash, req.user.id]);
    res.json({ ok: true, data: { actualizado: true } });
  } catch (err) { next(err); }
}
