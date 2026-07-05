import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  api: {
    target: 'https://backend-project-r1kg.onrender.com',
    ChangeOrigin: true,
  }
});