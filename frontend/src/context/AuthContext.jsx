// Contexto de autenticación: guarda el usuario y el token, y expone
// login() / logout() a toda la app. El token persiste en localStorage.
import { createContext, useContext, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  });

  async function login(email, password) {
    const data = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data.usuario;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para consumir el contexto: const { usuario, login, logout } = useAuth()
export function useAuth() {
  return useContext(AuthContext);
}
