import { http, type HttpInit } from './http'

export const get = <T>(
  url: string | URL,
  init?: Omit<HttpInit<T>, 'method'>
): Promise<T> => {
  return http<T>(url, { ...init, method: 'GET' })
}

export const post = <T>(
  url: string | URL,
  init?: Omit<HttpInit<T>, 'method'>
): Promise<T> => {
  return http<T>(url, { ...init, method: 'POST', body: init?.body })
}

export const patch = <T>(
  url: string | URL,
  init?: Omit<HttpInit<T>, 'method'>
): Promise<T> => {
  return http<T>(url, { ...init, method: 'PATCH', body: init?.body })
}

export const del = <T>(
  url: string | URL,
  init?: Omit<HttpInit<T>, 'method'>
): Promise<T> => {
  return http<T>(url, { ...init, method: 'DELETE' })
}
