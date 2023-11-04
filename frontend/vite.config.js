import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // target: 'https://lingering-darkness-2848.fly.dev',
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    },
  },
})
