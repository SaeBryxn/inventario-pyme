// Página de Clientes (mini-CRM). Con toasts, confirmación, skeleton y estado vacío.
import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { SkeletonTable } from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { clientesService } from '../services/catalogo.js';
import { useToast } from '../context/ToastContext.jsx';
import { useConfirm } from '../context/ConfirmContext.jsx';
import { IconUsers, IconPlus } from '../components/icons.jsx';

const VACIO = { nombre: '', documento: '', telefono: '', email: '' };

export default function Clientes() {
  const toast = useToast();
  const confirmar = useConfirm();
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [errorForm, setErrorForm] = useState('');

  async function cargar() {
    setCargando(true);
    try { setItems(await clientesService.listar()); }
    catch (e) { toast.error(e.message); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargar(); }, []);

  function nuevo() { setEditando(null); setForm(VACIO); setErrorForm(''); setModal(true); }
  function editar(c) { setEditando(c.id); setForm({ nombre: c.nombre, documento: c.documento || '', telefono: c.telefono || '', email: c.email || '' }); setErrorForm(''); setModal(true); }

  async function guardar(e) {
    e.preventDefault(); setErrorForm('');
    try {
      if (editando) await clientesService.actualizar(editando, form);
      else await clientesService.crear(form);
      setModal(false); await cargar();
      toast.ok(editando ? 'Cliente actualizado' : 'Cliente creado');
    } catch (e) { setErrorForm(e.message); }
  }

  async function eliminar(c) {
    const ok = await confirmar({ titulo: 'Eliminar cliente', mensaje: `¿Seguro que quieres eliminar a "${c.nombre}"?`, confirmar: 'Eliminar', peligro: true });
    if (!ok) return;
    try { await clientesService.eliminar(c.id); await cargar(); toast.ok('Cliente eliminado'); }
    catch (e) { toast.error(e.message); }
  }

  return (
    <Layout title="Clientes">
      <div className="toolbar">
        <div>
          <h2>Clientes</h2>
          <p className="muted">Tu cartera de clientes.</p>
        </div>
        <button className="btn" onClick={nuevo}><IconPlus width={16} height={16} /> Nuevo cliente</button>
      </div>

      {cargando ? <SkeletonTable rows={4} cols={4} />
        : items.length === 0 ? (
          <EmptyState icon={IconUsers} titulo="Aún no hay clientes"
            texto="Registra tus clientes para asociarlos a las ventas."
            accion={<button className="btn" onClick={nuevo}><IconPlus width={16} height={16} /> Nuevo cliente</button>} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nombre</th><th>Documento</th><th>Teléfono</th><th>Email</th><th></th></tr></thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nombre}</td>
                    <td className="muted">{c.documento || '—'}</td>
                    <td className="muted">{c.telefono || '—'}</td>
                    <td className="muted">{c.email || '—'}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn--ghost btn--sm" onClick={() => editar(c)}>Editar</button>
                        <button className="btn btn--ghost btn--sm" onClick={() => eliminar(c)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <form className="card modal" onClick={(e) => e.stopPropagation()} onSubmit={guardar}>
            <h3>{editando ? 'Editar cliente' : 'Nuevo cliente'}</h3>
            <label>Nombre
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </label>
            <label>Documento (DNI/RUC)
              <input value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} />
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
