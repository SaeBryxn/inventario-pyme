// Especificación OpenAPI 3 de la API de StockPro (para Swagger UI en /api/docs).
export const openapiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'StockPro API',
    version: '1.0.0',
    description: 'API del Sistema de Gestión de Inventario para PYMEs. Autenticación con JWT (Bearer).',
  },
  servers: [{ url: '/', description: 'Servidor actual' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Error: { type: 'object', properties: { ok: { type: 'boolean', example: false }, error: { type: 'string' } } },
      Login: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', example: 'admin@demo.com' }, password: { type: 'string', example: 'demo1234' } } },
      Producto: { type: 'object', properties: { id: { type: 'integer' }, sku: { type: 'string' }, nombre: { type: 'string' }, precio_venta: { type: 'number' }, stock_actual: { type: 'integer' }, stock_bajo: { type: 'boolean' } } },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/api/health': { get: { tags: ['Sistema'], summary: 'Estado del servicio', security: [], responses: { 200: { description: 'OK' } } } },
    '/api/auth/login': { post: { tags: ['Auth'], summary: 'Iniciar sesión', security: [], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } } }, responses: { 200: { description: 'Token + usuario' }, 401: { description: 'Credenciales inválidas' } } } },
    '/api/auth/perfil': {
      get: { tags: ['Auth'], summary: 'Perfil del usuario autenticado', responses: { 200: { description: 'Perfil' } } },
      put: { tags: ['Auth'], summary: 'Actualizar perfil (nombre, email, avatar)', responses: { 200: { description: 'Perfil actualizado' } } },
    },
    '/api/productos': {
      get: { tags: ['Productos'], summary: 'Listar/buscar productos', parameters: [{ name: 'buscar', in: 'query', schema: { type: 'string' } }, { name: 'categoria', in: 'query', schema: { type: 'integer' } }, { name: 'estado', in: 'query', schema: { type: 'string', enum: ['activos', 'inactivos', 'todos'] } }, { name: 'page', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'Lista paginada' } } },
      post: { tags: ['Productos'], summary: 'Crear producto (admin)', responses: { 201: { description: 'Creado' }, 403: { description: 'Sin permiso' } } },
    },
    '/api/productos/{id}': {
      get: { tags: ['Productos'], summary: 'Detalle de un producto', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Producto' }, 404: { description: 'No encontrado' } } },
      put: { tags: ['Productos'], summary: 'Actualizar producto (admin)', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Actualizado' } } },
    },
    '/api/movimientos': {
      get: { tags: ['Inventario'], summary: 'Historial de movimientos', responses: { 200: { description: 'Lista' } } },
      post: { tags: ['Inventario'], summary: 'Registrar entrada/salida/ajuste (admin)', responses: { 201: { description: 'Registrado' } } },
    },
    '/api/ventas': {
      get: { tags: ['Ventas'], summary: 'Historial de ventas', responses: { 200: { description: 'Lista' } } },
      post: { tags: ['Ventas'], summary: 'Registrar venta (descuenta stock)', responses: { 201: { description: 'Venta creada' }, 400: { description: 'Stock insuficiente' } } },
    },
    '/api/ventas/{id}': { get: { tags: ['Ventas'], summary: 'Detalle de una venta', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Venta con detalle' } } } },
    '/api/clientes': {
      get: { tags: ['Clientes'], summary: 'Listar clientes', responses: { 200: { description: 'Lista' } } },
      post: { tags: ['Clientes'], summary: 'Crear cliente', responses: { 201: { description: 'Creado' } } },
    },
    '/api/dashboard': { get: { tags: ['Dashboard'], summary: 'Métricas, alertas y datos de gráficos', responses: { 200: { description: 'Resumen' } } } },
    '/api/reportes/mas-vendidos': { get: { tags: ['Reportes'], summary: 'Productos más vendidos (admin)', responses: { 200: { description: 'Lista' } } } },
    '/api/configuracion': {
      get: { tags: ['Configuración'], summary: 'Datos del negocio', responses: { 200: { description: 'Config' } } },
      put: { tags: ['Configuración'], summary: 'Actualizar negocio (admin)', responses: { 200: { description: 'Actualizado' } } },
    },
    '/api/auditoria': { get: { tags: ['Auditoría'], summary: 'Log de actividad (admin)', responses: { 200: { description: 'Lista' } } } },
  },
};
