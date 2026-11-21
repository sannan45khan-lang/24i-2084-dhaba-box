import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Listen on 127.0.0.1 so the browser can always reach http://localhost:5173
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
});
