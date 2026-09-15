// Rutas de proveedores: /api/proveedores  (HU-15)
import { Router } from 'express';
import { listar, crear, actualizar, eliminar } from '../controllers/proveedores.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();
const soloAdmin = requireRole('admin');

router.get('/', verifyToken, listar);
router.post('/', verifyToken, soloAdmin, crear);
router.put('/:id', verifyToken, soloAdmin, actualizar);
router.delete('/:id', verifyToken, soloAdmin, eliminar);

export default router;
