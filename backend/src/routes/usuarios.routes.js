// Rutas de usuarios: /api/usuarios  (HU-02)
// Todas exigen sesión válida (verifyToken) y rol admin (requireRole) → HU-03.
import { Router } from 'express';
import { listar, crear, actualizar, toggleActivo } from '../controllers/usuarios.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { usuarioSchema } from '../schemas/index.js';

const router = Router();

router.use(verifyToken, requireRole('admin'));

router.get('/', listar);
router.post('/', validate(usuarioSchema), crear);
router.put('/:id', actualizar);
router.patch('/:id/estado', toggleActivo);

export default router;
