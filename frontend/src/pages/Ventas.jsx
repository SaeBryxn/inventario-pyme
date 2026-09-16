// Ventas: registrar con carrito (cliente + IGV), historial con filtros de fecha
// y comprobante imprimible.
import { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { SkeletonTable } from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProductCombobox from '../components/ProductCombobox.jsx';
import { ventasService, productosService, clientesService, configService } from '../services/catalogo.js';
import { useToast } from '../context/ToastContext.jsx';
import { useDialog } from '../hooks/useDialog.js';
import { IconCart, IconPlus, IconPrint } from '../components/icons.jsx';
import { desglosarIgv } from '../utils/igv.js';
import './venta.css';

const fechaHora = (f) => new Date(f).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });

export default function Ventas() {
  const toast = useToast();
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [config, setConfig] = useState({ moneda: 'S/', igv_porcentaje: 18 });
  const [cargando, setCargando] = useState(true);

  // Filtros
  const [fDesde, setFDesde] = useState('');
  const [fHasta, setFHasta] = useState('');

  // Modal nueva venta
  const [modal, setModal] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [prodSel, setProdSel] = useState(null); // producto elegido en el combobox
  const [resetProd, setResetProd] = useState(0); // señal para limpiar el combobox tras agregar
  const [selCant, setSelCant] = useState('1');
  const [selCliente, setSelCliente] = useState('');
  const [errorForm, setErrorForm] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Accesibilidad del modal (focus trap + Escape)
  const dialogRef = useRef(null);
  const cerrarModal = () => setModal(false);
  useDialog(dialogRef, { abierto: modal, onClose: cerrarModal });

  const [detalle, setDetalle] = useState(null);
  const [recibo, setRecibo] = useState(null);

  const money = (n) => `${config.moneda || 'S/'} ${Number(n || 0).toFixed(2)}`;
  const igvPct = Number(config.igv_porcentaje) || 0;
  const desglose = (total) => desglosarIgv(total, igvPct);

  async function cargar() {
    setCargando(true);
    try { setVentas(await ventasService.listar({ desde: fDesde, hasta: fHasta })); }
    catch (e) { toast.error(e.message); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargar(); }, [fDesde, fHasta]); // eslint-disable-line
  useEffect(() => {
    productosService.listar({ estado: 'activos', limit: 50 }).then((r) => setProductos(r.items)).catch(() => {});
    clientesService.listar().then(setClientes).catch(() => {});
    configService.get().then((c) => c?.moneda && setConfig(c)).catch(() => {});
  }, []);

  function abrir() { setCarrito([]); setProdSel(null); setSelCant('1'); setSelCliente(''); setErrorForm(''); setModal(true); }

  function agregar() {
    setErrorForm('');
    const prod = prodSel;
    const cant = Number(selCant);
    if (!prod) { setErrorForm('Elige un producto de la lista'); return; }
    if (!cant || cant <= 0) { setErrorForm('Indica una cantidad válida'); return; }
    const yaEn = carrito.find((c) => c.producto_id === prod.id);
    const enCarrito = yaEn ? yaEn.cantidad : 0;
    if (cant + enCarrito > prod.stock_actual) { setErrorForm(`Solo hay ${prod.stock_actual} de ${prod.nombre} en stock`); return; }
    if (yaEn) setCarrito(carrito.map((c) => c.producto_id === prod.id ? { ...c, cantidad: c.cantidad + cant } : c));
    else setCarrito([...carrito, { producto_id: prod.id, nombre: prod.nombre, precio: Number(prod.precio_venta), cantidad: cant }]);
    // Reset para el siguiente ítem: limpiamos selección y disparamos el reset del combobox.
    setProdSel(null);
    setResetProd((s) => s + 1);
    setSelCant('1');
  }
  function quitar(id) { setCarrito(carrito.filter((c) => c.producto_id !== id)); }

  // Stock restante por ítem (Loss Aversion: marco de escasez informativo).
  const stockRestante = (it) => {
    const p = productos.find((x) => x.id === it.producto_id);
    return p ? p.stock_actual - it.cantidad : null;
  };
  const totalCarrito = carrito.reduce((s, c) => s + c.precio * c.cantidad, 0);
  const dCarrito = desglose(totalCarrito);

  async function registrar() {
    if (carrito.length === 0) { setErrorForm('El carrito está vacío'); return; }
    setGuardando(true); setErrorForm('');
    try {
      await ventasService.registrar({
        items: carrito.map((c) => ({ producto_id: c.producto_id, cantidad: c.cantidad })),
        cliente_id: selCliente || null,
      });
      setModal(false); await cargar();
      toast.ok('Venta registrada ✓');
      productosService.listar({ estado: 'activos', limit: 50 }).then((r) => setProductos(r.items)).catch(() => {});
    } catch (e) { setErrorForm(e.message); }
    finally { setGuardando(false); }
  }

  async function verDetalle(v) {
    try { setDetalle(await ventasService.detalle(v.id)); }
    catch (e) { toast.error(e.message); }
  }

  function imprimir(venta) {
    setRecibo(venta);
    setTimeout(() => window.print(), 60); // deja renderizar el print-area
  }

  const dDet = detalle ? desglose(detalle.total) : null;
  const dRec = recibo ? desglose(recibo.total) : null;

  return (
    <Layout title="Ventas">
      <div className="toolbar">
        <div>
          <h2>Ventas</h2>
          <p className="muted">Registra ventas y consulta el historial.</p>
        </div>
        <button className="btn" onClick={abrir}><IconPlus width={16} height={16} /> Nueva venta</button>
      </div>

      <div className="filtros">
        <label className="filtros__fecha">Desde <input type="date" value={fDesde} onChange={(e) => setFDesde(e.target.value)} /></label>
        <label className="filtros__fecha">Hasta <input type="date" value={fHasta} onChange={(e) => setFHasta(e.target.value)} /></label>
        {(fDesde || fHasta) && <button className="btn btn--ghost btn--sm" onClick={() => { setFDesde(''); setFHasta(''); }}>Limpiar</button>}
      </div>

      {cargando ? <SkeletonTable rows={5} cols={6} />
        : ventas.length === 0 ? (
          <EmptyState icon={IconCart} titulo="Aún no hay ventas"
            texto="Registra tu primera venta para verla aquí."
            accion={<button className="btn" onClick={abrir}><IconPlus width={16} height={16} /> Nueva venta</button>} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Código</th><th>Fecha</th><th>Cliente</th><th>Vendedor</th><th>Items</th><th>Total</th><th></th></tr></thead>
              <tbody>
                {ventas.map((v) => (
                  <tr key={v.id}>
                    <td className="mono">{v.codigo}</td>
                    <td className="muted">{fechaHora(v.fecha)}</td>
                    <td>{v.cliente || '—'}</td>
                    <td>{v.vendedor}</td>
                    <td>{v.items}</td>
                    <td><strong>{money(v.total)}</strong></td>
                    <td><button className="btn btn--ghost btn--sm" onClick={() => verDetalle(v)}>Ver</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {/* Modal nueva venta — 2 Regiones Comunes (Composición → Resultado) + a11y */}
      {modal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div
            className="card modal modal--ancho"
            role="dialog"
            aria-modal="true"
            aria-labelledby="venta-titulo"
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="venta-titulo">Nueva venta</h3>

            {/* ── Región 1: COMPOSICIÓN ─────────────────────────── */}
            <section className="venta__compose" aria-label="Añadir producto">
              <ProductCombobox productos={productos} onSelect={setProdSel} resetSignal={resetProd} />
              <input
                className="venta__qty"
                type="number" min="1" inputMode="numeric"
                value={selCant}
                onChange={(e) => setSelCant(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); agregar(); } }}
                aria-label="Cantidad"
              />
              {/* Acción secundaria: tonal, NO acento sólido (libera la señal de Registrar) */}
              <button type="button" className="btn btn--tonal venta__add" onClick={agregar}>Agregar</button>
              {/* Error anclado a su causa (Proximidad Gestalt) */}
              {errorForm && <p className="venta__error" role="alert">{errorForm}</p>}
            </section>

            {/* ── Región 2: RESULTADO (Región Común) ────────────── */}
            <section className="venta-cart" aria-label="Detalle de la venta">
              {/* aria-live: cada alta/baja se anuncia sin robar el foco */}
              <div className="venta-cart__live" aria-live="polite">
                {carrito.length === 0
                  ? 'Carrito vacío'
                  : `${carrito.length} ítem(s) · Total ${money(totalCarrito)}`}
              </div>

              {carrito.length === 0
                ? <p className="venta-cart__empty">Busca un producto arriba y pulsa «Agregar».</p>
                : (
                  <ul className="venta-cart__items">
                    {carrito.map((c) => (
                      <li key={c.producto_id} className="venta-cart__row">
                        <span className="venta-cart__name">{c.nombre}</span>
                        <span className="venta-cart__meta">
                          {c.cantidad} × {money(c.precio)}
                          {stockRestante(c) != null && ` · quedan ${stockRestante(c)}`}
                        </span>
                        <span className="venta-cart__total">{money(c.precio * c.cantidad)}</span>
                        <button type="button" className="venta-cart__rm"
                                onClick={() => quitar(c.producto_id)} aria-label={`Quitar ${c.nombre}`}>✕</button>
                      </li>
                    ))}
                  </ul>
                )}

              <dl className="venta-cart__totales">
                {igvPct > 0 && (
                  <>
                    <div><dt>Subtotal</dt><dd>{money(dCarrito.sub)}</dd></div>
                    <div><dt>IGV ({igvPct}%)</dt><dd>{money(dCarrito.igv)}</dd></div>
                  </>
                )}
                <div className="es-total"><dt>Total</dt><dd>{money(totalCarrito)}</dd></div>
              </dl>
            </section>

            {/* Cliente: metadata opcional fuera del camino crítico (Hick's Law) */}
            <details className="venta__cliente">
              <summary>Asignar cliente (opcional)</summary>
              <select value={selCliente} onChange={(e) => setSelCliente(e.target.value)} aria-label="Cliente">
                <option value="">Sin cliente</option>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </details>

            {/* Acción terminal: único acento sólido del modal (Von Restorff) */}
            <div className="modal__actions">
              <button type="button" className="btn btn--ghost" onClick={cerrarModal}>Cancelar</button>
              <button type="button" className="btn venta__submit" onClick={registrar}
                      disabled={guardando || carrito.length === 0}>
                {guardando ? 'Registrando…' : `Registrar · ${money(totalCarrito)}`}
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
            <p className="muted">{fechaHora(detalle.fecha)} · {detalle.vendedor}{detalle.cliente ? ` · ${detalle.cliente}` : ''}</p>
            <div className="table-wrap">
              <table>
                <thead><tr><th>SKU</th><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {detalle.items.map((it, i) => (
                    <tr key={i}><td className="mono">{it.sku}</td><td>{it.nombre}</td><td>{it.cantidad}</td><td>{money(it.precio_unitario)}</td><td>{money(it.subtotal)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            {igvPct > 0 && (
              <>
                <div className="recibo__tot"><span className="muted">Subtotal</span><span>{money(dDet.sub)}</span></div>
                <div className="recibo__tot"><span className="muted">IGV ({igvPct}%)</span><span>{money(dDet.igv)}</span></div>
              </>
            )}
            <div className="venta__total"><span>Total</span><strong>{money(detalle.total)}</strong></div>
            <div className="modal__actions">
              <button type="button" className="btn btn--ghost" onClick={() => imprimir(detalle)}><IconPrint width={16} height={16} /> Imprimir</button>
              <button type="button" className="btn" onClick={() => setDetalle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Área de impresión (oculta salvo al imprimir) */}
      <div className="print-area">
        {recibo && (
          <div className="recibo">
            <div className="recibo__head">
              {config.logo && <img src={config.logo} alt="" style={{ maxHeight: 60, marginBottom: 6 }} />}
              <div className="recibo__neg">{config.nombre || 'StockPro'}</div>
              {config.ruc && <div>RUC: {config.ruc}</div>}
              {config.direccion && <div>{config.direccion}</div>}
            </div>
            <div>Comprobante: <strong>{recibo.codigo}</strong></div>
            <div>Fecha: {fechaHora(recibo.fecha)}</div>
            <div>Atendió: {recibo.vendedor}</div>
            <div>Cliente: {recibo.cliente || 'Varios'}</div>
            <table>
              <thead><tr><th style={{ textAlign: 'left' }}>Producto</th><th>Cant</th><th>P.U.</th><th style={{ textAlign: 'right' }}>Importe</th></tr></thead>
              <tbody>
                {recibo.items.map((it, i) => (
                  <tr key={i}><td>{it.nombre}</td><td style={{ textAlign: 'center' }}>{it.cantidad}</td><td style={{ textAlign: 'right' }}>{Number(it.precio_unitario).toFixed(2)}</td><td style={{ textAlign: 'right' }}>{Number(it.subtotal).toFixed(2)}</td></tr>
                ))}
              </tbody>
            </table>
            {igvPct > 0 && (
              <>
                <div className="recibo__tot"><span>Subtotal</span><span>{money(dRec.sub)}</span></div>
                <div className="recibo__tot"><span>IGV ({igvPct}%)</span><span>{money(dRec.igv)}</span></div>
              </>
            )}
            <div className="recibo__tot recibo__tot--grande"><span>TOTAL</span><span>{money(recibo.total)}</span></div>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>¡Gracias por su compra!</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
