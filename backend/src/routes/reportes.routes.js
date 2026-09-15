// Rutas de reportes: /api/reportes  (HU-14). Solo admin.
import { Router } from 'express';
import { masVendidos, stockBajo } from '../controllers/reportes.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(verifyToken, requireRole('admin'));

router.get('/mas-vendidos', masVendidos);
router.get('/stock-bajo', stockBajo);

export default router;
