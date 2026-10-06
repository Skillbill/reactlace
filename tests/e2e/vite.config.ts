import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev server for the e2e harness page: it renders the library sources directly
export default defineConfig({
  root: fileURLToPath(new URL('./harness', import.meta.url)),
  plugins: [react()],
  css: {
    postcss: fileURLToPath(new URL('../..', import.meta.url))
  },
  server: {
    port: 5199,
    strictPort: true,
    fs: {
      allow: [fileURLToPath(new URL('../..', import.meta.url))]
    }
  }
})
