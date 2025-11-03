import { beforeAll, afterEach, afterAll } from 'vitest'
import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import { handlers } from './src/mocks/handlers'

export const mockServer = setupServer(...handlers)

beforeAll(() => mockServer.listen())
afterEach(() => mockServer.resetHandlers())
afterAll(() => mockServer.close())
