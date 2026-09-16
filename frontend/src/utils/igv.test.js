import { describe, it, expect } from 'vitest';
import { desglosarIgv } from './igv.js';

describe('desglosarIgv', () => {
  it('separa el IGV 18% de un total de 45', () => {
    const r = desglosarIgv(45, 18);
    expect(r.total).toBe(45);
    expect(Number(r.sub.toFixed(2))).toBe(38.14);
    expect(Number(r.igv.toFixed(2))).toBe(6.86);
  });

  it('sin IGV el subtotal es el total', () => {
    const r = desglosarIgv(100, 0);
    expect(r.sub).toBe(100);
    expect(r.igv).toBe(0);
  });
});
