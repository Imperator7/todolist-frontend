import { TODOS_QK } from '../queryKeys'
import { useQuery } from '@tanstack/react-query'
import { TodosService } from '../services/todos.service'

export function useTodoById(id: string) {
  return useQuery({
    queryKey: TODOS_QK, // or ['todo', id] if you fetch per-item
    queryFn: TodosService.list,
    select: (todos) => todos.find((t) => t.id === id),
    placeholderData: (p) => p,
  })
}
