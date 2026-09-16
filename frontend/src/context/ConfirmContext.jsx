// Modal de confirmación reutilizable. Uso:
//   const confirmar = useConfirm();
//   if (await confirmar({ titulo, mensaje, peligro: true })) { ... }
import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [estado, setEstado] = useState(null); // { titulo, mensaje, confirmar, cancelar, peligro }
  const resolver = useRef(null);

  const confirmar = useCallback((opts) => {
    return new Promise((resolve) => {
      resolver.current = resolve;
      setEstado({
        titulo: opts.titulo || '¿Estás seguro?',
        mensaje: opts.mensaje || '',
        confirmar: opts.confirmar || 'Confirmar',
        cancelar: opts.cancelar || 'Cancelar',
        peligro: !!opts.peligro,
      });
    });
  }, []);

  function responder(valor) {
    resolver.current?.(valor);
    setEstado(null);
  }

  return (
    <ConfirmContext.Provider value={confirmar}>
      {children}
      {estado && (
        <div className="modal-overlay" onClick={() => responder(false)}>
          <div className="card modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <h3>{estado.titulo}</h3>
            {estado.mensaje && <p className="muted">{estado.mensaje}</p>}
            <div className="modal__actions">
              <button className="btn btn--ghost" onClick={() => responder(false)}>{estado.cancelar}</button>
              <button className={`btn ${estado.peligro ? 'btn--danger' : ''}`} onClick={() => responder(true)}>
                {estado.confirmar}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}
