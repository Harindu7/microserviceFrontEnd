import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/users': 'http://localhost:8080',
      '/api/companies': 'http://localhost:8081'
    }
  }
})
