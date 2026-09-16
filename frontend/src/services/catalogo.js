// Servicios de catálogo: categorías, proveedores y productos.
import { api } from './api.js';

export const categoriasService = {
  listar: () => api.get('/api/categorias'),
  crear: (data) => api.post('/api/categorias', data),
  actualizar: (id, data) => api.put(`/api/categorias/${id}`, data),
  eliminar: (id) => api.del(`/api/categorias/${id}`),
};

export const proveedoresService = {
  listar: () => api.get('/api/proveedores'),
  crear: (data) => api.post('/api/proveedores', data),
  actualizar: (id, data) => api.put(`/api/proveedores/${id}`, data),
  eliminar: (id) => api.del(`/api/proveedores/${id}`),
};

export const movimientosService = {
  // params: { producto_id, tipo, desde, hasta }
  listar: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ).toString();
    return api.get(`/api/movimientos${qs ? `?${qs}` : ''}`);
  },
  registrar: (data) => api.post('/api/movimientos', data),
};

export const dashboardService = {
  resumen: () => api.get('/api/dashboard'),
};

export const ventasService = {
  listar: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ).toString();
    return api.get(`/api/ventas${qs ? `?${qs}` : ''}`);
  },
  detalle: (id) => api.get(`/api/ventas/${id}`),
  registrar: (data) => api.post('/api/ventas', data),
};

export const reportesService = {
  masVendidos: () => api.get('/api/reportes/mas-vendidos'),
  stockBajo: () => api.get('/api/reportes/stock-bajo'),
};

export const perfilService = {
  get: () => api.get('/api/auth/perfil'),
  actualizar: (data) => api.put('/api/auth/perfil', data),
  cambiarPassword: (data) => api.put('/api/auth/password', data),
};

export const productosService = {
  // params: { buscar, categoria, estado, page, limit }
  listar: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ).toString();
    return api.get(`/api/productos${qs ? `?${qs}` : ''}`);
  },
  crear: (data) => api.post('/api/productos', data),
  actualizar: (id, data) => api.put(`/api/productos/${id}`, data),
  toggleActivo: (id) => api.patch(`/api/productos/${id}/estado`),
};
