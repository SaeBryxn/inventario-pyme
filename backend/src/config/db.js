// Conexión a PostgreSQL mediante un pool de conexiones (pg).
// Admite dos formas de configuración:
//   1) DATABASE_URL = postgresql://user:pass@host/db   (nube: Neon, Supabase, Render)
//   2) Variables sueltas DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD (local)
// El pool es "lazy": no se conecta hasta la primera consulta, así que el
// servidor arranca aunque la base de datos aún no esté lista.
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// Si hay DATABASE_URL (típico en la nube), se usa esa; si no, las variables sueltas.
export const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      // La mayoría de proveedores en la nube exigen SSL.
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'stockpro',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
    });

// Helper para consultas: query('SELECT ...', [params])
export const query = (text, params) => pool.query(text, params);

// Comprueba la conexión (se usa en el arranque para avisar por consola).
export async function testConnection() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conectado a PostgreSQL');
    return true;
  } catch (err) {
    console.warn('⚠️  No se pudo conectar a PostgreSQL:', err.message);
    console.warn('   El servidor sigue arriba; configura tu .env y crea la BD.');
    return false;
  }
}
