import { useMemo, useRef } from 'react'
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
import type { Todo, Todos } from '../schemas/todo'
import { toast } from 'sonner'

export function TodosProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient()

  const { data, isPending } = useQuery({
    queryKey: TODOS_QK,
    queryFn: () => TodosService.list(),
  })

  function replaceById(list: Todos | undefined, next: Todo): Todos | undefined {
    return list ? list.map((t) => (t.id === next.id ? next : t)) : list
  }

  const createMut = useMutation({
    mutationFn: (title: string) => TodosService.create(title),

    async onMutate(title) {
      await qc.cancelQueries({ queryKey: TODOS_QK })
      const prev = qc.getQueryData<Todos>(TODOS_QK)

      const tempId = 'temp-' + crypto.randomUUID()
      const optimistic: Todo = {
        id: tempId,
        title: title,
        completed: false,
      }

      qc.setQueryData<Todos>(TODOS_QK, (curr) =>
        curr ? [...curr, optimistic] : [optimistic]
      )

      return { prev, tempId }
    },

    onError(err, _vars, ctx) {
      if (ctx?.prev) qc.setQueryData(TODOS_QK, ctx.prev)
      toast.error(err.message)
    },

    onSuccess(real, _vars, ctx) {
      if (!ctx) return
      qc.setQueryData<Todos>(TODOS_QK, (curr) =>
        curr ? curr.map((t) => (t.id === ctx.tempId ? real : t)) : curr
      )
      toast.success('Created')
    },

    onSettled() {
      qc.invalidateQueries({ queryKey: TODOS_QK })
    },
  })

  const seqRef = useRef(0)
  const latestOpRef = useRef(new Map<string, number>())
  const lastSuccessRef = useRef(new Map<string, { opId: number; todo: Todo }>())

  const editTitleMut = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      TodosService.editTitle(id, title),
    async onMutate({ id, title }) {
      await qc.cancelQueries({ queryKey: TODOS_QK })
      const prev = qc.getQueryData<Todos>(TODOS_QK)

      const opId = ++seqRef.current
      latestOpRef.current.set(id, opId)

      qc.setQueryData<Todos>(TODOS_QK, (curr) =>
        curr
          ? curr.map((t) => (t.id === id ? { ...t, title: title } : t))
          : curr
      )

      return { prev, id, opId }
    },

    onError(err, _vars, ctx) {
      toast.error(err.message)

      if (!ctx) return

      if (latestOpRef.current.get(ctx.id) === ctx.opId) return

      const lastOk = lastSuccessRef.current.get(ctx.id)

      if (lastOk) {
        qc.setQueryData<Todos>(TODOS_QK, (curr) =>
          replaceById(curr, lastOk.todo)
        )
      } else if (ctx.prev) {
        qc.setQueryData(TODOS_QK, ctx.prev)
      }
    },

    onSuccess(todo, _vars, ctx) {
      if (!ctx) return

      const last = lastSuccessRef.current.get(ctx.id)
      if (!last || ctx.opId > last.opId) {
        lastSuccessRef.current.set(ctx.id, { opId: ctx.opId, todo: todo })
      }

      if (latestOpRef.current.get(ctx.id) === ctx.opId) {
        qc.setQueryData<Todos>(TODOS_QK, (curr) => replaceById(curr, todo))
      }
      toast.success('Edited')
    },

    onSettled(_data, _err, _vars, ctx) {
      if (ctx && latestOpRef.current.get(ctx.id) === ctx.opId) {
        qc.invalidateQueries({ queryKey: TODOS_QK })
      }
    },
  })

  const toggleMut = useMutation({
    mutationFn: (id: string) => TodosService.toggleCompleted(id),

    async onMutate(id) {
      await qc.cancelQueries({ queryKey: TODOS_QK })
      const prev = qc.getQueryData<Todos>(TODOS_QK)

      qc.setQueryData<Todos>(TODOS_QK, (curr) =>
        curr
          ? curr.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t
            )
          : curr
      )

      return { prev }
    },

    onError(_err, _vars, ctx) {
      if (ctx?.prev) qc.setQueryData(TODOS_QK, ctx.prev)
    },

    onSettled() {
      qc.invalidateQueries({ queryKey: TODOS_QK })
    },
  })

  const removeMut = useMutation({
    mutationFn: (id: string) => TodosService.remove(id),
    async onMutate(id) {
      await qc.cancelQueries({ queryKey: TODOS_QK })
      const prev = qc.getQueryData<Todos>(TODOS_QK)

      qc.setQueryData<Todos>(TODOS_QK, (curr) =>
        curr ? curr.filter((t) => t.id !== id) : curr
      )

      return { prev }
    },

    onError(_err, _vars, ctx) {
      if (ctx?.prev) qc.setQueryData(TODOS_QK, ctx.prev)
    },

    onSettled() {
      qc.invalidateQueries({ queryKey: TODOS_QK })
      toast.success('Removed 🗑️')
    },
  })

  const value: TodosDataCtx = useMemo(
    () => ({
      todos: data ?? [],
      isPending,
    }),
    [data, isPending]
  )

  const actions: TodosActionsCtx = useMemo(
    () => ({
      create: (title: string) => createMut.mutateAsync(title),
      editTitle: (id: string, title: string) =>
        editTitleMut.mutateAsync({ id, title }),
      toggleCompleted: (id: string) => toggleMut.mutateAsync(id),
      remove: (id: string) => removeMut.mutateAsync(id),
      isCreating: createMut.isPending,
    }),
    [createMut, editTitleMut, toggleMut, removeMut]
  )

  return (
    <ActionsCtx.Provider value={actions}>
      <DataCtx.Provider value={value}>{children}</DataCtx.Provider>
    </ActionsCtx.Provider>
  )
}
