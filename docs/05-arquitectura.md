# 🏗️ Arquitectura

← Volver al [Índice](00-INDICE.md)

## Stack y decisiones

| Capa | Elección | Por qué |
|------|----------|---------|
| Frontend | **React + Vite** | Lo más pedido en prácticas; Vite arranca rápido. |
| Backend | **Node.js + Express** | Mismo lenguaje que el front (JS), curva mínima. |
| Base de datos | **PostgreSQL** | Relacional, gratis, muy valorado y robusto. |
| Auth | **JWT + bcrypt** | Estándar de la industria para sesiones y contraseñas. |
| Estilos | CSS / Tailwind (opcional) | A tu gusto; puedes lucir tu CSS puro. |

> 🔁 **Variante empresarial (para tu 2.º proyecto):** este mismo diseño se puede
> reconstruir con **Angular + Spring Boot (Java) + SQL Server**. La documentación
> Scrum y el modelo de datos se reutilizan casi tal cual.

## Estructura de carpetas

```
inventario-pyme/
├─ docs/                  ← este vault (documentación Scrum)
├─ backend/
│  ├─ src/
│  │  ├─ config/          conexión a BD, variables de entorno
│  │  ├─ controllers/     lógica de cada recurso
│  │  ├─ routes/          endpoints de la API
│  │  ├─ middlewares/     auth JWT, validación de rol, errores
│  │  ├─ models/          acceso a datos (queries)
│  │  └─ app.js
│  ├─ .env.example
│  └─ package.json
└─ frontend/
   ├─ src/
   │  ├─ pages/           Login, Productos, Ventas, Dashboard...
   │  ├─ components/      UI reutilizable (tabla, modal, inputs)
   │  ├─ services/        llamadas a la API (fetch/axios)
   │  ├─ context/         sesión / usuario autenticado
   │  └─ main.jsx
   └─ package.json
```

## Endpoints principales de la API (REST)

| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| POST | `/api/auth/login` | Iniciar sesión | público |
| GET/POST/PUT/PATCH | `/api/usuarios` | Gestión de usuarios | admin |
| GET/POST/PUT/DELETE | `/api/categorias` | CRUD categorías | admin |
| GET/POST/PUT/PATCH | `/api/productos` | CRUD productos + búsqueda | admin |
| GET | `/api/productos?buscar=&categoria=` | Buscar/filtrar | admin/vendedor |
| POST | `/api/movimientos` | Entrada/salida/ajuste de stock | admin |
| GET | `/api/movimientos?producto_id=` | Historial | admin |
| GET | `/api/productos/alertas` | Productos con stock bajo | admin/vendedor |
| POST | `/api/ventas` | Registrar venta | vendedor/admin |
| GET | `/api/ventas` | Historial de ventas | admin |
| GET | `/api/dashboard` | Métricas del dashboard | admin |
| GET/POST/PUT/DELETE | `/api/proveedores` | CRUD proveedores | admin |

## Convenciones

- Respuestas JSON con forma `{ ok: true, data }` o `{ ok: false, error }`.
- Toda ruta interna pasa por el middleware de **auth** y, si aplica, de **rol**.
- Nunca confiar solo en el front para permisos: **el backend siempre valida**.
- Variables sensibles en `.env` (nunca subir `.env` al repo; sí un `.env.example`).

## Flujo de despliegue

1. **Base de datos** → PostgreSQL en Render (o Supabase/Neon, capa gratuita).
2. **Backend** → Render (Web Service) apuntando a esa BD.
3. **Frontend** → Vercel, con la URL del backend en una variable de entorno.
4. Cargar **datos de demo ficticios** y credenciales `admin@demo.com / demo1234`.

---
Siguiente: [Guía Scrum](06-guia-scrum.md) →
