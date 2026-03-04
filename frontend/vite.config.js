import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
base: '/exprevproj/',
  server: {
    port: 3000,
    proxy: {
      '/exprevproj/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});
