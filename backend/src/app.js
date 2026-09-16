// Punto de entrada de la API de StockPro.
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';

import { testConnection } from './config/db.js';
import { auditoria } from './middlewares/auditoria.middleware.js';
import { openapiSpec } from './docs/openapi.js';
import authRoutes from './routes/auth.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';
import proveedoresRoutes from './routes/proveedores.routes.js';
import productosRoutes from './routes/productos.routes.js';
import movimientosRoutes from './routes/movimientos.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import ventasRoutes from './routes/ventas.routes.js';
import reportesRoutes from './routes/reportes.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import configuracionRoutes from './routes/configuracion.routes.js';
import auditoriaRoutes from './routes/auditoria.routes.js';

const app = express();

// --- Middlewares globales ---
// helmet añade cabeceras de seguridad. Desactivamos la CSP porque esto es una
// API + Swagger UI (la CSP es para páginas HTML propias).
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '6mb' })); // 6mb: permite imágenes en base64
app.use(auditoria);                        // registra las mutaciones

// Límite de intentos de login (anti fuerza bruta)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Demasiados intentos. Inténtalo más tarde.' },
});
app.use('/api/auth/login', loginLimiter);

// Documentación interactiva de la API
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, { customSiteTitle: 'StockPro API' }));

// --- Ruta de salud (para comprobar que la API vive) ---
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'StockPro API', time: new Date().toISOString() });
});

// --- Rutas de la aplicación ---
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/configuracion', configuracionRoutes);
app.use('/api/auditoria', auditoriaRoutes);

// --- 404 para rutas no encontradas ---
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
});

// --- Manejador de errores centralizado ---
app.use((err, req, res, next) => {
  console.error('❌', err);
  res.status(500).json({ ok: false, error: 'Error interno del servidor' });
});

// --- Arranque ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 StockPro API en http://localhost:${PORT}`);
  testConnection();
});
