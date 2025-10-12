export class HttpError extends Error {
  status?: number
  data?: unknown
  url?: string
  method?: string
  code?: 'TIMEOUT' | 'NETWORK' | 'HTTP' | 'ZOD_VALIDATION' | 'SERVER'

  constructor(msg: string, init?: Partial<HttpError>) {
    super(msg)
    this.name = 'HttpError'
    Object.assign(this, init)
  }
}
