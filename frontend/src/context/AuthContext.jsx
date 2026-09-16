// Contexto de autenticación: usuario, token, login/logout y perfil (con avatar).
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuarioState] = useState(() => {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  });

  function setUsuario(u) {
    setUsuarioState(u);
    if (u) localStorage.setItem('usuario', JSON.stringify(u));
    else localStorage.removeItem('usuario');
  }

  // Trae el perfil completo (incluye avatar) y lo fusiona en el usuario.
  async function refreshPerfil() {
    try {
      const p = await api.get('/api/auth/perfil');
      setUsuario({ id: p.id, nombre: p.nombre, email: p.email, rol: p.rol, avatar: p.avatar });
      return p;
    } catch {
      return null;
    }
  }

  async function login(email, password) {
    const data = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUsuario(data.usuario);
    await refreshPerfil(); // carga el avatar si existe
    return data.usuario;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuarioState(null);
  }

  // Al recargar la app con sesión activa, refresca el avatar.
  useEffect(() => {
    if (localStorage.getItem('token') && usuario && usuario.avatar === undefined) {
      refreshPerfil();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, login, logout, refreshPerfil, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
