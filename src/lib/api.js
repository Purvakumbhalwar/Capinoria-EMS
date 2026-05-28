// On Vercel: VITE_API_URL defaults to '/api' (same domain, no full URL)
// On localhost: defaults to 'http://localhost:5000'
export const API_BASE = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:5000'
    : '/api'
);

export async function apiFetch(path, options) {
  return fetch(`${API_BASE}${path}`, options);
}

export default API_BASE;
