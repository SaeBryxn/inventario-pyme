// Rutas de autenticación: /api/auth
import { Router } from 'express';
import { login, me } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', login);        // HU-01 · Iniciar sesión
router.get('/me', verifyToken, me);  // Datos del usuario autenticado

export default router;
