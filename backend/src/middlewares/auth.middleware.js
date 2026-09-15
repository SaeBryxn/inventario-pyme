// Middlewares de autenticación y autorización.
// - verifyToken: exige un JWT válido en el header Authorization.
// - requireRole: exige que el usuario tenga uno de los roles permitidos.
// Ya están listos para usarse en las rutas del Sprint 1 en adelante.
import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ ok: false, error: 'Token no proporcionado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, nombre, rol }
    next();
  } catch {
    return res.status(401).json({ ok: false, error: 'Token inválido o expirado' });
  }
}

// Uso: router.get('/', verifyToken, requireRole('admin'), controlador)
export function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ ok: false, error: 'No tienes permiso para esta acción' });
    }
    next();
  };
}
