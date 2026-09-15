// Crea las tablas ejecutando schema.sql contra la BD configurada en .env.
// Útil cuando NO tienes psql instalado (p.ej. usando Postgres en la nube).
// Uso:  npm run db:init
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { pool } from '../src/config/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function init() {
  console.log('🗄️  Creando tablas desde schema.sql...');
  const sql = await readFile(join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('✅ Tablas creadas.');
  await pool.end();
}

init().catch((err) => {
  console.error('❌ Error al crear las tablas:', err.message);
  process.exit(1);
});
