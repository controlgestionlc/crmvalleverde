import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// IMPORTANTE: cambia "base" al nombre exacto de tu repositorio de GitHub
// para que funcione correctamente en GitHub Pages.
// Ejemplo: si tu repo es github.com/tu-usuario/crm-inmobiliaria
// entonces base debe ser '/crm-inmobiliaria/'
export default defineConfig({
  base: '/crmvalleverde/',
  plugins: [react(), tailwindcss()],
})
