export function http(url: RequestInfo | URL, init: RequestInit = {}) {
  const { headers, method = 'GET', body, ...rest } = init

  const reqOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  }

  if (body) {
    reqOptions.body = typeof body === 'object' ? JSON.stringify(body) : body
  }

  return fetch(url, init)
}
