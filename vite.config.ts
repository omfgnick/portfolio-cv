import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Served from GitHub Pages project site: https://omfgnick.github.io/portfolio-cv/
export default defineConfig({
  base: '/portfolio-cv/',
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          lucide: ['lucide-react'],
        },
      },
    },
  },
})
