// Servicio de usuarios: envuelve las llamadas a /api/usuarios.
import { api } from './api.js';

export const usuariosService = {
  listar: () => api.get('/api/usuarios'),
  crear: (data) => api.post('/api/usuarios', data),
  actualizar: (id, data) => api.put(`/api/usuarios/${id}`, data),
  toggleActivo: (id) => api.patch(`/api/usuarios/${id}/estado`),
};
