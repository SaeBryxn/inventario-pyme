// Ajustes del negocio (solo Admin): nombre, RUC, dirección, moneda, IGV y logo.
import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { configService } from '../services/catalogo.js';
import { resizeImage } from '../utils/image.js';
import { useToast } from '../context/ToastContext.jsx';
import { IconCamera, IconSettings } from '../components/icons.jsx';

export default function Ajustes() {
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { configService.get().then(setForm).catch((e) => toast.error(e.message)); }, []); // eslint-disable-line

  async function subirLogo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const logo = await resizeImage(file, 300);
      setForm((f) => ({ ...f, logo }));
    } catch (err) { toast.error(err.message); }
  }

  async function guardar(e) {
    e.preventDefault(); setSaving(true);
    try {
      const data = await configService.actualizar({
        nombre: form.nombre, ruc: form.ruc, direccion: form.direccion,
        moneda: form.moneda, igv_porcentaje: Number(form.igv_porcentaje) || 0, logo: form.logo,
      });
      setForm(data);
      toast.ok('Ajustes guardados');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  }

  if (!form) return <Layout title="Ajustes"><p className="muted">Cargando…</p></Layout>;

  return (
    <Layout title="Ajustes">
      <h2>Ajustes del negocio</h2>
      <p className="muted">Estos datos aparecen en los comprobantes y en el cálculo de IGV.</p>

      <form className="card perfil__section" style={{ maxWidth: 560, marginTop: '1.5rem' }} onSubmit={guardar}>
        <div className="prod-imgfield">
          {form.logo
            ? <img className="prod-imgfield__preview" src={form.logo} alt="Logo" />
            : <span className="prod-imgfield__preview prod-thumb--ph"><IconSettings width={26} height={26} /></span>}
          <label className="btn btn--ghost btn--sm">
            <IconCamera width={16} height={16} /> Subir logo
            <input type="file" accept="image/*" onChange={subirLogo} hidden />
          </label>
        </div>

        <label>Nombre del negocio
          <input value={form.nombre || ''} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
        </label>
        <div className="modal__row">
          <label>RUC
            <input value={form.ruc || ''} onChange={(e) => setForm({ ...form, ruc: e.target.value })} maxLength="11" />
          </label>
          <label>Moneda
            <input value={form.moneda || ''} onChange={(e) => setForm({ ...form, moneda: e.target.value })} maxLength="8" />
          </label>
        </div>
        <label>Dirección
          <input value={form.direccion || ''} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
        </label>
        <label>IGV (%)
          <input type="number" step="0.01" min="0" max="100" value={form.igv_porcentaje ?? ''} onChange={(e) => setForm({ ...form, igv_porcentaje: e.target.value })} />
        </label>
        <div><button className="btn" disabled={saving}>{saving ? 'Guardando…' : 'Guardar ajustes'}</button></div>
      </form>
    </Layout>
  );
}
