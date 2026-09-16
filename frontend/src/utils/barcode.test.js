import { describe, it, expect } from 'vitest';
import { code39Bars, sanitizar } from './barcode.js';

describe('code39', () => {
  it('sanitiza a mayúsculas y reemplaza caracteres inválidos', () => {
    expect(sanitizar('abc-01')).toBe('ABC-01');
    expect(sanitizar('a@b')).toBe('A-B');
  });

  it('genera 5 barras por carácter, enmarcando con * (inicio/fin)', () => {
    // "1" -> *1* = 3 caracteres * 5 barras = 15
    expect(code39Bars('1').bars.length).toBe(15);
    // "AB" -> *AB* = 4 caracteres * 5 = 20
    expect(code39Bars('AB').bars.length).toBe(20);
  });

  it('es determinista (mismo valor, mismo ancho)', () => {
    expect(code39Bars('ABA-001').width).toBe(code39Bars('ABA-001').width);
  });
});
