// useDialog — Accesibilidad de modales (WCAG 2.1: 2.1.2, 2.4.3, 4.1.2).
// Atrapa el foco dentro del diálogo, lo devuelve al abrir y cierra con Escape.
// Reutilizable en cualquier modal del sistema.
import { useEffect } from 'react';

const SELECTOR_FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useDialog(ref, { abierto, onClose }) {
  useEffect(() => {
    if (!abierto || !ref.current) return;
    const nodo = ref.current;

    // 2.4.3 — Guardamos quién abrió el diálogo para devolverle el foco al cerrar.
    const origen = document.activeElement;

    // 2.4.3 — El foco entra al diálogo al abrir.
    const primerFocusable = nodo.querySelector(SELECTOR_FOCUSABLE);
    primerFocusable?.focus();

    function onKeyDown(e) {
      // Escape cierra — salvo que un hijo (p. ej. el combobox) ya lo consumió.
      if (e.key === 'Escape' && !e.defaultPrevented) {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      // 2.1.2 — Trap circular. Recalculamos en cada Tab porque el DOM
      // del carrito cambia (se agregan/quitan filas).
      const focusables = Array.from(nodo.querySelectorAll(SELECTOR_FOCUSABLE))
        .filter((el) => el.offsetParent !== null); // visibles
      if (focusables.length === 0) return;
      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }

    nodo.addEventListener('keydown', onKeyDown);
    return () => {
      nodo.removeEventListener('keydown', onKeyDown);
      // 2.4.3 — Devolvemos el foco al elemento que abrió el diálogo.
      if (origen && typeof origen.focus === 'function') origen.focus();
    };
  }, [abierto, onClose, ref]);
}
