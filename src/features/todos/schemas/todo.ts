import { z } from 'zod'

export const TodoSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1, 'Title is required'),
  completed: z.boolean().default(false),
})
export const TodosSchema = z.array(TodoSchema)

export type Todo = z.infer<typeof TodoSchema>
export type Todos = Todo[]

export const CreateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
})

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>
