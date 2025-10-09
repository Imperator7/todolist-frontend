import { HttpError } from './http.error'

const isJson = (ct: string | null) => {
  return !!ct && /\bapplication\/(json|[^;]+\+json)\b/i.test(ct)
}

async function safeJson(res: Response) {
  const text = await res.text()

  if (!text.trim()) return null

  try {
    return JSON.parse(text)
  } catch {
    throw new HttpError('Malformed JSON', { status: res.status, url: res.url })
  }
}

export async function parseBody(res: Response) {
  const ct = res.headers.get('Content-Type') ?? ''
  return isJson(ct) ? safeJson(res) : res.text()
}
