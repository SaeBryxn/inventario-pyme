// Página de ventas (HU-11 registrar con carrito, HU-12 historial + detalle).
import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { ventasService, productosService } from '../services/catalogo.js';

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;
const fecha = (f) => new Date(f).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Modal nueva venta
  const [modal, setModal] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [selProd, setSelProd] = useState('');
  const [selCant, setSelCant] = useState('1');
  const [errorForm, setErrorForm] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Modal detalle
  const [detalle, setDetalle] = useState(null);

  async function cargar() {
    setCargando(true); setError('');
    try { setVentas(await ventasService.listar()); }
    catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargar(); }, []);
  useEffect(() => {
    productosService.listar({ estado: 'activos', limit: 50 }).then((r) => setProductos(r.items)).catch(() => {});
  }, []);

  function abrir() { setCarrito([]); setSelProd(''); setSelCant('1'); setErrorForm(''); setModal(true); }

  function agregar() {
    setErrorForm('');
    const prod = productos.find((p) => String(p.id) === String(selProd));
    const cant = Number(selCant);
    if (!prod || !cant || cant <= 0) { setErrorForm('Elige un producto y una cantidad válida'); return; }
    const yaEn = carrito.find((c) => c.producto_id === prod.id);
    const enCarrito = yaEn ? yaEn.cantidad : 0;
    if (cant + enCarrito > prod.stock_actual) {
      setErrorForm(`Solo hay ${prod.stock_actual} de ${prod.nombre} en stock`);
      return;
    }
    if (yaEn) {
      setCarrito(carrito.map((c) => c.producto_id === prod.id ? { ...c, cantidad: c.cantidad + cant } : c));
    } else {
      setCarrito([...carrito, {
        producto_id: prod.id, nombre: prod.nombre, precio: Number(prod.precio_venta), cantidad: cant,
      }]);
    }
    setSelCant('1');
  }

  function quitar(id) { setCarrito(carrito.filter((c) => c.producto_id !== id)); }

  const totalCarrito = carrito.reduce((s, c) => s + c.precio * c.cantidad, 0);

  async function registrar() {
    if (carrito.length === 0) { setErrorForm('El carrito está vacío'); return; }
    setGuardando(true); setErrorForm('');
    try {
      await ventasService.registrar({ items: carrito.map((c) => ({ producto_id: c.producto_id, cantidad: c.cantidad })) });
      setModal(false);
      await cargar();
      productosService.listar({ estado: 'activos', limit: 50 }).then((r) => setProductos(r.items)).catch(() => {});
    } catch (e) { setErrorForm(e.message); }
    finally { setGuardando(false); }
  }

  async function verDetalle(v) {
    try { setDetalle(await ventasService.detalle(v.id)); }
    catch (e) { setError(e.message); }
  }

  return (
    <Layout>
      <div className="toolbar">
        <div>
          <h2>Ventas</h2>
          <p className="muted">Registra ventas y consulta el historial.</p>
        </div>
        <button className="btn" onClick={abrir}>+ Nueva venta</button>
      </div>

      {error && <p className="auth__error">{error}</p>}
      {cargando ? <p className="muted">Cargando…</p> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Código</th><th>Fecha</th><th>Vendedor</th><th>Items</th><th>Total</th><th></th></tr>
            </thead>
            <tbody>
              {ventas.map((v) => (
                <tr key={v.id}>
                  <td className="mono">{v.codigo}</td>
                  <td className="muted">{fecha(v.fecha)}</td>
                  <td>{v.vendedor}</td>
                  <td>{v.items}</td>
                  <td><strong>{money(v.total)}</strong></td>
                  <td><button className="btn btn--ghost btn--sm" onClick={() => verDetalle(v)}>Ver</button></td>
                </tr>
              ))}
              {ventas.length === 0 && <tr><td colSpan="6" className="muted">Aún no hay ventas.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal nueva venta */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="card modal modal--ancho" onClick={(e) => e.stopPropagation()}>
            <h3>Nueva venta</h3>

            <div className="venta__agregar">
              <select value={selProd} onChange={(e) => setSelProd(e.target.value)}>
                <option value="">Producto…</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre} — {money(p.precio_venta)} (stock {p.stock_actual})</option>
                ))}
              </select>
              <input type="number" min="1" value={selCant} onChange={(e) => setSelCant(e.target.value)} style={{ width: 70 }} />
              <button type="button" className="btn btn--sm" onClick={agregar}>Agregar</button>
            </div>

            <div className="table-wrap" style={{ marginTop: '0.5rem' }}>
              <table>
                <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th><th></th></tr></thead>
                <tbody>
                  {carrito.map((c) => (
                    <tr key={c.producto_id}>
                      <td>{c.nombre}</td>
                      <td>{c.cantidad}</td>
                      <td>{money(c.precio)}</td>
                      <td>{money(c.precio * c.cantidad)}</td>
                      <td><button type="button" className="btn btn--ghost btn--sm" onClick={() => quitar(c.producto_id)}>✕</button></td>
                    </tr>
                  ))}
                  {carrito.length === 0 && <tr><td colSpan="5" className="muted">Agrega productos a la venta.</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="venta__total"><span>Total</span><strong>{money(totalCarrito)}</strong></div>

            {errorForm && <p className="auth__error">{errorForm}</p>}
            <div className="modal__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setModal(false)}>Cancelar</button>
              <button type="button" className="btn" onClick={registrar} disabled={guardando || carrito.length === 0}>
                {guardando ? 'Registrando…' : `Registrar venta (${money(totalCarrito)})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal detalle */}
      {detalle && (
        <div className="modal-overlay" onClick={() => setDetalle(null)}>
          <div className="card modal modal--ancho" onClick={(e) => e.stopPropagation()}>
            <h3>Venta {detalle.codigo}</h3>
            <p className="muted">{fecha(detalle.fecha)} · {detalle.vendedor}</p>
            <div className="table-wrap">
              <table>
                <thead><tr><th>SKU</th><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {detalle.items.map((it, i) => (
                    <tr key={i}>
                      <td className="mono">{it.sku}</td>
                      <td>{it.nombre}</td>
                      <td>{it.cantidad}</td>
                      <td>{money(it.precio_unitario)}</td>
                      <td>{money(it.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="venta__total"><span>Total</span><strong>{money(detalle.total)}</strong></div>
            <div className="modal__actions">
              <button type="button" className="btn" onClick={() => setDetalle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
