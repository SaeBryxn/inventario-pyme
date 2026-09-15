// Rutas de movimientos: /api/movimientos  (HU-07, HU-08, HU-10)
import { Router } from 'express';
import { registrar, listar } from '../controllers/movimientos.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, listar);                       // historial: admin/vendedor
router.post('/', verifyToken, requireRole('admin'), registrar); // registrar: admin

export default router;
