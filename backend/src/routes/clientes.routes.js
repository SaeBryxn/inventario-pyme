// Rutas de clientes: /api/clientes
import { Router } from 'express';
import { listar, crear, actualizar, eliminar } from '../controllers/clientes.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { clienteSchema } from '../schemas/index.js';

const router = Router();
const soloAdmin = requireRole('admin');

router.get('/', verifyToken, listar);                 // ver: admin y vendedor (para elegir en la venta)
router.post('/', verifyToken, validate(clienteSchema), crear);  // crear: cualquiera (útil al vender)
router.put('/:id', verifyToken, soloAdmin, actualizar);
router.delete('/:id', verifyToken, soloAdmin, eliminar);

export default router;
