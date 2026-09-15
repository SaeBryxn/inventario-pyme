// Cliente HTTP mínimo sobre fetch. Centraliza las llamadas a la API,
// añade el token JWT si existe y normaliza la respuesta { ok, data, error }.
const BASE = import.meta.env.VITE_API_URL || ''; // vacío => usa el proxy /api de Vite

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({ ok: false, error: 'Respuesta inválida' }));
  if (!res.ok || json.ok === false) {
    throw new Error(json.error || `Error ${res.status}`);
  }
  return json.data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};
