import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Look for index.html in the project root
  root: '.',
  
  publicDir: 'public',
  
  server: {
    port: 3000,
    strictPort: true, // Fail if port is already in use
    host: true,       // Listen on all interfaces
    open: true
  },
  
  build: {
    rollupOptions: {
        input: {
            main: resolve(__dirname, 'index.html'),
        }
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});