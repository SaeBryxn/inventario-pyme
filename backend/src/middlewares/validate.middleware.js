// Middleware de validación con Zod. Uso: router.post('/', validate(schema), controlador)
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const msg = result.error.issues.map((i) => i.message).join(' · ');
      return res.status(400).json({ ok: false, error: msg });
    }
    req.body = { ...req.body, ...result.data };
    next();
  };
}
