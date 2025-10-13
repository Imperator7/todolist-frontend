import type { ZodError } from 'zod'
import {
  TodoCreateSchema,
  TodoPatchSchema,
} from '../../features/todos/schemas/todo'

export function firstMessage(err: ZodError) {
  console.log(err)
  console.log(err.issues[0].message)
  return err.issues[0]?.message ?? 'Invalid input'
}

export function validateCreateTitle(title: string): string | undefined {
  const res = TodoCreateSchema.safeParse(title)

  if (!res.success) return firstMessage(res.error)
}

export function validatePatchTitle(title: string): string | undefined {
  const r = TodoPatchSchema.safeParse({ title })
  if (!r.success) return firstMessage(r.error)
}
