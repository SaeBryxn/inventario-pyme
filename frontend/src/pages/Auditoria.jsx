// Log de auditoría (solo Admin): quién hizo qué y cuándo.
import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { SkeletonTable } from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { auditoriaService } from '../services/catalogo.js';
import { useToast } from '../context/ToastContext.jsx';
import { IconChart } from '../components/icons.jsx';

const fecha = (f) => new Date(f).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'medium' });
const ACCION_BADGE = { crear: 'badge--mov-entrada', editar: 'badge--mov-ajuste', eliminar: 'badge--mov-salida' };

export default function Auditoria() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    auditoriaService.listar()
      .then(setItems)
      .catch((e) => toast.error(e.message))
      .finally(() => setCargando(false));
  }, []); // eslint-disable-line

  return (
    <Layout title="Auditoría">
      <h2>Auditoría</h2>
      <p className="muted">Registro de actividad: quién creó, editó o eliminó datos.</p>

      {cargando ? <SkeletonTable rows={6} cols={4} />
        : items.length === 0 ? (
          <EmptyState icon={IconChart} titulo="Sin actividad registrada"
            texto="Aquí aparecerán las acciones que modifican datos en el sistema." />
        ) : (
          <div className="table-wrap" style={{ marginTop: '1rem' }}>
            <table>
              <thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Módulo</th><th>Ruta</th></tr></thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id}>
                    <td className="muted">{fecha(a.fecha)}</td>
                    <td>{a.usuario_nombre}</td>
                    <td><span className={`badge ${ACCION_BADGE[a.accion] || 'badge--off'}`}>{a.accion}</span></td>
                    <td>{a.entidad}</td>
                    <td className="mono">{a.ruta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </Layout>
  );
}
