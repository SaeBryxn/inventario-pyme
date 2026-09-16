// Ruta de auditoría: /api/auditoria (solo admin)
import { Router } from 'express';
import { listar } from '../controllers/auditoria.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();
router.get('/', verifyToken, requireRole('admin'), listar);

export default router;
