# 🏃 Plan de Sprints

← Volver al [Índice](00-INDICE.md)

Sprints de **2 semanas**. Cada sprint tiene un **objetivo claro** (sprint goal) y
un conjunto de [Historias de Usuario](02-product-backlog.md). Al final de cada uno
debe haber algo **funcionando y demostrable** (una captura o GIF para el portafolio).

---

## 🔧 Sprint 0 — Setup y diseño (semana 1)

**Objetivo:** dejar el terreno listo para codear con método. No hay HU, son tareas.

- [ ] Crear el repositorio en GitHub (con este `/docs` y el README).
- [ ] Crear el tablero en **GitHub Projects** (columnas: Backlog · To Do · In Progress · Done).
- [ ] Cargar todas las HU como *issues* (usa la [plantilla de HU](../.github/ISSUE_TEMPLATE/historia-de-usuario.md)).
- [ ] Crear los **Milestones** (uno por sprint) y asignar las HU.
- [ ] Definir el [Modelo de datos](04-modelo-de-datos.md) y crear la base de datos.
- [ ] Wireframes rápidos de 4-5 pantallas (login, productos, venta, dashboard).
- [ ] Esqueleto del proyecto: carpetas `backend/` y `frontend/`, conexión a BD, "hola mundo" de la API y del front. Ver [Arquitectura](05-arquitectura.md).

**Entregable:** repo inicializado, tablero lleno y proyecto que arranca en local.

---

## 🔐 Sprint 1 — Autenticación y usuarios

**Objetivo:** que un usuario pueda iniciar sesión y el admin gestione usuarios con roles.

| HU | Descripción | Pts |
|----|-------------|-----|
| HU-01 | Iniciar sesión | 3 |
| HU-02 | Gestionar usuarios | 5 |
| HU-03 | Control de acceso por rol | 3 |

**Entregable:** login funcional con JWT, panel de usuarios y rutas protegidas.
**Demo sugerida:** GIF logueándote como Admin y como Vendedor mostrando vistas distintas.

---

## 📦 Sprint 2 — Productos, categorías y proveedores

**Objetivo:** tener el catálogo completo administrable.

| HU | Descripción | Pts |
|----|-------------|-----|
| HU-04 | Gestionar categorías | 3 |
| HU-05 | Gestionar productos | 5 |
| HU-06 | Buscar y filtrar productos | 3 |
| HU-15 | Gestionar proveedores | 3 |

**Entregable:** CRUD de productos/categorías/proveedores con búsqueda y filtros.

---

## 🔄 Sprint 3 — Control de inventario

**Objetivo:** el stock se mueve y avisa.

| HU | Descripción | Pts |
|----|-------------|-----|
| HU-07 | Registrar entrada de stock | 5 |
| HU-08 | Registrar salida/ajuste | 3 |
| HU-09 | Alertas de stock bajo | 3 |
| HU-10 | Historial de movimientos | 3 |

**Entregable:** movimientos de inventario funcionando + alertas de stock bajo.

---

## 🧾 Sprint 4 — Ventas, dashboard y despliegue

**Objetivo:** cerrar el ciclo del negocio y publicar la app.

| HU | Descripción | Pts |
|----|-------------|-----|
| HU-11 | Registrar venta | 8 |
| HU-12 | Historial de ventas | 3 |
| HU-13 | Dashboard con métricas | 5 |
| HU-14 | Reportes exportables | 3 |
| — | **Deploy** (Vercel + Render) y datos de demo | — |

**Entregable:** MVP completo, desplegado, con link y credenciales demo para el portafolio.

---

## 📅 Cadencia de ceremonias (adaptada a 1 dev)

| Ceremonia | Cuándo | Qué haces |
|-----------|--------|-----------|
| Sprint Planning | Inicio del sprint | Eliges las HU del sprint y las divides en tareas. |
| Daily (versión solo) | Cada día | 1 commit + mueves la tarjeta en el tablero. |
| Sprint Review | Fin del sprint | Grabas un GIF/demo de lo logrado. |
| Retrospectiva | Fin del sprint | Anotas: qué salió bien, qué mejorar (2-3 líneas). |

> Guarda las retros en `docs/retros/sprint-N.md`. Que un reclutador vea que
> reflexionas sobre tu proceso vale muchísimo.

---
Siguiente: [Modelo de datos](04-modelo-de-datos.md) →
