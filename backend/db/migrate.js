// Migración incremental: agrega columnas nuevas sin perder datos.
// Uso:  npm run migrate
import { pool } from '../src/config/db.js';

async function run() {
  console.log('🛠️  Aplicando migración...');
  await pool.query('ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS avatar TEXT');
  await pool.query('ALTER TABLE productos ADD COLUMN IF NOT EXISTS imagen TEXT');
  console.log('✅ Migración aplicada (avatar en usuarios, imagen en productos).');
  await pool.end();
}

run().catch((err) => {
  console.error('❌ Error en la migración:', err.message);
  process.exit(1);
});
