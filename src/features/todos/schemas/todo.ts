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
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(20, 'Title must not exceed 20 characters.'),
})
export const TodoPatchSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title can't be blank")
    .max(20, 'Title must not exceed 20 characters.')
    .optional(),
  toggleCompleted: z.literal(true).optional(),
})
export const ResultDeleteSchema = z.object({
  deletedId: z.uuid(),
})

export type TodoCreateInput = z.infer<typeof TodoCreateSchema>
export type TodoPatchInput = z.infer<typeof TodoPatchSchema>
export type ResultDeleteData = z.infer<typeof ResultDeleteSchema>

//Api
export type ApiOk<T> = { ok: true; data: T }
export type ApiError = { ok: false; error: string }
export type ApiResult<T> = ApiOk<T> | ApiError
