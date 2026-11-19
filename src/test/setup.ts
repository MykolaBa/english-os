import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Unmount rendered components between tests (automatic only with `globals: true`).
afterEach(() => cleanup())

window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}
