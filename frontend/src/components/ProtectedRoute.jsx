// Envuelve rutas que requieren sesión. Si no hay usuario, redirige al login.
// Opcionalmente restringe por rol (ej: <ProtectedRoute rol="admin">).
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, rol }) {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" replace />;
  if (rol && usuario.rol !== rol) return <Navigate to="/" replace />;

  return children;
}
