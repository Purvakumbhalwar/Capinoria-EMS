export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function apiFetch(path, options) {
  return fetch(`${API_BASE}${path}`, options);
}

export default API_BASE;
