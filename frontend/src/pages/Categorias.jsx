// Página de categorías (HU-04). Solo Admin. Con toasts, confirmación, skeleton y estado vacío.
import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { SkeletonTable } from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { categoriasService } from '../services/catalogo.js';
import { useToast } from '../context/ToastContext.jsx';
import { useConfirm } from '../context/ConfirmContext.jsx';
import { IconTag, IconPlus } from '../components/icons.jsx';

const VACIO = { nombre: '', descripcion: '' };

export default function Categorias() {
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
    try { setItems(await categoriasService.listar()); }
    catch (e) { toast.error(e.message); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargar(); }, []);

  function nuevo() { setEditando(null); setForm(VACIO); setErrorForm(''); setModal(true); }
  function editar(c) { setEditando(c.id); setForm({ nombre: c.nombre, descripcion: c.descripcion || '' }); setErrorForm(''); setModal(true); }

  async function guardar(e) {
    e.preventDefault(); setErrorForm('');
    try {
      if (editando) await categoriasService.actualizar(editando, form);
      else await categoriasService.crear(form);
      setModal(false); await cargar();
      toast.ok(editando ? 'Categoría actualizada' : 'Categoría creada');
    } catch (e) { setErrorForm(e.message); }
  }

  async function eliminar(c) {
    const ok = await confirmar({ titulo: 'Eliminar categoría', mensaje: `¿Seguro que quieres eliminar "${c.nombre}"?`, confirmar: 'Eliminar', peligro: true });
    if (!ok) return;
    try { await categoriasService.eliminar(c.id); await cargar(); toast.ok('Categoría eliminada'); }
    catch (e) { toast.error(e.message); }
  }

  return (
    <Layout title="Categorías">
      <div className="toolbar">
        <div>
          <h2>Categorías</h2>
          <p className="muted">Organiza tus productos por categoría.</p>
        </div>
        <button className="btn" onClick={nuevo}><IconPlus width={16} height={16} /> Nueva categoría</button>
      </div>

      {cargando ? <SkeletonTable rows={4} cols={3} />
        : items.length === 0 ? (
          <EmptyState icon={IconTag} titulo="Aún no hay categorías"
            texto="Crea tu primera categoría para organizar el catálogo."
            accion={<button className="btn" onClick={nuevo}><IconPlus width={16} height={16} /> Nueva categoría</button>} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nombre</th><th>Descripción</th><th></th></tr></thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nombre}</td>
                    <td className="muted">{c.descripcion || '—'}</td>
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
            <h3>{editando ? 'Editar categoría' : 'Nueva categoría'}</h3>
            <label>Nombre
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </label>
            <label>Descripción
              <input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
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
