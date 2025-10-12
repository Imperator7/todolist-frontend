import { TODOS_QK } from '../queryKeys'
import { useQuery } from '@tanstack/react-query'
import { TodosService } from '../services/todos.service'

export function useTodoLength() {
  return useQuery({
    queryKey: TODOS_QK,
    queryFn: TodosService.list,
    select: (todos) => todos.length,
  })
}
