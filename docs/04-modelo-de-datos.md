# 🗄️ Modelo de datos

← Volver al [Índice](00-INDICE.md)

Diagrama entidad-relación (ERD) y esquema de la base de datos **PostgreSQL**.
El diagrama usa **Mermaid** (se ve tanto en GitHub como en Obsidian).

## Diagrama ERD

```mermaid
erDiagram
    USUARIOS ||--o{ MOVIMIENTOS : registra
    USUARIOS ||--o{ VENTAS : realiza
    CATEGORIAS ||--o{ PRODUCTOS : agrupa
    PROVEEDORES ||--o{ MOVIMIENTOS : abastece
    PRODUCTOS ||--o{ MOVIMIENTOS : tiene
    PRODUCTOS ||--o{ DETALLE_VENTA : aparece_en
    VENTAS ||--o{ DETALLE_VENTA : contiene

    USUARIOS {
        int id PK
        string nombre
        string email UK
        string password_hash
        string rol
        boolean activo
        timestamp created_at
    }
    CATEGORIAS {
        int id PK
        string nombre
        string descripcion
    }
    PROVEEDORES {
        int id PK
        string nombre
        string ruc
        string telefono
        string email
    }
    PRODUCTOS {
        int id PK
        string sku UK
        string nombre
        int categoria_id FK
        decimal precio_compra
        decimal precio_venta
        int stock_actual
        int stock_minimo
        boolean activo
    }
    MOVIMIENTOS {
        int id PK
        int producto_id FK
        int usuario_id FK
        int proveedor_id FK
        string tipo
        int cantidad
        string motivo
        timestamp fecha
    }
    VENTAS {
        int id PK
        string codigo UK
        int usuario_id FK
        decimal total
        string estado
        timestamp fecha
    }
    DETALLE_VENTA {
        int id PK
        int venta_id FK
        int producto_id FK
        int cantidad
        decimal precio_unitario
        decimal subtotal
    }
```

## Notas del modelo

- **`productos.stock_actual`** nunca se edita a mano: siempre cambia a través de un
  registro en **`movimientos`** (entrada / salida / ajuste) o de una venta. Así el
  stock siempre es auditable.
- **`movimientos.tipo`** ∈ `{ 'entrada', 'salida', 'ajuste' }`.
- **`usuarios.rol`** ∈ `{ 'admin', 'vendedor' }`.
- **`ventas.estado`** ∈ `{ 'completada', 'anulada' }`.
- Una **venta** genera automáticamente movimientos de tipo `salida` por cada producto.
- Se usa **borrado lógico** (`activo = false`) en usuarios y productos, no `DELETE`.

## Esqueleto SQL (referencia)

```sql
CREATE TABLE usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol           VARCHAR(20)  NOT NULL DEFAULT 'vendedor',
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
  activo        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE movimientos (
  id           SERIAL PRIMARY KEY,
  producto_id  INT NOT NULL REFERENCES productos(id),
  usuario_id   INT NOT NULL REFERENCES usuarios(id),
  proveedor_id INT REFERENCES proveedores(id),
  tipo         VARCHAR(10) NOT NULL,           -- entrada | salida | ajuste
  cantidad     INT NOT NULL,
  motivo       VARCHAR(200),
  fecha        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE ventas (
  id         SERIAL PRIMARY KEY,
  codigo     VARCHAR(20) UNIQUE NOT NULL,
  usuario_id INT NOT NULL REFERENCES usuarios(id),
  total      NUMERIC(10,2) NOT NULL DEFAULT 0,
  estado     VARCHAR(15) NOT NULL DEFAULT 'completada',
  fecha      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE detalle_venta (
  id             SERIAL PRIMARY KEY,
  venta_id       INT NOT NULL REFERENCES ventas(id),
  producto_id    INT NOT NULL REFERENCES productos(id),
  cantidad       INT NOT NULL,
  precio_unitario NUMERIC(10,2) NOT NULL,
  subtotal       NUMERIC(10,2) NOT NULL
);
```

---
Siguiente: [Arquitectura](05-arquitectura.md) →
