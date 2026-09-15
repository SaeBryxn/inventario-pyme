// Punto de entrada de la API de StockPro.
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { testConnection } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';

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
// TODO Sprint 2+: app.use('/api/productos', productosRoutes) ...

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
