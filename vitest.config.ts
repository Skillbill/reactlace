import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Lit and its React wrapper ship a build for Node that renders nothing and
// skips the effects setting the element properties: the tests need the
// browser one, as the applications get
const conditions = ['browser', 'development']

export default defineConfig({
  plugins: [react()],
  resolve: { conditions },
  ssr: { resolve: { conditions } },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/unit/setup.ts'],
    restoreMocks: true,
    server: {
      deps: {
        inline: [/@lit\//, /\/lit(-html|-element)?\//, /@lit-labs\//, /@shoelace-style\//]
      }
    }
  }
})
