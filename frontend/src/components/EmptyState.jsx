// Estado vacío con ícono, texto y acción opcional.
export default function EmptyState({ icon: Icon, titulo, texto, accion }) {
  return (
    <div className="empty">
      {Icon && <div className="empty__icon"><Icon width={28} height={28} /></div>}
      <p className="empty__titulo">{titulo}</p>
      {texto && <p className="empty__texto">{texto}</p>}
      {accion}
    </div>
  );
}
