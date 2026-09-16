import { describe, it, expect } from 'vitest';
import { desglosarIgv, calcularTotal, redondear } from './dinero.js';

describe('dinero', () => {
  it('redondea a 2 decimales', () => {
    expect(redondear(38.1355)).toBe(38.14);
  });

  it('desglosa el IGV 18% de un total de 45', () => {
    const r = desglosarIgv(45, 18);
    expect(r.total).toBe(45);
    expect(r.subtotal).toBe(38.14);
    expect(r.igv).toBe(6.86);
    expect(r.subtotal + r.igv).toBeCloseTo(45, 2);
  });

  it('sin IGV el subtotal es igual al total', () => {
    expect(desglosarIgv(100, 0)).toEqual({ subtotal: 100, igv: 0, total: 100 });
  });

  it('calcula el total de un carrito', () => {
    const items = [{ precio: 10, cantidad: 2 }, { precio: 5.5, cantidad: 3 }];
    expect(calcularTotal(items)).toBe(36.5);
  });

  it('un carrito vacío suma 0', () => {
    expect(calcularTotal([])).toBe(0);
  });
});
