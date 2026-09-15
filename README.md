# 📦 StockPro — Sistema de Gestión de Inventario para PYMEs

> Sistema web **fullstack** para que pequeñas y medianas empresas controlen su
> inventario, ventas y stock en tiempo real — reemplazando el cuaderno y el Excel.

![estado](https://img.shields.io/badge/estado-en%20desarrollo-a78bfa)
![licencia](https://img.shields.io/badge/licencia-MIT-blue)
![metodología](https://img.shields.io/badge/metodolog%C3%ADa-Scrum-success)

<!-- Cuando despliegues, reemplaza estos enlaces -->
🔗 **Demo en vivo:** _(pendiente de deploy)_
🔑 **Credenciales demo:** `admin@demo.com` / `demo1234` _(datos ficticios)_

---

## ✨ Características

- 🔐 Autenticación con **JWT** y control de acceso por **roles** (Administrador / Vendedor)
- 📦 **CRUD** de productos y categorías con búsqueda y filtros
- 🔄 Control de **stock** con movimientos de entrada, salida y ajuste
- 🔔 **Alertas de stock bajo** automáticas
- 🧾 Registro de **ventas** que descuenta stock en tiempo real
- 📊 **Dashboard** con métricas y reportes exportables
- 🏢 Gestión de **proveedores**

## 🛠️ Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React + Vite, React Router |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| Autenticación | JWT + bcrypt |
| Despliegue | Vercel (front) · Render (API + BD) |

## 📸 Capturas

_(pendiente — usar capturas con datos FICTICIOS)_

## 🧭 Metodología

Proyecto gestionado con **Scrum**: Product Backlog, Historias de Usuario,
Sprints de 2 semanas y tablero Kanban en GitHub Projects.
👉 Toda la documentación está en [`/docs`](docs/00-INDICE.md).

## ⚙️ Cómo ejecutar (local)

```bash
# Backend
cd backend
npm install
cp .env.example .env      # configura tu conexión a PostgreSQL
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

## 🗺️ Roadmap

- [ ] Sprint 0 — Setup, backlog y diseño
- [ ] Sprint 1 — Autenticación y usuarios
- [ ] Sprint 2 — Productos, categorías y proveedores
- [ ] Sprint 3 — Control de inventario y alertas
- [ ] Sprint 4 — Ventas, dashboard, reportes y despliegue

## 👤 Autor

**Bryan Espejo** — Desarrollador Web
[Portafolio](https://bryanespejo.dev) · [LinkedIn](#) · [GitHub](#)

## 📄 Licencia

MIT
