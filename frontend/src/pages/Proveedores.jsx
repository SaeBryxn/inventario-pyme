// Página de proveedores (HU-15). Solo Admin.
import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { proveedoresService } from '../services/catalogo.js';
import { useToast } from '../context/ToastContext.jsx';
import { useConfirm } from '../context/ConfirmContext.jsx';

const VACIO = { nombre: '', ruc: '', telefono: '', email: '' };

export default function Proveedores() {
  const toast = useToast();
  const confirmar = useConfirm();
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [errorForm, setErrorForm] = useState('');

  async function cargar() {
    setCargando(true); setError('');
    try { setItems(await proveedoresService.listar()); }
    catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargar(); }, []);

  function nuevo() { setEditando(null); setForm(VACIO); setErrorForm(''); setModal(true); }
  function editar(p) { setEditando(p.id); setForm({ nombre: p.nombre, ruc: p.ruc || '', telefono: p.telefono || '', email: p.email || '' }); setErrorForm(''); setModal(true); }

  async function guardar(e) {
    e.preventDefault(); setErrorForm('');
    try {
      if (editando) await proveedoresService.actualizar(editando, form);
      else await proveedoresService.crear(form);
      setModal(false); await cargar();
      toast.ok(editando ? 'Proveedor actualizado' : 'Proveedor creado');
    } catch (e) { setErrorForm(e.message); }
  }

  async function eliminar(p) {
    const ok = await confirmar({ titulo: 'Eliminar proveedor', mensaje: `¿Seguro que quieres eliminar "${p.nombre}"?`, confirmar: 'Eliminar', peligro: true });
    if (!ok) return;
    try { await proveedoresService.eliminar(p.id); await cargar(); toast.ok('Proveedor eliminado'); }
    catch (e) { toast.error(e.message); }
  }

  return (
    <Layout>
      <div className="toolbar">
        <div>
          <h2>Proveedores</h2>
          <p className="muted">Tus proveedores para las entradas de stock.</p>
        </div>
        <button className="btn" onClick={nuevo}>+ Nuevo proveedor</button>
      </div>

      {error && <p className="auth__error">{error}</p>}
      {cargando ? <p className="muted">Cargando…</p> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nombre</th><th>RUC</th><th>Teléfono</th><th>Email</th><th></th></tr></thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td className="muted">{p.ruc || '—'}</td>
                  <td className="muted">{p.telefono || '—'}</td>
                  <td className="muted">{p.email || '—'}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => editar(p)}>Editar</button>
                      <button className="btn btn--ghost btn--sm" onClick={() => eliminar(p)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan="5" className="muted">Sin proveedores.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <form className="card modal" onClick={(e) => e.stopPropagation()} onSubmit={guardar}>
            <h3>{editando ? 'Editar proveedor' : 'Nuevo proveedor'}</h3>
            <label>Nombre
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </label>
            <label>RUC
              <input value={form.ruc} onChange={(e) => setForm({ ...form, ruc: e.target.value })} maxLength="11" />
            </label>
            <label>Teléfono
              <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            </label>
            <label>Email
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            {errorForm && <p className="auth__error">{errorForm}</p>}
            <div className="modal__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className="btn">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}
