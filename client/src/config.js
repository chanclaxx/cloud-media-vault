// URL de la API. Se toma de client/.env (VITE_API_URL); si no existe, usa la de desarrollo.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
