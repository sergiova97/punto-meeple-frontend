import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// @ts-ignore
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:3000',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
      },
    },
  },
})