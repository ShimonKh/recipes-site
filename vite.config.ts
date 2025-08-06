// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/recipes-site', // Adjust the base path as needed
  plugins: [react()],
});
