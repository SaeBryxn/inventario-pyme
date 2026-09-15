// Dashboard (stub del Sprint 0). Las métricas reales llegan en el Sprint 4 (HU-13).
import Layout from '../components/Layout.jsx';

export default function Dashboard() {
  return (
    <Layout>
      <h2>Dashboard</h2>
      <p className="muted">
        Esqueleto listo ✅ — la sesión y las rutas protegidas funcionan.
        Aquí irán las métricas del negocio (Sprint 4).
      </p>

      <div className="cards">
        <div className="card stat"><span className="stat__num">—</span><span className="stat__label">Productos</span></div>
        <div className="card stat"><span className="stat__num">—</span><span className="stat__label">Stock bajo</span></div>
        <div className="card stat"><span className="stat__num">—</span><span className="stat__label">Ventas hoy</span></div>
        <div className="card stat"><span className="stat__num">—</span><span className="stat__label">Valor inventario</span></div>
      </div>
    </Layout>
  );
}
