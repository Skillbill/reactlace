import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// React only flushes effects synchronously in tests when told it runs in one
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

// Used by Shoelace to size its textarea, missing in jsdom
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

afterEach(() => {
  cleanup()
})
