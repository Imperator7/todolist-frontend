import type { ApiOk, ApiError } from '../../features/todos/schemas/todo'

function isObjectRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

export function isApiOk<T>(v: unknown): v is ApiOk<T> {
  if (!isObjectRecord(v)) return false
  const o = v as Record<string, unknown>
  return o.ok === true && 'data' in o
}

export function isApiError(v: unknown): v is ApiError {
  if (!isObjectRecord(v)) return false
  const o = v as Record<string, unknown>
  return o.ok === false && 'error' in o
}
