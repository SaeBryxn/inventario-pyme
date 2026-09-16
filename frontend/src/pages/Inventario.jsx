// Página de inventario (HU-07 entrada, HU-08 salida/ajuste, HU-10 historial).
// Registrar movimientos: solo admin. El stock se mueve en el backend.
import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { movimientosService, productosService, proveedoresService } from '../services/catalogo.js';

const VACIO = { producto_id: '', tipo: 'entrada', cantidad: '', motivo: '', proveedor_id: '' };

const TIPO_LABEL = { entrada: 'Entrada', salida: 'Salida', ajuste: 'Ajuste' };

export default function Inventario() {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Filtros del historial
  const [fProducto, setFProducto] = useState('');
  const [fTipo, setFTipo] = useState('');
  const [fDesde, setFDesde] = useState('');
  const [fHasta, setFHasta] = useState('');

  // Modal registrar
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [errorForm, setErrorForm] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function cargarHistorial() {
    setCargando(true); setError('');
    try {
      setMovimientos(await movimientosService.listar({ producto_id: fProducto, tipo: fTipo, desde: fDesde, hasta: fHasta }));
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }

  useEffect(() => {
    // productos activos para el selector (traemos bastantes)
    productosService.listar({ estado: 'activos', limit: 50 }).then((r) => setProductos(r.items)).catch(() => {});
    proveedoresService.listar().then(setProveedores).catch(() => {});
  }, []);

  useEffect(() => { cargarHistorial(); }, [fProducto, fTipo, fDesde, fHasta]);

  function abrir() { setForm(VACIO); setErrorForm(''); setModal(true); }

  async function guardar(e) {
    e.preventDefault(); setErrorForm(''); setGuardando(true);
    try {
      await movimientosService.registrar({
        producto_id: form.producto_id,
        tipo: form.tipo,
        cantidad: Number(form.cantidad),
        motivo: form.motivo,
        proveedor_id: form.tipo === 'entrada' ? form.proveedor_id || null : null,
      });
      setModal(false);
      await cargarHistorial();
      // refrescamos la lista de productos (para stock actualizado en el selector)
      productosService.listar({ estado: 'activos', limit: 50 }).then((r) => setProductos(r.items)).catch(() => {});
    } catch (e) { setErrorForm(e.message); }
    finally { setGuardando(false); }
  }

  const fecha = (f) => new Date(f).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <Layout>
      <div className="toolbar">
        <div>
          <h2>Inventario</h2>
          <p className="muted">Registra entradas, salidas y ajustes. El stock se actualiza solo.</p>
        </div>
        <button className="btn" onClick={abrir}>+ Registrar movimiento</button>
      </div>

      {/* Filtros del historial */}
      <div className="filtros">
        <select value={fProducto} onChange={(e) => setFProducto(e.target.value)}>
          <option value="">Todos los productos</option>
          {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
        <select value={fTipo} onChange={(e) => setFTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          <option value="entrada">Entradas</option>
          <option value="salida">Salidas</option>
          <option value="ajuste">Ajustes</option>
        </select>
        <label className="filtros__fecha">Desde <input type="date" value={fDesde} onChange={(e) => setFDesde(e.target.value)} /></label>
        <label className="filtros__fecha">Hasta <input type="date" value={fHasta} onChange={(e) => setFHasta(e.target.value)} /></label>
      </div>

      {error && <p className="auth__error">{error}</p>}
      {cargando ? <p className="muted">Cargando…</p> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Motivo</th><th>Usuario</th></tr>
            </thead>
            <tbody>
              {movimientos.map((m) => (
                <tr key={m.id}>
                  <td className="muted">{fecha(m.fecha)}</td>
                  <td>{m.producto} <span className="mono">{m.sku}</span></td>
                  <td><span className={`badge badge--mov-${m.tipo}`}>{TIPO_LABEL[m.tipo]}</span></td>
                  <td>{m.cantidad}</td>
                  <td className="muted">{m.motivo || '—'}{m.proveedor ? ` · ${m.proveedor}` : ''}</td>
                  <td className="muted">{m.usuario}</td>
                </tr>
              ))}
              {movimientos.length === 0 && <tr><td colSpan="6" className="muted">Sin movimientos.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <form className="card modal" onClick={(e) => e.stopPropagation()} onSubmit={guardar}>
            <h3>Registrar movimiento</h3>

            <label>Producto
              <select value={form.producto_id} onChange={(e) => setForm({ ...form, producto_id: e.target.value })} required>
                <option value="">Selecciona…</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre} (stock: {p.stock_actual})</option>
                ))}
              </select>
            </label>

            <label>Tipo
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                <option value="entrada">Entrada (suma stock)</option>
                <option value="salida">Salida (resta stock)</option>
                <option value="ajuste">Ajuste (fija el stock real)</option>
              </select>
            </label>

            <label>
              {form.tipo === 'ajuste' ? 'Nuevo stock contado' : 'Cantidad'}
              <input type="number" min="0" value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: e.target.value })} required />
            </label>

            {form.tipo === 'entrada' && (
              <label>Proveedor (opcional)
                <select value={form.proveedor_id} onChange={(e) => setForm({ ...form, proveedor_id: e.target.value })}>
                  <option value="">—</option>
                  {proveedores.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </label>
            )}

            <label>Motivo (opcional)
              <input value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                placeholder="Ej: compra, merma, corrección…" />
            </label>

            {errorForm && <p className="auth__error">{errorForm}</p>}
            <div className="modal__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className="btn" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Registrar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}
