import { z, ZodType } from 'zod'
import { HttpError } from './http.error'
import { parseBody } from './http.parse'

type JsonLike = Record<string, unknown> | unknown[] | null

type RequestInitWithJsonBody = Omit<RequestInit, 'body'> & {
  body?: BodyInit | JsonLike
  signal?: AbortSignal
}

export type HttpInit<T> = RequestInitWithJsonBody & {
  schema?: ZodType<T>
  timeoutMs?: number
}

const isJsonBody = (b: unknown) =>
  b &&
  typeof b === 'object' &&
  !(b instanceof FormData) &&
  !(b instanceof Blob) &&
  !(b instanceof ArrayBuffer) &&
  !(b instanceof URLSearchParams)

function withTimeoutAbort(signal: AbortSignal | undefined, ms?: number) {
  const ctrl = new AbortController()

  const onAbort = () => ctrl.abort()
  signal?.addEventListener('abort', onAbort, { once: true })

  let timer: ReturnType<typeof setTimeout> | undefined

  if (ms && ms > 0) timer = setTimeout(() => ctrl.abort(), ms)

  const clearAbortSignal = () => {
    if (timer) clearTimeout(timer)
    signal?.removeEventListener('abort', onAbort)
  }

  return { signal: ctrl.signal, clearAbortSignal }
}

export async function http<T>(
  url: RequestInfo | URL,
  init: HttpInit<T> = {}
): Promise<T> {
  const {
    headers,
    method = 'GET',
    body,
    timeoutMs = 8000,
    signal,
    schema,
    ...rest
  } = init

  const hdrs = new Headers(headers ?? {})
  const hasBody = body !== undefined

  if (hasBody && isJsonBody(body) && !hdrs.has('Content-Type'))
    hdrs.set('Content-Type', 'application/json')

  const stringifyJSON = hasBody
    ? isJsonBody(body)
      ? JSON.stringify(body as JsonLike)
      : (body as BodyInit | undefined)
    : undefined

  const { signal: abortSignal, clearAbortSignal } = withTimeoutAbort(
    signal,
    timeoutMs
  )

  let res: Response
  try {
    res = await fetch(url, {
      method: method,
      headers: hdrs,
      body: stringifyJSON,
      signal: abortSignal,
      ...rest,
    })
  } catch (e) {
    clearAbortSignal()
    throw new HttpError('Network error', { url: String(url), data: e })
  } finally {
    clearAbortSignal()
  }

  if ([204, 205, 304].includes(res.status)) {
    if (!res.ok)
      throw new HttpError(`HTTP ${res.status}`, { status: res.status })

    return null as T
  }

  const parsed = await parseBody(res)

  if (parsed && !parsed.ok && typeof parsed === 'object') {
    const e = (parsed as { error?: unknown }).error
    const m = (parsed as { message?: unknown }).message
    const d = (parsed as { detail?: unknown }).detail
    const msg =
      (typeof m === 'string' && m.trim() && m) ||
      (typeof e === 'string' && e.trim() && e) ||
      (typeof d === 'string' && d.trim() && d) ||
      'Request failed'
    throw new HttpError(msg, { status: res.status, url: res.url, data: parsed })
  }

  if (schema) {
    const result = schema.safeParse(parsed)
    if (!result.success) {
      throw new HttpError('Response validation failed', {
        status: res.status,
        url: res.url,
        data: z.treeifyError(result.error),
      })
    }
  }

  return parsed as T
}
