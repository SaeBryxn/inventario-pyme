// Carga datos FICTICIOS de demostración en la base de datos.
// Uso:  npm run seed   (requiere haber ejecutado schema.sql antes)
//
// Crea 2 usuarios demo, categorías y algunos productos con stock,
// para poder probar el sistema y sacar capturas sin datos reales.
import bcrypt from 'bcryptjs';
import { pool, query } from '../src/config/db.js';

async function seed() {
  console.log('🌱 Insertando datos de demostración...');

  // --- Usuarios (contraseñas cifradas con bcrypt) ---
  const adminHash = await bcrypt.hash('demo1234', 10);
  const vendedorHash = await bcrypt.hash('demo1234', 10);

  await query(
    `INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
      ('Admin Demo', 'admin@demo.com', $1, 'admin'),
      ('Vendedor Demo', 'vendedor@demo.com', $2, 'vendedor')
     ON CONFLICT (email) DO NOTHING`,
    [adminHash, vendedorHash]
  );

  // --- Categorías ---
  await query(
    `INSERT INTO categorias (nombre, descripcion) VALUES
      ('Abarrotes', 'Productos de consumo diario'),
      ('Bebidas', 'Gaseosas, aguas y jugos'),
      ('Limpieza', 'Artículos de aseo y limpieza')`
  );

  // --- Productos (con stock; algunos por debajo del mínimo para ver alertas) ---
  await query(
    `INSERT INTO productos (sku, nombre, categoria_id, precio_compra, precio_venta, stock_actual, stock_minimo) VALUES
      ('ABA-001', 'Arroz Costeño 5kg', 1, 18.00, 22.50, 40, 10),
      ('ABA-002', 'Aceite Primor 1L',  1,  8.50, 11.90,  6, 12),
      ('BEB-001', 'Inca Kola 1.5L',    2,  4.20,  6.50, 30,  8),
      ('BEB-002', 'Agua San Luis 625ml',2, 0.90,  1.50,  4, 15),
      ('LIM-001', 'Detergente Bolívar 780g', 3, 6.00, 8.90, 20, 5)`
  );

  console.log('✅ Datos de demo insertados.');
  console.log('   Admin:    admin@demo.com / demo1234');
  console.log('   Vendedor: vendedor@demo.com / demo1234');
  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Error al sembrar datos:', err.message);
  process.exit(1);
});
