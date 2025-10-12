import type { ZodType } from 'zod'
import { HttpError } from '../../lib/http/http.error'
import { isApiOk, isApiError } from './type-guards'

export function unwrapResult<T>(
  json: unknown,
  schema?: ZodType<T>,
  status?: number
): T {
  if (isApiOk<T>(json)) {
    if (!schema) return json.data as T
    const r = schema.safeParse(json.data)
    if (r.success) return r.data
    const issues = r.error.issues.map((i) => ({
      path: i.path.map(String),
      message: i.message,
    }))
    throw new HttpError('Response validation failed', {
      status,
      code: 'ZOD_VALIDATION',
      data: { issues },
    })
  }
  if (isApiError(json)) {
    throw new HttpError(json.error, { status, code: 'SERVER' })
  }
  throw new HttpError('Malformed server response', {
    status,
    code: 'ZOD_VALIDATION',
    data: json,
  })
}
