import { z } from 'zod'

export const TodoSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  done: z.boolean().default(false),
})

export const TodosSchema = z.array(TodoSchema)

export type TodoT = z.infer<typeof TodoSchema>
