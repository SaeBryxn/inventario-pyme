// Codificación Code 39 (pura, sin DOM): devuelve las barras a dibujar.
const C39 = {
  '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn', '4': 'nnnwwnnnw',
  '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw', '8': 'wnnwnnwnn', '9': 'nnwwnnwnn',
  'A': 'wnnnnwnnw', 'B': 'nnwnnwnnw', 'C': 'wnwnnwnnn', 'D': 'nnnnwwnnw', 'E': 'wnnnwwnnn',
  'F': 'nnwnwwnnn', 'G': 'nnnnnwwnw', 'H': 'wnnnnwwnn', 'I': 'nnwnnwwnn', 'J': 'nnnnwwwnn',
  'K': 'wnnnnnnww', 'L': 'nnwnnnnww', 'M': 'wnwnnnnwn', 'N': 'nnnnwnnww', 'O': 'wnnnwnnwn',
  'P': 'nnwnwnnwn', 'Q': 'nnnnnnwww', 'R': 'wnnnnnwwn', 'S': 'nnwnnnwwn', 'T': 'nnnnwnwwn',
  'U': 'wwnnnnnnw', 'V': 'nwwnnnnnw', 'W': 'wwwnnnnnn', 'X': 'nwnnwnnnw', 'Y': 'wwnnwnnnn',
  'Z': 'nwwnwnnnn', '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', '*': 'nwnnwnwnn',
};

export function sanitizar(value) {
  return String(value).toUpperCase().replace(/[^0-9A-Z\-. ]/g, '-');
}

// Devuelve { bars: [{x, w}], width } para un valor (enmarcado con '*').
export function code39Bars(value, narrow = 2) {
  const texto = sanitizar(value);
  const chars = `*${texto}*`.split('');
  const wide = narrow * 3;
  let x = 0;
  const bars = [];
  chars.forEach((ch) => {
    const patron = C39[ch] || C39['-'];
    for (let i = 0; i < 9; i++) {
      const w = patron[i] === 'w' ? wide : narrow;
      if (i % 2 === 0) bars.push({ x, w }); // índices pares = barra
      x += w;
    }
    x += narrow; // espacio entre caracteres
  });
  return { bars, width: x };
}
