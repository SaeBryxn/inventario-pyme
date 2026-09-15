// Página de inicio de sesión (HU-01). Usa el AuthContext para autenticar
// y redirige al dashboard al entrar.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth">
      <form className="card auth__form" onSubmit={onSubmit}>
        <h1 className="auth__brand"><span>&gt;</span> StockPro</h1>
        <p className="auth__sub">Gestión de inventario</p>

        <label>
          Correo
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@demo.com"
            required
            autoComplete="email"
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </label>

        {error && <p className="auth__error" role="alert">{error}</p>}

        <button className="btn" type="submit" disabled={cargando}>
          {cargando ? 'Entrando…' : 'Iniciar sesión'}
        </button>

        <p className="auth__hint">Demo: admin@demo.com / demo1234</p>
      </form>
    </div>
  );
}
