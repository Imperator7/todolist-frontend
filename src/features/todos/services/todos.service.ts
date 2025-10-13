import {
  TodoCreateSchema,
  TodosSchema,
  TodoSchema,
  type ApiResult,
  type Todo,
  type Todos,
  TodoPatchSchema,
  ResultDeleteSchema,
  type ResultDeleteData,
} from './../schemas/todo'
import { get, post, patch, del } from '../../../lib/http/http.methods'
import { unwrapResult } from '../../../lib/helper/unwrapResult'
import { firstMessage } from '../../../lib/helper/validation'

const BASE = '/api/todos'

export const TodosService = {
  list: async (): Promise<Todos> => {
    const res = await get<ApiResult<Todos>>(BASE)
    return unwrapResult(res, TodosSchema)
  },
  create: async (title: string): Promise<Todo> => {
    const parsed = TodoCreateSchema.safeParse({ title })
    if (!parsed.success) {
      throw Error(firstMessage(parsed.error))
    }
    const res = await post<ApiResult<Todo>>(BASE, { body: { ...parsed.data } })
    return unwrapResult(res, TodoSchema)
  },
  editTitle: async (id: string, title: string): Promise<Todo> => {
    const parsed = TodoPatchSchema.safeParse({ title })
    if (!parsed.success) {
      throw Error(firstMessage(parsed.error))
    }
    const res = await patch<ApiResult<Todo>>(`${BASE}/${id}`, {
      body: { ...parsed.data },
    })
    return unwrapResult(res, TodoSchema)
  },
  toggleCompleted: async (id: string): Promise<Todo> => {
    const parsed = TodoPatchSchema.parse({ toggleCompleted: true })
    const res = await patch<ApiResult<Todo>>(`${BASE}/${id}`, {
      body: { ...parsed },
    })
    return unwrapResult(res, TodoSchema)
  },
  remove: async (id: string): Promise<ResultDeleteData> => {
    const res = await del<ApiResult<ResultDeleteData>>(`${BASE}/${id}`)
    return unwrapResult(res, ResultDeleteSchema)
  },
}
