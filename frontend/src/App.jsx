// Enrutado principal de la app.
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Usuarios from './pages/Usuarios.jsx';
import Productos from './pages/Productos.jsx';
import Categorias from './pages/Categorias.jsx';
import Proveedores from './pages/Proveedores.jsx';
import Inventario from './pages/Inventario.jsx';
import Ventas from './pages/Ventas.jsx';
import Reportes from './pages/Reportes.jsx';

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
            path="/productos"
            element={
              <ProtectedRoute>
                <Productos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ventas"
            element={
              <ProtectedRoute>
                <Ventas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <ProtectedRoute rol="admin">
                <Reportes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventario"
            element={
              <ProtectedRoute rol="admin">
                <Inventario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categorias"
            element={
              <ProtectedRoute rol="admin">
                <Categorias />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proveedores"
            element={
              <ProtectedRoute rol="admin">
                <Proveedores />
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
          {/* TODO Sprint 3+: /inventario, /ventas */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
