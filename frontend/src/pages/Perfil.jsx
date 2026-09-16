// Página de Perfil completa: avatar, datos personales y cambio de contraseña.
import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import Avatar from '../components/Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { perfilService } from '../services/catalogo.js';
import { resizeImage } from '../utils/image.js';
import { IconCamera } from '../components/icons.jsx';

export default function Perfil() {
  const { usuario, refreshPerfil } = useAuth();
  const [perfil, setPerfil] = useState(null);

  // Datos personales
  const [datos, setDatos] = useState({ nombre: '', email: '' });
  const [msgDatos, setMsgDatos] = useState({ ok: '', err: '' });
  const [savingDatos, setSavingDatos] = useState(false);

  // Contraseña
  const [pass, setPass] = useState({ actual: '', nueva: '', confirmar: '' });
  const [msgPass, setMsgPass] = useState({ ok: '', err: '' });
  const [savingPass, setSavingPass] = useState(false);

  const [msgAvatar, setMsgAvatar] = useState('');

  useEffect(() => {
    perfilService.get().then((p) => {
      setPerfil(p);
      setDatos({ nombre: p.nombre, email: p.email });
    }).catch(() => {});
  }, []);

  async function guardarDatos(e) {
    e.preventDefault();
    setMsgDatos({ ok: '', err: '' }); setSavingDatos(true);
    try {
      const p = await perfilService.actualizar({ nombre: datos.nombre, email: datos.email });
      setPerfil(p); await refreshPerfil();
      setMsgDatos({ ok: 'Datos actualizados ✓', err: '' });
    } catch (err) { setMsgDatos({ ok: '', err: err.message }); }
    finally { setSavingDatos(false); }
  }

  async function cambiarAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMsgAvatar('');
    try {
      const dataUrl = await resizeImage(file, 300);
      const p = await perfilService.actualizar({ avatar: dataUrl });
      setPerfil(p); await refreshPerfil();
      setMsgAvatar('Foto actualizada ✓');
    } catch (err) { setMsgAvatar(err.message); }
  }

  async function guardarPass(e) {
    e.preventDefault();
    setMsgPass({ ok: '', err: '' });
    if (pass.nueva !== pass.confirmar) { setMsgPass({ ok: '', err: 'Las contraseñas nuevas no coinciden' }); return; }
    setSavingPass(true);
    try {
      await perfilService.cambiarPassword({ actual: pass.actual, nueva: pass.nueva });
      setPass({ actual: '', nueva: '', confirmar: '' });
      setMsgPass({ ok: 'Contraseña actualizada ✓', err: '' });
    } catch (err) { setMsgPass({ ok: '', err: err.message }); }
    finally { setSavingPass(false); }
  }

  const fecha = perfil?.created_at ? new Date(perfil.created_at).toLocaleDateString('es-PE', { dateStyle: 'long' }) : '—';

  return (
    <Layout title="Mi perfil">
      <h2>Mi perfil</h2>
      <p className="muted">Administra tu información y seguridad.</p>

      <div className="perfil">
        {/* Tarjeta de avatar */}
        <div className="card perfil__card">
          <div className="perfil__avatarwrap">
            <Avatar nombre={perfil?.nombre || usuario?.nombre} avatar={perfil?.avatar} size={120} />
            <label className="perfil__cam" title="Cambiar foto">
              <IconCamera width={18} height={18} />
              <input type="file" accept="image/*" onChange={cambiarAvatar} />
            </label>
          </div>
          <div>
            <div className="perfil__nombre">{perfil?.nombre || usuario?.nombre}</div>
            <div className="perfil__mail">{perfil?.email}</div>
          </div>
          <span className="badge badge--rol">{perfil?.rol || usuario?.rol}</span>
          {msgAvatar && <p className="auth__ok">{msgAvatar}</p>}
          <div className="perfil__meta"><span>Miembro desde {fecha}</span></div>
        </div>

        {/* Formularios */}
        <div className="perfil__forms">
          <form className="card perfil__section" onSubmit={guardarDatos}>
            <h3>Datos personales</h3>
            <label>Nombre
              <input value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} required />
            </label>
            <label>Email
              <input type="email" value={datos.email} onChange={(e) => setDatos({ ...datos, email: e.target.value })} required />
            </label>
            {msgDatos.err && <p className="auth__error">{msgDatos.err}</p>}
            {msgDatos.ok && <p className="auth__ok">{msgDatos.ok}</p>}
            <div><button className="btn" disabled={savingDatos}>{savingDatos ? 'Guardando…' : 'Guardar cambios'}</button></div>
          </form>

          <form className="card perfil__section" onSubmit={guardarPass}>
            <h3>Cambiar contraseña</h3>
            <label>Contraseña actual
              <input type="password" value={pass.actual} onChange={(e) => setPass({ ...pass, actual: e.target.value })} required />
            </label>
            <div className="modal__row">
              <label>Nueva contraseña
                <input type="password" value={pass.nueva} onChange={(e) => setPass({ ...pass, nueva: e.target.value })} required minLength="6" />
              </label>
              <label>Confirmar
                <input type="password" value={pass.confirmar} onChange={(e) => setPass({ ...pass, confirmar: e.target.value })} required minLength="6" />
              </label>
            </div>
            {msgPass.err && <p className="auth__error">{msgPass.err}</p>}
            {msgPass.ok && <p className="auth__ok">{msgPass.ok}</p>}
            <div><button className="btn" disabled={savingPass}>{savingPass ? 'Guardando…' : 'Cambiar contraseña'}</button></div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
