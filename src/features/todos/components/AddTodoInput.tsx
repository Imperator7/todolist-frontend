import { useState } from 'react'

type AddTodoInputProps = {
  handleAddTodo: (title: string) => void
}

const AddTodoInput = ({ handleAddTodo }: AddTodoInputProps) => {
  const [newTodo, setNewTodo] = useState<string>('')

  const handleAdd = () => {
    handleAddTodo(newTodo)
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
