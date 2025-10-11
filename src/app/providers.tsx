import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TodosProvider } from '../features/todos/context/todos.provider'
import { useState, type ReactNode } from 'react'

export function AppProviders({ children }: { children: ReactNode }) {
  const [qc] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 10_000,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={qc}>
      <TodosProvider>{children}</TodosProvider>
    </QueryClientProvider>
  )
}
