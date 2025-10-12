import { useRef, useState } from 'react'
import { useTodosActions } from '../hooks/queryHooks'
import { IoMdAdd } from 'react-icons/io'

const AddTodoInput = () => {
  const [newTodo, setNewTodo] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const { create } = useTodosActions()

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
    if (newTodo.trim() === '') return
    create(newTodo)
    setNewTodo('')
  }

  return (
    <form onSubmit={handleAdd} className="flex gap-4">
      <input
        type="text"
        placeholder="Add new task here"
        className="px-2 py-1 ring-1 ring-gray-200 rounded-md "
        value={newTodo}
        ref={inputRef}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            requestAnimationFrame(() => {
              inputRef.current?.blur()
            })
          }
        }}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button className="btn bg-amber-400" type="submit">
        <IoMdAdd size={20} />
      </button>
    </form>
  )
}

export default AddTodoInput
