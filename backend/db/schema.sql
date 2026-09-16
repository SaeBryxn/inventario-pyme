-- Esquema de la base de datos StockPro (PostgreSQL)
-- Ejecuta este archivo una vez para crear las tablas:
--   psql -U postgres -d stockpro -f db/schema.sql

DROP TABLE IF EXISTS detalle_venta, ventas, movimientos, productos, proveedores, categorias, usuarios CASCADE;

CREATE TABLE usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol           VARCHAR(20)  NOT NULL DEFAULT 'vendedor',  -- admin | vendedor
  avatar        TEXT,                                       -- imagen en base64 (data URL)
  activo        BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE categorias (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(80) NOT NULL,
  descripcion TEXT
);

CREATE TABLE proveedores (
  id       SERIAL PRIMARY KEY,
  nombre   VARCHAR(120) NOT NULL,
  ruc      VARCHAR(11),
  telefono VARCHAR(20),
  email    VARCHAR(120)
);

CREATE TABLE productos (
  id            SERIAL PRIMARY KEY,
  sku           VARCHAR(40) UNIQUE NOT NULL,
  nombre        VARCHAR(150) NOT NULL,
  categoria_id  INT REFERENCES categorias(id),
  precio_compra NUMERIC(10,2) NOT NULL DEFAULT 0,
  precio_venta  NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock_actual  INT NOT NULL DEFAULT 0,
  stock_minimo  INT NOT NULL DEFAULT 0,
  imagen        TEXT,                          -- imagen en base64 (data URL)
  activo        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE movimientos (
  id           SERIAL PRIMARY KEY,
  producto_id  INT NOT NULL REFERENCES productos(id),
  usuario_id   INT NOT NULL REFERENCES usuarios(id),
  proveedor_id INT REFERENCES proveedores(id),
  tipo         VARCHAR(10) NOT NULL,   -- entrada | salida | ajuste
  cantidad     INT NOT NULL,
  motivo       VARCHAR(200),
  fecha        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE ventas (
  id         SERIAL PRIMARY KEY,
  codigo     VARCHAR(20) UNIQUE NOT NULL,
  usuario_id INT NOT NULL REFERENCES usuarios(id),
  total      NUMERIC(10,2) NOT NULL DEFAULT 0,
  estado     VARCHAR(15) NOT NULL DEFAULT 'completada',  -- completada | anulada
  fecha      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE detalle_venta (
  id              SERIAL PRIMARY KEY,
  venta_id        INT NOT NULL REFERENCES ventas(id),
  producto_id     INT NOT NULL REFERENCES productos(id),
  cantidad        INT NOT NULL,
  precio_unitario NUMERIC(10,2) NOT NULL,
  subtotal        NUMERIC(10,2) NOT NULL
);
