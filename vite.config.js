import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/backend': {
        target: 'http://localhost/medai',
        changeOrigin: true,
      }
    }
  }
})
