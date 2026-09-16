// Migración incremental: agrega columnas y tablas nuevas sin perder datos.
// Uso:  npm run migrate   (es idempotente, se puede correr varias veces)
import { pool } from '../src/config/db.js';

async function run() {
  console.log('🛠️  Aplicando migración...');

  // Fase rediseño: imágenes
  await pool.query('ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS avatar TEXT');
  await pool.query('ALTER TABLE productos ADD COLUMN IF NOT EXISTS imagen TEXT');

  // Fase 2: clientes
  await pool.query(`CREATE TABLE IF NOT EXISTS clientes (
    id        SERIAL PRIMARY KEY,
    nombre    VARCHAR(120) NOT NULL,
    documento VARCHAR(20),
    telefono  VARCHAR(20),
    email     VARCHAR(120)
  )`);
  await pool.query('ALTER TABLE ventas ADD COLUMN IF NOT EXISTS cliente_id INT REFERENCES clientes(id)');

  // Fase 2: configuración del negocio (una sola fila, id = 1)
  await pool.query(`CREATE TABLE IF NOT EXISTS configuracion (
    id            INT PRIMARY KEY DEFAULT 1,
    nombre        VARCHAR(120) NOT NULL DEFAULT 'Mi Negocio',
    ruc           VARCHAR(11),
    direccion     VARCHAR(200),
    moneda        VARCHAR(8) NOT NULL DEFAULT 'S/',
    igv_porcentaje NUMERIC(5,2) NOT NULL DEFAULT 18,
    logo          TEXT,
    CONSTRAINT una_fila CHECK (id = 1)
  )`);
  await pool.query(`INSERT INTO configuracion (id, nombre) VALUES (1, 'StockPro Demo')
                    ON CONFLICT (id) DO NOTHING`);

  // Cliente demo
  await pool.query(`INSERT INTO clientes (nombre, documento, telefono)
                    SELECT 'Cliente Varios', '00000000', '-'
                    WHERE NOT EXISTS (SELECT 1 FROM clientes)`);

  // Fase 3: auditoría (log de actividad)
  await pool.query(`CREATE TABLE IF NOT EXISTS auditoria (
    id             SERIAL PRIMARY KEY,
    usuario_id     INT,
    usuario_nombre VARCHAR(120),
    accion         VARCHAR(20),
    entidad        VARCHAR(40),
    ruta           VARCHAR(200),
    fecha          TIMESTAMP NOT NULL DEFAULT NOW()
  )`);

  console.log('✅ Migración aplicada (clientes, configuracion, cliente_id, auditoria).');
  await pool.end();
}

run().catch((err) => {
  console.error('❌ Error en la migración:', err.message);
  process.exit(1);
});
