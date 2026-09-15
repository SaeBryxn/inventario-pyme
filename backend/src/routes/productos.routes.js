// Rutas de productos: /api/productos  (HU-05, HU-06)
import { Router } from 'express';
import { listar, crear, actualizar, toggleActivo } from '../controllers/productos.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();
const soloAdmin = requireRole('admin');

router.get('/', verifyToken, listar);            // ver/buscar: admin y vendedor
router.post('/', verifyToken, soloAdmin, crear); // gestionar: admin
router.put('/:id', verifyToken, soloAdmin, actualizar);
router.patch('/:id/estado', verifyToken, soloAdmin, toggleActivo);

export default router;
