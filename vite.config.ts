import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*'],
      outDir: 'dist'
    })
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: [
        resolve(__dirname, 'src/index.ts'),
        resolve(__dirname, 'node_modules/primereact/resources/themes/saga-blue/theme.css')
      ],
      name: 'Reactlace',
      fileName: 'reactlace'
    },
    rollupOptions: {
      external: (id) => id === 'react' || id === 'react-dom' || id.startsWith('react/') || id.startsWith('react-dom/'),
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith('.css') ? 'styles/[name][extname]' : 'assets/[name][extname]',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'React',
          'react/jsx-dev-runtime': 'React'
        }
      }
    },
    cssCodeSplit: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
