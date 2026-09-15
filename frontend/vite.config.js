import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Config de Vite. El proxy /api evita problemas de CORS en desarrollo:
// las llamadas a /api/* se redirigen al backend en el puerto 4000.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
