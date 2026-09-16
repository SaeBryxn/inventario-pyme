// Dashboard con métricas reales (HU-13) y alertas de stock bajo (HU-09).
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { dashboardService } from '../services/catalogo.js';
import { IconBox, IconAlert, IconCart, IconChart } from '../components/icons.jsx';
import { BarChart } from '../components/Chart.jsx';
import { SkeletonCards } from '../components/Skeleton.jsx';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardService.resumen()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

  return (
    <Layout>
      <h2>Dashboard</h2>
      <p className="muted">Resumen del estado de tu negocio.</p>

      {error && <p className="auth__error">{error}</p>}
      {cargando ? <SkeletonCards n={4} /> : data && (
        <>
          <div className="cards">
            <div className="card stat">
              <div className="stat__top"><span className="stat__num">{data.totalProductos}</span><span className="stat__icon"><IconBox width={18} height={18} /></span></div>
              <span className="stat__label">Productos activos</span>
            </div>
            <div className={`card stat ${data.stockBajoCount > 0 ? 'stat--alerta' : ''}`}>
              <div className="stat__top"><span className="stat__num">{data.stockBajoCount}</span><span className="stat__icon"><IconAlert width={18} height={18} /></span></div>
              <span className="stat__label">Productos con stock bajo</span>
            </div>
            <div className="card stat">
              <div className="stat__top"><span className="stat__num">{data.ventasHoyCount}</span><span className="stat__icon"><IconCart width={18} height={18} /></span></div>
              <span className="stat__label">Ventas hoy</span>
            </div>
            <div className="card stat">
              <div className="stat__top"><span className="stat__num">{money(data.valorInventario)}</span><span className="stat__icon"><IconChart width={18} height={18} /></span></div>
              <span className="stat__label">Valor del inventario</span>
            </div>
          </div>

          {/* Gráficos en Canvas */}
          <div className="charts">
            <div className="card chartcard">
              <h3>Ventas de los últimos 7 días</h3>
              <BarChart
                data={(data.ventas7dias || []).map((d) => ({ label: d.etiqueta, value: d.total }))}
                format={(v) => `${v}`}
                height={220}
              />
            </div>
            <div className="card chartcard">
              <h3>Productos más vendidos</h3>
              {(data.topProductos || []).length === 0
                ? <p className="muted" style={{ padding: '1.5rem 0' }}>Aún no hay ventas registradas.</p>
                : <BarChart
                    horizontal
                    data={(data.topProductos || []).map((p) => ({ label: p.nombre, value: p.cantidad }))}
                    format={(v) => `${v} und`}
                    height={Math.max(160, (data.topProductos || []).length * 42)}
                  />}
            </div>
          </div>

          {/* Alertas de stock bajo (HU-09) */}
          <div className="alertas">
            <h3>⚠️ Productos que necesitan reposición</h3>
            {data.listaStockBajo.length === 0 ? (
              <p className="muted">Todo en orden: ningún producto por debajo del mínimo. 🎉</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>SKU</th><th>Producto</th><th>Stock actual</th><th>Mínimo</th></tr></thead>
                  <tbody>
                    {data.listaStockBajo.map((p) => (
                      <tr key={p.id}>
                        <td className="mono">{p.sku}</td>
                        <td>{p.nombre}</td>
                        <td><strong style={{ color: 'var(--danger)' }}>{p.stock_actual}</strong></td>
                        <td className="muted">{p.stock_minimo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="muted" style={{ marginTop: '0.75rem' }}>
              Registra reposiciones en <Link to="/inventario" style={{ color: 'var(--accent)' }}>Inventario</Link>.
            </p>
          </div>
        </>
      )}
    </Layout>
  );
}
