import { useState } from 'react'
import { useTodosActions } from '../hooks/queryHooks'

const AddTodoInput = () => {
  const [newTodo, setNewTodo] = useState<string>('')

  const { create } = useTodosActions()

  const handleAdd = async () => {
    if (newTodo.trim() === '') return
    create(newTodo)
    setNewTodo('')
  }

  return (
    <div className="flex gap-4">
      <input
        type="text"
        placeholder="Add new task here"
        className="px-2 py-1 ring-1 ring-gray-200 rounded-md "
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button className="btn bg-amber-400" onClick={handleAdd}>
        Add
      </button>
    </div>
  )
}

export default AddTodoInput
