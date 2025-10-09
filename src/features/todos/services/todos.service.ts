import type { ApiResult, Todo, Todos } from './../schemas/todo'
import { get, post, patch, del } from '../../../lib/http/http.methods'

const BASE = '/api/todos'

export const TodosService = {
  list: async (): Promise<Todos> => {
    const res = await get<ApiResult<Todos>>(BASE)
    if (!res.ok) {
      throw new Error(res.error)
    }
    return res.data
  },
  create: async (title: string): Promise<Todo> => {
    const res = await post<ApiResult<Todo>>(BASE, { body: { title } })
    if (!res.ok) {
      throw new Error(res.error)
    }
    return res.data
  },
  editTitle: async (id: string, title: string): Promise<Todo> => {
    const res = await patch<ApiResult<Todo>>(`${BASE}/${id}`, {
      body: { title },
    })
    if (!res.ok) {
      throw new Error(res.error)
    }
    return res.data
  },
  toggleCompleted: async (id: string): Promise<Todo> => {
    const res = await patch<ApiResult<Todo>>(`${BASE}/${id}`, {
      body: { toggleCompleted: true },
    })
    if (!res.ok) {
      throw new Error(res.error)
    }
    return res.data
  },
  remove: async (id: string): Promise<void> => {
    const res = await del<ApiResult<{ deleteId: string }>>(`${BASE}/${id}`)
    if (!res.ok) throw new Error(res.error)
  },
}
