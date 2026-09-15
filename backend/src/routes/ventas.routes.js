// Rutas de ventas: /api/ventas  (HU-11, HU-12)
import { Router } from 'express';
import { registrar, listar, detalle } from '../controllers/ventas.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Registrar y ver ventas: admin y vendedor (el vendedor es quien vende).
router.post('/', verifyToken, registrar);
router.get('/', verifyToken, listar);
router.get('/:id', verifyToken, detalle);

export default router;
