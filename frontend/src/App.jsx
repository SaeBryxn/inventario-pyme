// Enrutado principal de la app.
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Usuarios from './pages/Usuarios.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute rol="admin">
                <Usuarios />
              </ProtectedRoute>
            }
          />
          {/* TODO Sprint 2+: /productos, /ventas, /inventario, /proveedores */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
