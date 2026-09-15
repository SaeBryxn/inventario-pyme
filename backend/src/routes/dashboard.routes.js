// Ruta del dashboard: /api/dashboard
import { Router } from 'express';
import { resumen } from '../controllers/dashboard.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, resumen);

export default router;
