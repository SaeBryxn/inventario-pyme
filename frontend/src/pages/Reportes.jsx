// Página de reportes (HU-14). Solo Admin. Exporta a CSV.
import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { reportesService } from '../services/catalogo.js';

// Convierte un arreglo de objetos a CSV y dispara la descarga.
function descargarCSV(nombre, filas, columnas) {
  const cabecera = columnas.map((c) => `"${c.titulo}"`).join(',');
  const cuerpo = filas.map((f) =>
    columnas.map((c) => `"${String(f[c.campo] ?? '').replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  const csv = `${cabecera}\n${cuerpo}`;
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

export default function Reportes() {
  const [vendidos, setVendidos] = useState([]);
  const [stock, setStock] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    reportesService.masVendidos().then(setVendidos).catch((e) => setError(e.message));
    reportesService.stockBajo().then(setStock).catch((e) => setError(e.message));
  }, []);

  return (
    <Layout>
      <h2>Reportes</h2>
      <p className="muted">Consulta y exporta la información clave de tu negocio.</p>
      {error && <p className="auth__error">{error}</p>}

      {/* Productos más vendidos */}
      <div className="reporte">
        <div className="toolbar">
          <h3>Productos más vendidos</h3>
          <button
            className="btn btn--sm"
            disabled={vendidos.length === 0}
            onClick={() => descargarCSV('mas-vendidos.csv', vendidos, [
              { titulo: 'SKU', campo: 'sku' },
              { titulo: 'Producto', campo: 'nombre' },
              { titulo: 'Cantidad vendida', campo: 'cantidad_vendida' },
              { titulo: 'Total vendido', campo: 'total_vendido' },
            ])}
          >⬇ Descargar CSV</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>SKU</th><th>Producto</th><th>Cantidad vendida</th><th>Total vendido</th></tr></thead>
            <tbody>
              {vendidos.map((p, i) => (
                <tr key={i}>
                  <td className="mono">{p.sku}</td>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad_vendida}</td>
                  <td>{money(p.total_vendido)}</td>
                </tr>
              ))}
              {vendidos.length === 0 && <tr><td colSpan="4" className="muted">Aún no hay ventas registradas.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Productos con stock bajo */}
      <div className="reporte">
        <div className="toolbar">
          <h3>Productos con stock bajo</h3>
          <button
            className="btn btn--sm"
            disabled={stock.length === 0}
            onClick={() => descargarCSV('stock-bajo.csv', stock, [
              { titulo: 'SKU', campo: 'sku' },
              { titulo: 'Producto', campo: 'nombre' },
              { titulo: 'Stock actual', campo: 'stock_actual' },
              { titulo: 'Stock mínimo', campo: 'stock_minimo' },
            ])}
          >⬇ Descargar CSV</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>SKU</th><th>Producto</th><th>Stock actual</th><th>Mínimo</th></tr></thead>
            <tbody>
              {stock.map((p, i) => (
                <tr key={i}>
                  <td className="mono">{p.sku}</td>
                  <td>{p.nombre}</td>
                  <td><strong style={{ color: 'var(--danger)' }}>{p.stock_actual}</strong></td>
                  <td className="muted">{p.stock_minimo}</td>
                </tr>
              ))}
              {stock.length === 0 && <tr><td colSpan="4" className="muted">Ningún producto en stock bajo. 🎉</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
