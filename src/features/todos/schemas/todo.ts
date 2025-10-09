import { z } from 'zod'

export const TodoSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1, 'Title is required'),
  completed: z.boolean().default(false),
})
export const TodosSchema = z.array(TodoSchema)

export type Todo = z.infer<typeof TodoSchema>
export type Todos = Todo[]

export const TodoCreateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
})
export const TodoPatchSchema = z.object({
  title: z.string().trim().min(1, "Title can't be blank").optional(),
  toggleCompleted: z.literal(true).optional(),
})

export type TodoCreateInput = z.infer<typeof TodoCreateSchema>
export type TodoPatchInput = z.infer<typeof TodoPatchSchema>

//Api
export type ApiOk<T> = { ok: true; data: T }
export type ApiError = { ok: false; error: string }
export type ApiResult<T> = ApiOk<T> | ApiError
