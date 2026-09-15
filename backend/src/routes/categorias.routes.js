// Rutas de categorías: /api/categorias  (HU-04)
import { Router } from 'express';
import { listar, crear, actualizar, eliminar } from '../controllers/categorias.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();
const soloAdmin = requireRole('admin');

router.get('/', verifyToken, listar);            // cualquiera con sesión
router.post('/', verifyToken, soloAdmin, crear); // escritura: admin
router.put('/:id', verifyToken, soloAdmin, actualizar);
router.delete('/:id', verifyToken, soloAdmin, eliminar);

export default router;
