const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function authHeaders() {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(json.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.body = json;
    throw error;
  }
  return json;
}

export const api = {
  // ── Public ────────────────────────────────────────
  async listProducts() {
    return handle(await fetch(`${API_BASE}/api/products`));
  },

  async getProduct(id) {
    return handle(await fetch(`${API_BASE}/api/products/${id}`));
  },

  // ── Auth ─────────────────────────────────────────
  async login(username, password) {
    return handle(await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }));
  },

  async me() {
    return handle(await fetch(`${API_BASE}/api/auth/me`, {
      headers: authHeaders(),
    }));
  },

  // ── Admin: Products ──────────────────────────────
  async createProduct(data) {
    return handle(await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
    }));
  },

  async updateProduct(id, data) {
    return handle(await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
    }));
  },

  async deleteProduct(id) {
    return handle(await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }));
  },

  // ── Admin: Upload ────────────────────────────────
  async uploadImage(file) {
    const form = new FormData();
    form.append('file', file);
    return handle(await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers: authHeaders(),
      body: form,
    }));
  },

  // Helper: turn "/uploads/x.jpg" into "http://localhost:3000/uploads/x.jpg"
  imageUrl(path) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path}`;
  },
};