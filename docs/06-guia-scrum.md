# 🧭 Guía Scrum (para un solo desarrollador)

← Volver al [Índice](00-INDICE.md)

Scrum está pensado para equipos, pero puedes aplicar sus **artefactos y ritmo**
siendo uno solo. Lo importante para tus prácticas es que **domines el vocabulario
y lo demuestres** en tu repo. Aquí, quién es quién y cómo lo llevas.

## Roles (te toca hacerlos todos, pero entiéndelos)

| Rol | En un equipo real | En tu proyecto |
|-----|-------------------|----------------|
| **Product Owner** | Decide qué se construye y prioriza el backlog | Tú, al ordenar las HU. |
| **Scrum Master** | Facilita el proceso, quita bloqueos | Tú, al mantener el tablero y las ceremonias. |
| **Development Team** | Construye el producto | Tú, al codear. |

## Artefactos (esto es lo que se ve en tu GitHub)

1. **Product Backlog** → tu [lista de HU](02-product-backlog.md) como *issues*.
2. **Sprint Backlog** → las HU que metes al *milestone* del sprint actual.
3. **Incremento** → lo que queda funcionando y desplegado al cerrar cada sprint.

## Tablero en GitHub Projects

Crea un proyecto tipo **Board** con estas columnas:

```
Backlog  →  To Do (sprint actual)  →  In Progress  →  En revisión  →  Done
```

- Cada **HU es un issue** (usa la [plantilla](../.github/ISSUE_TEMPLATE/historia-de-usuario.md)).
- Etiquetas útiles: `frontend`, `backend`, `bd`, `bug`, `prioridad-alta`.
- Cada **Milestone = un Sprint** con fecha de fin.
- Mueves la tarjeta conforme avanzas. Cierras el issue cuando cumple la
  [Definición de Hecho](07-definicion-de-hecho.md).

## Las ceremonias, adaptadas

| Ceremonia | Frecuencia | Qué haces exactamente |
|-----------|-----------|------------------------|
| **Sprint Planning** | Inicio de sprint | Eliges HU (según velocidad ~15 pts) y las divides en tareas técnicas. |
| **Daily Scrum** | Diario | 1 commit mínimo + actualizas el tablero. Opcional: 1 línea en un log. |
| **Sprint Review** | Fin de sprint | Grabas un GIF/demo de lo hecho. Lo guardas para el portafolio. |
| **Retrospectiva** | Fin de sprint | Escribes en `docs/retros/sprint-N.md`: ✅ qué salió bien, ⚠️ qué mejorar, 🎯 acción. |

## Buenas prácticas de commits (suman muchísimo)

Usa **Conventional Commits**, referenciando el issue:

```
feat(productos): crear endpoint POST /api/productos  (#5)
fix(auth): validar token expirado                    (#2)
docs: agregar diagrama ERD
```

- `feat`, `fix`, `docs`, `refactor`, `chore`, `test`.
- Referenciar `#N` enlaza el commit con la HU en GitHub automáticamente.
- Commits pequeños y frecuentes > un commit gigante.

## Ejemplo: partir una HU en tareas (Sprint Planning)

**HU-05 · Gestionar productos** →
- [ ] BD: verificar tabla `productos` y seed de categorías.
- [ ] API: endpoints CRUD `/api/productos`.
- [ ] API: validación de SKU único.
- [ ] Front: página lista de productos (tabla + paginación).
- [ ] Front: formulario crear/editar (modal).
- [ ] Front: conectar con la API (service).
- [ ] Probar criterios de aceptación y cerrar el issue.

---
Siguiente: [Definición de Hecho](07-definicion-de-hecho.md) →
