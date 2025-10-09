import { createContext, useContext } from 'react'
import type { Todos, Todo } from '../schemas/todo'

export type TodosDataCtx = {
  todos: Todos
  isLoading: boolean
}

export type TodosActionsCtx = {
  create: (title: string) => Promise<Todo>
  editTitle: (id: string, title: string) => Promise<Todo>
  toggleCompleted: (id: string) => Promise<Todo>
  remove: (id: string) => Promise<void>
}

const initialDataState: TodosDataCtx = { todos: [], isLoading: false }

export const DataCtx = createContext<TodosDataCtx>(initialDataState)
export const ActionsCtx = createContext<TodosActionsCtx | null>(null)

export function useTodosData() {
  const ctx = useContext(DataCtx)
  if (!ctx) throw new Error('useTodosData must be used within TodosProvider')
  return ctx
}
export function useTodosActions() {
  const ctx = useContext(ActionsCtx)
  if (!ctx) throw new Error('useTodosActions must be used within TodosProvider')
  return ctx
}
