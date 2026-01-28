import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()], // Config in uno.config.ts

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Development server configuration
  server: {
    port: 1420,
    strictPort: true,
    host: '0.0.0.0', // Allow access from Windows host (WSL2 development)
  },

  // Electron production build configuration
  base: './', // Use relative paths for Electron
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
