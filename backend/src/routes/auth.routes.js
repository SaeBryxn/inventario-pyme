// Rutas de autenticación y perfil: /api/auth
import { Router } from 'express';
import { login, me, getPerfil, updatePerfil, cambiarPassword } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', login);                          // HU-01
router.get('/me', verifyToken, me);                    // datos del token
router.get('/perfil', verifyToken, getPerfil);         // perfil completo
router.put('/perfil', verifyToken, updatePerfil);      // editar datos + avatar
router.put('/password', verifyToken, cambiarPassword); // cambiar contraseña

export default router;
