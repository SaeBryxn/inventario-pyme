# ✅ Definición de Hecho (Definition of Done)

← Volver al [Índice](00-INDICE.md)

Una Historia de Usuario **no está terminada** cuando "el código funciona en mi
máquina". Está terminada cuando cumple **toda** esta lista. Tener una DoD clara es
señal de madurez profesional — menciónala en entrevistas.

## Checklist para cerrar una HU

- [ ] Cumple **todos** los criterios de aceptación de la HU.
- [ ] El backend **valida datos y permisos por rol** (no solo el frontend).
- [ ] Maneja **errores** con mensajes claros (no se rompe con datos vacíos o inválidos).
- [ ] La interfaz es **responsive** (se ve bien en móvil y escritorio).
- [ ] **Sin errores** en la consola del navegador ni en el servidor.
- [ ] Código **legible**: nombres claros, sin código muerto ni `console.log` olvidados.
- [ ] Probado manualmente el "camino feliz" y **al menos un caso de error**.
- [ ] Commits con formato correcto y **referenciando el issue** (`#N`).
- [ ] Documentación/README actualizada si el cambio lo amerita.
- [ ] La tarjeta está en **Done** y el issue **cerrado**.

## Definición de Hecho a nivel de Sprint

- [ ] Todas las HU comprometidas cumplen su DoD (o se devuelven al backlog, sin trampas).
- [ ] La rama principal está **estable** (la app arranca y funciona).
- [ ] Hay un **incremento demostrable**: GIF o capturas de lo nuevo.
- [ ] Retrospectiva escrita en `docs/retros/sprint-N.md`.

## Regla de oro

> Si no puedes **demostrarlo con un click** (o un GIF), **no está hecho**.

---
Volver al [Índice](00-INDICE.md) · Ver [Product Backlog](02-product-backlog.md)
