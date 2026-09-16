// Rutas de configuración del negocio: /api/configuracion
import { Router } from 'express';
import { obtener, actualizar } from '../controllers/configuracion.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, obtener);                          // cualquiera con sesión
router.put('/', verifyToken, requireRole('admin'), actualizar); // solo admin

export default router;
