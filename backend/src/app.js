// Punto de entrada de la API de StockPro.
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { testConnection } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';
import proveedoresRoutes from './routes/proveedores.routes.js';
import productosRoutes from './routes/productos.routes.js';
import movimientosRoutes from './routes/movimientos.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import ventasRoutes from './routes/ventas.routes.js';
import reportesRoutes from './routes/reportes.routes.js';

const app = express();

// --- Middlewares globales ---
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

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
