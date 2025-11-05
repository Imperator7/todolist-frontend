import { setupWorker } from 'msw/browser'
import { makeHandlers } from './todos.handlers'

export const worker = setupWorker(...makeHandlers())
