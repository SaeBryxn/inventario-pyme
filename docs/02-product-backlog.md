# 📋 Product Backlog

← Volver al [Índice](00-INDICE.md)

Todas las **Historias de Usuario (HU)** del proyecto, agrupadas por épica y
priorizadas. Cada HU se convierte en un *issue* en GitHub Projects.

**Formato:** _Como [rol], quiero [acción], para [beneficio]._
**Prioridad:** 🔴 Alta · 🟡 Media · 🟢 Baja
**Estimación:** puntos de historia (1, 2, 3, 5, 8 — escala relativa de esfuerzo).

---

## Épica 1 — Autenticación y usuarios

### HU-01 · Iniciar sesión 🔴 · 3 pts
_Como usuario, quiero iniciar sesión con correo y contraseña, para acceder de forma segura al sistema._
**Criterios de aceptación:**
- Con credenciales correctas, entro y me redirige según mi rol.
- Con credenciales incorrectas, veo un mensaje de error claro.
- La contraseña viaja y se guarda cifrada (bcrypt); la sesión usa un token (JWT).
- Si no tengo sesión, no puedo entrar a páginas internas.

### HU-02 · Gestionar usuarios 🔴 · 5 pts
_Como administrador, quiero crear, editar y desactivar usuarios, para controlar quién accede al sistema._
**Criterios de aceptación:**
- Puedo listar, crear, editar y desactivar usuarios.
- Asigno un rol (Admin / Vendedor) a cada usuario.
- No puedo desactivarme a mí mismo.
- Solo el Admin ve esta sección.

### HU-03 · Control de acceso por rol 🔴 · 3 pts
_Como administrador, quiero que cada rol vea solo lo que le corresponde, para proteger información sensible._
**Criterios de aceptación:**
- El Vendedor no ve gestión de usuarios ni precios de compra.
- Las rutas del backend validan el rol (no basta con ocultar en el front).

---

## Épica 2 — Productos y categorías

### HU-04 · Gestionar categorías 🔴 · 3 pts
_Como administrador, quiero gestionar categorías, para organizar mis productos._
**Criterios de aceptación:**
- CRUD completo de categorías (nombre, descripción).
- No puedo eliminar una categoría con productos asociados (o se avisa).

### HU-05 · Gestionar productos 🔴 · 5 pts
_Como administrador, quiero registrar y editar productos, para mantener mi catálogo actualizado._
**Criterios de aceptación:**
- CRUD de productos: SKU, nombre, categoría, precio compra, precio venta, stock mínimo.
- El SKU es único.
- Al crear un producto, su stock inicial es 0 (se carga por movimientos).
- Puedo desactivar un producto sin borrarlo.

### HU-06 · Buscar y filtrar productos 🟡 · 3 pts
_Como usuario, quiero buscar y filtrar productos, para encontrarlos rápido._
**Criterios de aceptación:**
- Busco por nombre o SKU.
- Filtro por categoría y por estado (activo/inactivo).
- Los resultados se paginan.

---

## Épica 3 — Control de inventario

### HU-07 · Registrar entrada de stock 🔴 · 5 pts
_Como administrador, quiero registrar entradas de stock, para reflejar las compras/reposiciones._
**Criterios de aceptación:**
- Registro cantidad, motivo y (opcional) proveedor.
- El stock del producto aumenta automáticamente.
- Queda guardado en el historial de movimientos.

### HU-08 · Registrar salida o ajuste 🔴 · 3 pts
_Como administrador, quiero registrar salidas o ajustes de stock, para corregir mermas, roturas o errores._
**Criterios de aceptación:**
- Puedo registrar una salida/ajuste con motivo.
- No permite dejar el stock en negativo.
- Queda en el historial con el usuario y la fecha.

### HU-09 · Alertas de stock bajo 🔴 · 3 pts
_Como usuario, quiero ver alertas cuando un producto está por agotarse, para reponer a tiempo._
**Criterios de aceptación:**
- Si `stock_actual <= stock_minimo`, el producto se marca como "stock bajo".
- El dashboard muestra un contador y la lista de productos en alerta.

### HU-10 · Historial de movimientos 🟡 · 3 pts
_Como administrador, quiero ver el historial de movimientos de un producto, para auditar qué pasó con el stock._
**Criterios de aceptación:**
- Veo todos los movimientos (tipo, cantidad, motivo, usuario, fecha).
- Puedo filtrar por producto y por rango de fechas.

---

## Épica 4 — Ventas

### HU-11 · Registrar venta 🔴 · 8 pts
_Como vendedor, quiero registrar una venta con varios productos, para cobrar y descontar stock automáticamente._
**Criterios de aceptación:**
- Agrego varios productos con su cantidad; se calcula el total.
- No puedo vender más de lo que hay en stock.
- Al confirmar, el stock de cada producto se descuenta y se crea un movimiento de salida.
- La venta queda registrada con código, fecha y vendedor.

### HU-12 · Historial de ventas 🟡 · 3 pts
_Como administrador, quiero ver el historial de ventas y su detalle, para hacer seguimiento del negocio._
**Criterios de aceptación:**
- Listo las ventas con fecha, vendedor y total.
- Al abrir una venta, veo su detalle (productos, cantidades, subtotales).
- Filtro por rango de fechas.

---

## Épica 5 — Dashboard y reportes

### HU-13 · Dashboard con métricas 🔴 · 5 pts
_Como administrador, quiero un dashboard con métricas clave, para ver el estado del negocio de un vistazo._
**Criterios de aceptación:**
- Tarjetas: total de productos, productos en stock bajo, ventas del día/mes, valor del inventario.
- Un gráfico simple (ej. ventas de los últimos 7 días).

### HU-14 · Reportes exportables 🟡 · 3 pts
_Como administrador, quiero exportar reportes, para analizarlos o compartirlos._
**Criterios de aceptación:**
- Reporte de productos con bajo stock y de productos más vendidos.
- Exporto a CSV (o PDF).

---

## Épica 6 — Proveedores

### HU-15 · Gestionar proveedores 🟢 · 3 pts
_Como administrador, quiero gestionar proveedores, para asociarlos a las entradas de stock._
**Criterios de aceptación:**
- CRUD de proveedores (nombre, RUC, teléfono, email).
- Puedo asociar un proveedor al registrar una entrada de stock.

---

## Resumen de priorización

| Prioridad | Historias |
|-----------|-----------|
| 🔴 Alta | HU-01, 02, 03, 04, 05, 07, 08, 09, 11, 13 |
| 🟡 Media | HU-06, 10, 12, 14 |
| 🟢 Baja | HU-15 |

> 💡 **Total ≈ 62 puntos.** Con sprints de 2 semanas y una velocidad estimada de
> ~15 pts/sprint (un dev part-time), el MVP sale en **~4 sprints** + el Sprint 0 de setup.

---
Siguiente: [Plan de Sprints](03-plan-sprints.md) →
