import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Allow access from outside localhost
    allowedHosts: [
      '6226c64b079a.ngrok-free.app' // 👈 your ngrok hostname without https://
    ]
  }
})
