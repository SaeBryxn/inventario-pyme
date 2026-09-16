// Detalle de producto: info, imagen, código de barras e historial de movimientos.
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Barcode from '../components/Barcode.jsx';
import { SkeletonTable } from '../components/Skeleton.jsx';
import { productosService, movimientosService } from '../services/catalogo.js';
import { IconBox } from '../components/icons.jsx';

const TIPO_LABEL = { entrada: 'Entrada', salida: 'Salida', ajuste: 'Ajuste' };
const fecha = (f) => new Date(f).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });
const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

export default function ProductoDetalle() {
  const { id } = useParams();
  const [prod, setProd] = useState(null);
  const [movs, setMovs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setCargando(true);
    Promise.all([productosService.obtener(id), movimientosService.listar({ producto_id: id })])
      .then(([p, m]) => { setProd(p); setMovs(m); })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [id]);

  return (
    <Layout title="Detalle de producto">
      <Link to="/productos" className="volver">← Volver a productos</Link>

      {error && <p className="auth__error">{error}</p>}
      {cargando ? <p className="muted">Cargando…</p> : prod && (
        <>
          <div className="detalle">
            <div className="card detalle__media">
              {prod.imagen
                ? <img src={prod.imagen} alt={prod.nombre} className="detalle__img" />
                : <span className="detalle__img prod-thumb--ph"><IconBox width={40} height={40} /></span>}
              <div className="detalle__barcode">
                <Barcode value={prod.sku} height={50} />
                <span className="mono">{prod.sku}</span>
              </div>
            </div>

            <div className="card detalle__info">
              <div className="detalle__head">
                <h2>{prod.nombre}</h2>
                <span className={`badge ${prod.activo ? 'badge--on' : 'badge--off'}`}>{prod.activo ? 'Activo' : 'Inactivo'}</span>
              </div>
              <p className="muted">{prod.categoria || 'Sin categoría'}</p>
              <div className="detalle__grid">
                <div><span className="detalle__lbl">Stock actual</span><strong className={prod.stock_bajo ? 'texto-alerta' : ''}>{prod.stock_actual}</strong></div>
                <div><span className="detalle__lbl">Stock mínimo</span><strong>{prod.stock_minimo}</strong></div>
                <div><span className="detalle__lbl">Precio venta</span><strong>{money(prod.precio_venta)}</strong></div>
                <div><span className="detalle__lbl">Precio compra</span><strong>{money(prod.precio_compra)}</strong></div>
              </div>
            </div>
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '.75rem' }}>Historial de movimientos</h3>
          {movs.length === 0 ? <p className="muted">Sin movimientos registrados.</p> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Fecha</th><th>Tipo</th><th>Cantidad</th><th>Motivo</th><th>Usuario</th></tr></thead>
                <tbody>
                  {movs.map((m) => (
                    <tr key={m.id}>
                      <td className="muted">{fecha(m.fecha)}</td>
                      <td><span className={`badge badge--mov-${m.tipo}`}>{TIPO_LABEL[m.tipo]}</span></td>
                      <td>{m.cantidad}</td>
                      <td className="muted">{m.motivo || '—'}</td>
                      <td className="muted">{m.usuario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
