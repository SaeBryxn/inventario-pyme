// ProductCombobox — Selector de producto accesible (patrón WAI-ARIA "combobox
// with listbox popup"). Sin librerías de UI.
//
// Cognición aplicada:
//  · Miller's Law: se muestran como máximo MAX_VISIBLE resultados a la vez;
//    el resto se comunica como estado ("N más… refina la búsqueda") en lugar
//    de saturar la memoria de trabajo.
//  · Chunking: cada opción separa el nombre (dato primario) de la metadata
//    (categoría · precio · stock), tipográficamente subordinada.
//
// Accesibilidad (WAI-ARIA APG · combobox):
//  · input[role=combobox] con aria-expanded / aria-controls / aria-activedescendant.
//  · El foco NO se mueve a las opciones: se usa aria-activedescendant (el input
//    conserva el foco). Teclado: ↓/↑ iteran, Enter selecciona, Esc cierra.
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import './ProductCombobox.css';

const MAX_VISIBLE = 7; // Miller's Law: 7 ± 2 elementos en memoria de trabajo.

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function ProductCombobox({ productos = [], onSelect, resetSignal = 0 }) {
  const baseId = useId();
  const listId = `${baseId}-list`;
  const inputRef = useRef(null);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0); // índice de la opción resaltada

  // El padre incrementa `resetSignal` tras agregar al carrito → limpiamos el input.
  useEffect(() => { setQuery(''); setOpen(false); }, [resetSignal]);

  // Filtrado + recorte por Miller. `truncados` alimenta el estado accesible.
  const { visibles, total } = useMemo(() => {
    const q = norm(query);
    const todos = q
      ? productos.filter((p) => norm(p.nombre).includes(q) || norm(p.sku).includes(q))
      : productos;
    return { visibles: todos.slice(0, MAX_VISIBLE), total: todos.length };
  }, [productos, query]);
  const truncados = total - visibles.length;

  // Mantener `active` dentro de rango cuando cambian los resultados.
  useEffect(() => { setActive((i) => Math.min(i, Math.max(0, visibles.length - 1))); }, [visibles.length]);

  function abrir() { setOpen(true); }
  function cerrar() { setOpen(false); }

  function elegir(prod) {
    onSelect(prod);
    setQuery(prod.nombre);
    setOpen(false);
    inputRef.current?.focus();
  }

  function onKeyDown(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) { abrir(); return; }
        setActive((i) => Math.min(i + 1, visibles.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        if (open && visibles[active]) { e.preventDefault(); elegir(visibles[active]); }
        break;
      case 'Escape':
        if (open) { e.preventDefault(); cerrar(); } // consumido aquí: no cierra el modal
        break;
      case 'Tab':
        cerrar(); // al tabular, colapsa la lista (deja seguir el orden de foco)
        break;
      default:
        break;
    }
  }

  const activeOptionId = open && visibles[active] ? `${baseId}-opt-${active}` : undefined;

  return (
    <div className="combobox">
      <input
        ref={inputRef}
        className="combobox__input"
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={activeOptionId}
        aria-autocomplete="list"
        aria-label="Buscar producto"
        placeholder="Buscar producto por nombre o SKU…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
          onSelect(null); // invalida la selección previa: obliga a reelegir de la lista
        }}
        onFocus={abrir}
        onKeyDown={onKeyDown}
        // Cierre diferido: permite que el click en una opción se procese antes.
        onBlur={() => setTimeout(cerrar, 120)}
        autoComplete="off"
      />

      {open && (
        <ul className="combobox__list" id={listId} role="listbox" aria-label="Productos">
          {visibles.length === 0 && (
            <li className="combobox__empty" role="option" aria-selected="false">Sin coincidencias</li>
          )}

          {visibles.map((p, i) => (
            <li
              key={p.id}
              id={`${baseId}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              className={`combobox__opt ${i === active ? 'is-active' : ''}`}
              // onMouseDown (no onClick): dispara antes que el onBlur del input.
              onMouseDown={(e) => { e.preventDefault(); elegir(p); }}
              onMouseEnter={() => setActive(i)}
            >
              <span className="combobox__name">{p.nombre}</span>
              <span className="combobox__meta">
                {p.categoria ? `${p.categoria} · ` : ''}{money(p.precio_venta)} · stock {p.stock_actual}
              </span>
            </li>
          ))}

          {/* Miller's Law: el excedente se comunica, no se renderiza como ruido. */}
          {truncados > 0 && (
            <li className="combobox__more" aria-hidden="true">
              +{truncados} más — refina la búsqueda
            </li>
          )}
        </ul>
      )}

      {/* Estado en vivo para lectores de pantalla (nº de resultados). */}
      <span className="sr-only" aria-live="polite">
        {open ? `${total} producto(s) encontrados` : ''}
      </span>
    </div>
  );
}
