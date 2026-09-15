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
