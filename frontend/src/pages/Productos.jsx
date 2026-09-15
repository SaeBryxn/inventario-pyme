// Página de productos (HU-05 CRUD, HU-06 búsqueda/filtros/paginación).
// Ver: admin y vendedor. Crear/editar/desactivar: solo admin.
import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { productosService, categoriasService } from '../services/catalogo.js';
import { useAuth } from '../context/AuthContext.jsx';

const VACIO = { sku: '', nombre: '', categoria_id: '', precio_compra: '', precio_venta: '', stock_minimo: '' };

export default function Productos() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'admin';

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [buscar, setBuscar] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('activos');
  const [page, setPage] = useState(1);

  // Modal
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [errorForm, setErrorForm] = useState('');

  // Cargar categorías (para filtro y formulario)
  useEffect(() => { categoriasService.listar().then(setCategorias).catch(() => {}); }, []);

  // Cargar productos cuando cambian los filtros (con debounce para la búsqueda)
  useEffect(() => {
    const t = setTimeout(async () => {
      setCargando(true); setError('');
      try {
        const res = await productosService.listar({ buscar, categoria, estado, page, limit: 8 });
        setItems(res.items);
        setMeta({ total: res.total, page: res.page, totalPages: res.totalPages });
      } catch (e) { setError(e.message); }
      finally { setCargando(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [buscar, categoria, estado, page]);

  // Al cambiar un filtro, volver a la página 1
  useEffect(() => { setPage(1); }, [buscar, categoria, estado]);

  function nuevo() { setEditando(null); setForm(VACIO); setErrorForm(''); setModal(true); }
  function editar(p) {
    setEditando(p.id);
    setForm({
      sku: p.sku, nombre: p.nombre, categoria_id: p.categoria_id || '',
      precio_compra: p.precio_compra, precio_venta: p.precio_venta, stock_minimo: p.stock_minimo,
    });
    setErrorForm(''); setModal(true);
  }

  async function guardar(e) {
    e.preventDefault(); setErrorForm('');
    const datos = {
      ...form,
      categoria_id: form.categoria_id || null,
      precio_compra: Number(form.precio_compra) || 0,
      precio_venta: Number(form.precio_venta) || 0,
      stock_minimo: Number(form.stock_minimo) || 0,
    };
    try {
      if (editando) await productosService.actualizar(editando, datos);
      else await productosService.crear(datos);
      setModal(false);
      // recargar la lista
      const res = await productosService.listar({ buscar, categoria, estado, page, limit: 8 });
      setItems(res.items); setMeta({ total: res.total, page: res.page, totalPages: res.totalPages });
    } catch (e) { setErrorForm(e.message); }
  }

  async function cambiarEstado(p) {
    try {
      await productosService.toggleActivo(p.id);
      const res = await productosService.listar({ buscar, categoria, estado, page, limit: 8 });
      setItems(res.items); setMeta({ total: res.total, page: res.page, totalPages: res.totalPages });
    } catch (e) { setError(e.message); }
  }

  const money = (n) => `S/ ${Number(n).toFixed(2)}`;

  return (
    <Layout>
      <div className="toolbar">
        <div>
          <h2>Productos</h2>
          <p className="muted">{meta.total} producto(s) en el catálogo.</p>
        </div>
        {esAdmin && <button className="btn" onClick={nuevo}>+ Nuevo producto</button>}
      </div>

      {/* Filtros */}
      <div className="filtros">
        <input
          className="filtros__buscar"
          placeholder="Buscar por nombre o SKU…"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
          <option value="todos">Todos</option>
        </select>
      </div>

      {error && <p className="auth__error">{error}</p>}
      {cargando ? <p className="muted">Cargando…</p> : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>SKU</th><th>Producto</th><th>Categoría</th>
                  <th>P. venta</th><th>Stock</th><th>Estado</th>{esAdmin && <th></th>}
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td className="mono">{p.sku}</td>
                    <td>{p.nombre}</td>
                    <td className="muted">{p.categoria || '—'}</td>
                    <td>{money(p.precio_venta)}</td>
                    <td>
                      {p.stock_actual}
                      {p.stock_bajo && <span className="badge badge--warn" title={`Mínimo: ${p.stock_minimo}`}>bajo</span>}
                    </td>
                    <td>
                      <span className={`badge ${p.activo ? 'badge--on' : 'badge--off'}`}>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    {esAdmin && (
                      <td>
                        <div className="row-actions">
                          <button className="btn btn--ghost btn--sm" onClick={() => editar(p)}>Editar</button>
                          <button className="btn btn--ghost btn--sm" onClick={() => cambiarEstado(p)}>
                            {p.activo ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={esAdmin ? 7 : 6} className="muted">No hay productos que coincidan.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {meta.totalPages > 1 && (
            <div className="paginacion">
              <button className="btn btn--ghost btn--sm" disabled={meta.page <= 1} onClick={() => setPage(meta.page - 1)}>← Anterior</button>
              <span className="muted">Página {meta.page} de {meta.totalPages}</span>
              <button className="btn btn--ghost btn--sm" disabled={meta.page >= meta.totalPages} onClick={() => setPage(meta.page + 1)}>Siguiente →</button>
            </div>
          )}
        </>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <form className="card modal" onClick={(e) => e.stopPropagation()} onSubmit={guardar}>
            <h3>{editando ? 'Editar producto' : 'Nuevo producto'}</h3>
            <label>SKU
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            </label>
            <label>Nombre
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </label>
            <label>Categoría
              <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}>
                <option value="">Sin categoría</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </label>
            <div className="modal__row">
              <label>Precio compra
                <input type="number" step="0.01" min="0" value={form.precio_compra} onChange={(e) => setForm({ ...form, precio_compra: e.target.value })} />
              </label>
              <label>Precio venta
                <input type="number" step="0.01" min="0" value={form.precio_venta} onChange={(e) => setForm({ ...form, precio_venta: e.target.value })} />
              </label>
            </div>
            <label>Stock mínimo (para alertas)
              <input type="number" min="0" value={form.stock_minimo} onChange={(e) => setForm({ ...form, stock_minimo: e.target.value })} />
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
