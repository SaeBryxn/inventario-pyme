// Página de gestión de usuarios (HU-02). Solo Admin.
// Lista, crea, edita y activa/desactiva usuarios.
import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { usuariosService } from '../services/usuarios.js';
import { useAuth } from '../context/AuthContext.jsx';

const FORM_VACIO = { nombre: '', email: '', password: '', rol: 'vendedor' };

export default function Usuarios() {
  const { usuario: yo } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null); // id o null
  const [form, setForm] = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  async function cargar() {
    setCargando(true);
    setError('');
    try {
      setUsuarios(await usuariosService.listar());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  function abrirNuevo() {
    setEditando(null);
    setForm(FORM_VACIO);
    setErrorForm('');
    setModalAbierto(true);
  }

  function abrirEditar(u) {
    setEditando(u.id);
    setForm({ nombre: u.nombre, email: u.email, password: '', rol: u.rol });
    setErrorForm('');
    setModalAbierto(true);
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setErrorForm('');
    try {
      if (editando) {
        // En edición, no mandamos password si quedó vacío.
        const datos = { nombre: form.nombre, email: form.email, rol: form.rol };
        if (form.password) datos.password = form.password;
        await usuariosService.actualizar(editando, datos);
      } else {
        await usuariosService.crear(form);
      }
      setModalAbierto(false);
      await cargar();
    } catch (e) {
      setErrorForm(e.message);
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado(u) {
    try {
      await usuariosService.toggleActivo(u.id);
      await cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <Layout>
      <div className="toolbar">
        <div>
          <h2>Usuarios</h2>
          <p className="muted">Gestiona quién accede al sistema y con qué rol.</p>
        </div>
        <button className="btn" onClick={abrirNuevo}>+ Nuevo usuario</button>
      </div>

      {error && <p className="auth__error">{error}</p>}
      {cargando ? (
        <p className="muted">Cargando…</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td><span className="badge badge--rol">{u.rol}</span></td>
                  <td>
                    <span className={`badge ${u.activo ? 'badge--on' : 'badge--off'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => abrirEditar(u)}>Editar</button>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => cambiarEstado(u)}
                        disabled={u.id === yo.id}
                        title={u.id === yo.id ? 'No puedes desactivar tu propia cuenta' : ''}
                      >
                        {u.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr><td colSpan="5" className="muted">No hay usuarios.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <form className="card modal" onClick={(e) => e.stopPropagation()} onSubmit={guardar}>
            <h3>{editando ? 'Editar usuario' : 'Nuevo usuario'}</h3>

            <label>
              Nombre
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label>
              Contraseña {editando && <span className="muted">(dejar vacío para no cambiarla)</span>}
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editando}
                placeholder={editando ? '••••••••' : ''}
              />
            </label>
            <label>
              Rol
              <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
                <option value="vendedor">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>
            </label>

            {errorForm && <p className="auth__error">{errorForm}</p>}

            <div className="modal__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setModalAbierto(false)}>Cancelar</button>
              <button type="submit" className="btn" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}
