import { vi, afterEach } from 'vitest'
import '@testing-library/jest-dom'

global.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 0)

afterEach(() => {
  vi.resetAllMocks()
})
