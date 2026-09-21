import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        helena: fileURLToPath(new URL('./index.html', import.meta.url)),
        molina: fileURLToPath(new URL('./molina/index.html', import.meta.url)),
      },
    },
  },
})
