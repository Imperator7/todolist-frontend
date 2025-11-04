import { vi, beforeAll, afterEach, afterAll } from 'vitest'
import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import { handlers } from './src/mocks/handlers'

global.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 0)

export const mockServer = setupServer(...handlers)

beforeAll(() => mockServer.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  mockServer.resetHandlers()
  vi.clearAllMocks()
})
afterAll(() => mockServer.close())
