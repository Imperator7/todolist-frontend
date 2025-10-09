import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DataCtx,
  ActionsCtx,
  type TodosDataCtx,
  type TodosActionsCtx,
} from '../hooks/queryHooks'
import { TodosService } from '../services/todos.service'
import { TODOS_QK } from '../queryKeys'

export function TodosProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: TODOS_QK,
    queryFn: () => TodosService.list(),
  })

  const createMut = useMutation({
    mutationFn: (title: string) => TodosService.create(title),
    onSuccess: () => qc.invalidateQueries({ queryKey: TODOS_QK }),
  })

  const editTitleMut = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      TodosService.editTitle(id, title),
    onSuccess: () => qc.invalidateQueries({ queryKey: TODOS_QK }),
  })

  const toggleMut = useMutation({
    mutationFn: (id: string) => TodosService.toggleCompleted(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TODOS_QK }),
  })

  const removeMut = useMutation({
    mutationFn: (id: string) => TodosService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TODOS_QK }),
  })

  const value: TodosDataCtx = useMemo(
    () => ({
      todos: data ?? [],
      isLoading,
    }),
    [data, isLoading]
  )

  const actions: TodosActionsCtx = useMemo(
    () => ({
      create: (title: string) => createMut.mutateAsync(title),
      editTitle: (id: string, title: string) =>
        editTitleMut.mutateAsync({ id, title }),
      toggleCompleted: (id: string) => toggleMut.mutateAsync(id),
      remove: (id: string) => removeMut.mutateAsync(id),
    }),
    [createMut, editTitleMut, toggleMut, removeMut]
  )

  return (
    <ActionsCtx.Provider value={actions}>
      <DataCtx.Provider value={value}>{children}</DataCtx.Provider>
    </ActionsCtx.Provider>
  )
}
