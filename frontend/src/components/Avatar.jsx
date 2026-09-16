// Avatar: muestra la foto del usuario o sus iniciales sobre un fondo de acento.
export default function Avatar({ nombre = '', avatar, size = 36 }) {
  const iniciales = nombre.split(' ').filter(Boolean).slice(0, 2).map((s) => s[0]).join('').toUpperCase();
  const style = { width: size, height: size, fontSize: size * 0.4 };
  if (avatar) {
    return <img className="avatar" src={avatar} alt={`Avatar de ${nombre}`} style={style} />;
  }
  return <span className="avatar avatar--iniciales" style={style} aria-hidden="true">{iniciales || '?'}</span>;
}
