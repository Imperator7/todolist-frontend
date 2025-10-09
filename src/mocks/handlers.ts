import { delay, http, HttpResponse } from 'msw'

import type {
  TodoCreateInput,
  TodoPatchInput,
  Todo,
  Todos,
} from '../features/todos/schemas/todo'

let todos: Todos = [
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
    const body: TodoCreateInput = (await request.json()) as TodoCreateInput
    const title = body.title

    if (title.trim() === '') {
      return HttpResponse.json(
        { ok: false, error: "Title can't be blank" },
        { status: 400 }
      )
    }

    const item: Todo = {
      id: crypto.randomUUID(),
      title: title,
      completed: false,
    }

    if (!item) {
      return HttpResponse.json(
        { ok: false, error: 'Failed to create new task' },
        { status: 400 }
      )
    }

    todos.push(item)

    return HttpResponse.json({ ok: true, data: item }, { status: 201 })
  }),

  http.patch('/api/todos/:id', async ({ request, params }) => {
    await delay(200)
    const id = params.id
    const targetTodo = todos.find((todo) => todo.id === id)

    if (!targetTodo) {
      return HttpResponse.json(
        { ok: false, error: 'Task Not Found' },
        { status: 404 }
      )
    }

    const body: TodoPatchInput = (await request.json()) as TodoPatchInput
    const newTitle = body.title
    const toggleCompleted = body.toggleCompleted

    if (newTitle === undefined && toggleCompleted !== true) {
      return HttpResponse.json(
        { ok: false, error: 'Nothing to update' },
        { status: 400 }
      )
    }

    let changedTodo = {
      ...targetTodo,
    }

    if (newTitle !== undefined) {
      const trimmed = newTitle.trim()
      changedTodo = { ...changedTodo, title: trimmed as string }
    }

    if (toggleCompleted) {
      changedTodo.completed = !changedTodo.completed
    }

    todos = todos.map((todo) => (todo.id === id ? changedTodo : todo))
    return HttpResponse.json({ ok: true, data: changedTodo }, { status: 200 })
  }),

  http.delete('/api/todos/:id', async ({ params }) => {
    await delay(200)
    const id = params.id

    const before = todos.length
    todos = todos.filter((todo) => todo.id !== id)

    if (todos.length === before) {
      return HttpResponse.json(
        { ok: false, error: 'Task Not Found' },
        { status: 404 }
      )
    }

    return HttpResponse.json(
      {
        ok: true,
        data: {
          deletedId: id,
        },
      },
      { status: 200 }
    )
  }),
]
