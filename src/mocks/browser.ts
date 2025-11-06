import { setupWorker } from 'msw/browser'
import { makeHandlers } from './todos.handlers'

const initialTodos = [
  {
    id: crypto.randomUUID(),
    title: 'finish the job',
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'send the application',
    completed: true,
  },
]

export const worker = setupWorker(
  ...makeHandlers({ initialTodos: initialTodos, delayMs: 300 })
)
