import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative base for GitHub Pages
  build: {
    outDir: 'docs', // Builds directly to docs for instant GitHub Pages /docs support
    emptyOutDir: true,
  },
})
