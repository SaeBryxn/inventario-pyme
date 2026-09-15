// Layout con barra superior compartida por las páginas internas.
// Muestra la navegación según el rol y el botón de salir.
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout({ children }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function salir() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="topbar__brand" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span>&gt;</span> StockPro
        </Link>

        <nav className="topbar__nav">
          <Link to="/">Dashboard</Link>
          <Link to="/productos">Productos</Link>
          {usuario?.rol === 'admin' && <Link to="/categorias">Categorías</Link>}
          {usuario?.rol === 'admin' && <Link to="/proveedores">Proveedores</Link>}
          {usuario?.rol === 'admin' && <Link to="/usuarios">Usuarios</Link>}
        </nav>

        <div className="topbar__user">
          <span>{usuario?.nombre} · <em>{usuario?.rol}</em></span>
          <button className="btn btn--ghost btn--sm" onClick={salir}>Salir</button>
        </div>
      </header>
      <main className="content">{children}</main>
    </div>
  );
}
