// Layout tipo panel admin: sidebar izquierda con iconos + header con menú de usuario.
import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import Avatar from './Avatar.jsx';
import {
  IconDashboard, IconBox, IconCart, IconChart, IconLayers, IconTag,
  IconTruck, IconUsers, IconUser, IconLogout, IconMenu, IconChevron,
  IconSun, IconMoon, IconSettings, IconShield,
} from './icons.jsx';

// Items del menú. `admin: true` = solo lo ve el administrador.
const NAV = [
  { to: '/', label: 'Dashboard', icon: IconDashboard, end: true },
  { to: '/productos', label: 'Productos', icon: IconBox },
  { to: '/ventas', label: 'Ventas', icon: IconCart },
  { to: '/clientes', label: 'Clientes', icon: IconUser },
  { to: '/inventario', label: 'Inventario', icon: IconLayers, admin: true },
  { to: '/reportes', label: 'Reportes', icon: IconChart, admin: true },
  { to: '/categorias', label: 'Categorías', icon: IconTag, admin: true },
  { to: '/proveedores', label: 'Proveedores', icon: IconTruck, admin: true },
  { to: '/usuarios', label: 'Usuarios', icon: IconUsers, admin: true },
  { to: '/auditoria', label: 'Auditoría', icon: IconShield, admin: true },
  { to: '/ajustes', label: 'Ajustes', icon: IconSettings, admin: true },
];

export default function Layout({ children, title }) {
  const { usuario, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const esAdmin = usuario?.rol === 'admin';
  const items = NAV.filter((i) => !i.admin || esAdmin);

  function salir() { logout(); navigate('/login'); }

  // Cerrar el menú de usuario al hacer click fuera.
  useEffect(() => {
    function onClick(e) { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className={`shell ${sidebarOpen ? 'shell--open' : ''}`}>
      {/* Overlay para cerrar el sidebar en móvil */}
      <div className="shell__overlay" onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className="sidebar">
        <Link to="/" className="sidebar__brand" onClick={() => setSidebarOpen(false)}>
          <span className="sidebar__logo">&gt;</span> StockPro
        </Link>
        <nav className="sidebar__nav">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon /> <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__foot">StockPro v1.0</div>
      </aside>

      {/* Área principal */}
      <div className="main">
        <header className="header">
          <button className="header__menu" aria-label="Abrir menú" onClick={() => setSidebarOpen(true)}>
            <IconMenu />
          </button>
          <h1 className="header__title">{title}</h1>

          <button className="iconbtn" onClick={toggle} aria-label="Cambiar tema" title="Cambiar tema">
            {theme === 'dark' ? <IconSun width={19} height={19} /> : <IconMoon width={19} height={19} />}
          </button>

          <div className="header__user" ref={menuRef}>
            <button className="userbtn" onClick={() => setMenuOpen((v) => !v)} aria-haspopup="true" aria-expanded={menuOpen}>
              <Avatar nombre={usuario?.nombre} avatar={usuario?.avatar} size={34} />
              <span className="userbtn__info">
                <span className="userbtn__name">{usuario?.nombre}</span>
                <span className="userbtn__rol">{usuario?.rol}</span>
              </span>
              <IconChevron width={16} height={16} />
            </button>
            {menuOpen && (
              <div className="usermenu">
                <Link to="/perfil" className="usermenu__item" onClick={() => setMenuOpen(false)}>
                  <IconUser width={16} height={16} /> Mi perfil
                </Link>
                <button className="usermenu__item usermenu__item--danger" onClick={salir}>
                  <IconLogout width={16} height={16} /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="content">{children}</main>
      </div>
    </div>
  );
}
