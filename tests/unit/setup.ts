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

// Used by Shoelace to run the animations of dialogs and popups, missing in jsdom
window.matchMedia ??= (query: string) =>
  ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList
Element.prototype.getAnimations ??= () => []
Element.prototype.animate ??= function () {
  return { finished: Promise.resolve(), cancel() {}, addEventListener() {} } as unknown as Animation
}

afterEach(() => {
  cleanup()
})
