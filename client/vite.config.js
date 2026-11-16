import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Fijo en 5173 porque el servidor solo permite este origen por CORS (CORS_ORIGIN en server/.env).
    port: 5173,
    strictPort: true,
  },
});
