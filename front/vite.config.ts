import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: { usePolling: true },
    proxy: {
      '/api': {
        target: 'http://back:8000',
        changeOrigin: true,
        secure: false,
      },
      '/.well-known/mercure': {
        target: 'http://mercure:80',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://back:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (
              id.includes('@tanstack') ||
              id.includes('zod') ||
              id.includes('hookform')
            ) {
              return 'vendor-tooling';
            }
            return 'vendor-core';
          }
        }
      }
    }
  }
})