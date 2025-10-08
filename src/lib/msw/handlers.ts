import { delay, http, HttpResponse } from 'msw'

import type {
  CreateTodoInput,
  Todo,
  Todos,
} from '../../features/todos/schemas/todo'

const todos: Todos = [
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

export const handlers = [
  http.get('/api/todos', async () => {
    await delay(200)
    return HttpResponse.json({ ok: true, data: todos }, { status: 200 })
  }),

  http.get('/api/todos/:id', ({ params }) => {
    const todoId = params.id
    const todo = todos.find((t) => t.id === todoId)
    if (!todo) {
      return HttpResponse.json(
        { ok: false, error: 'Not found' },
        { status: 404 }
      )
    }
    return HttpResponse.json({ ok: true, data: todo }, { status: 200 })
  }),

  http.post('/api/todos', async ({ request }) => {
    await delay(200)
    const body: CreateTodoInput = (await request.json()) as CreateTodoInput
    const item: Todo = {
      id: crypto.randomUUID(),
      title: body.title,
      completed: false,
    }

    if (!item) {
      return HttpResponse.json(
        { ok: false, error: 'Failed to create new task' },
        { status: 400 }
      )
    }

    todos.unshift(item)

    return HttpResponse.json({ ok: true, data: item }, { status: 201 })
  }),
]
