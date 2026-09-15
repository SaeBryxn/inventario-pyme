# 🎯 Visión y MVP

← Volver al [Índice](00-INDICE.md)

## El problema

Muchas PYMEs peruanas (bodegas, ferreterías, boticas, distribuidoras, tiendas de
ropa) siguen controlando su inventario en **cuadernos o Excel**. Esto causa:

- No saber cuánto stock real hay → se quedan sin productos o compran de más.
- Pérdidas por productos vencidos, robos o errores no detectados.
- No saber qué se vende más ni cuánto se gana.
- Depender de una sola persona que "tiene todo en la cabeza".

## La solución

**StockPro**: una aplicación web sencilla y rápida donde un negocio pequeño
registra sus productos, controla el stock automáticamente con cada venta, recibe
alertas cuando algo está por agotarse y ve reportes claros de su operación.

## Visión (una frase)

> Para **dueños de PYMEs** que pierden control de su inventario, StockPro es una
> **app web** que centraliza productos, stock y ventas en tiempo real; a
> diferencia del cuaderno o Excel, **avisa cuándo reponer** y muestra **qué se
> vende y cuánto se gana**.

## Roles del sistema

| Rol | Qué puede hacer |
|-----|-----------------|
| **Administrador** | Todo: gestiona usuarios, productos, proveedores, inventario, ve reportes y configuración. |
| **Vendedor** | Registra ventas y consulta productos/stock. No gestiona usuarios ni ve costos de compra. |

## Alcance del MVP (lo mínimo que debe funcionar)

✅ **Dentro del MVP:**
- Login con roles (Admin / Vendedor).
- CRUD de productos y categorías.
- Control de stock (entradas, salidas, ajustes) con historial.
- Alerta de stock bajo.
- Registro de ventas que descuenta stock.
- Dashboard con métricas básicas.
- Gestión de proveedores.

🚫 **Fuera del MVP (versiones futuras):**
- Facturación electrónica / integración SUNAT.
- Múltiples almacenes/sucursales.
- App móvil nativa.
- Lectura de código de barras con cámara.
- Compras/órdenes a proveedor automatizadas.

> 💡 Mantener el MVP acotado es parte de trabajar con método: **primero algo que
> funcione de punta a punta**, después se agranda. Ese "recorte" también se
> valora en una entrevista.

## Criterio de éxito

El MVP está listo cuando un usuario puede: **iniciar sesión → registrar un
producto → registrar una venta → ver el stock descontado y una alerta de stock
bajo → ver todo reflejado en el dashboard**, con la app **desplegada** y accesible
por un link.

---
Siguiente: [Product Backlog](02-product-backlog.md) →
