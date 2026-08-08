import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  preview: {
    host: '0.0.0.0',
    allowedHosts: ['remarkable-enjoyment-production-84f9.up.railway.app']
  }
})
