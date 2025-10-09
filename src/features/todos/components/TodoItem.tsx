import { useState } from 'react'
import type { Todo } from '../schemas/todo'
import { useTodosActions } from '../hooks/queryHooks'

type TodoItemProps = Todo

const TodoItem = ({ id, title, completed }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [newTitle, setNewTitle] = useState<string>(title)

  const TodosService = useTodosActions()

  const handleConfirm = () => {
    TodosService.editTitle(id, newTitle)
    setIsEditing(!isEditing)
    setNewTitle(title)
  }

  const handleCancel = () => {
    setNewTitle(title)
    setIsEditing(!isEditing)
  }

  const handleToggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleCheck = () => {
    TodosService.toggleCompleted(id)
  }

  const handleDel = () => {
    TodosService.remove(id)
  }

  return (
    <li className="flex flex-wrap gap-4 justify-between w-full ">
      <div className="flex gap-2 items-center">
        <input
          type="checkbox"
          name="completed"
          checked={completed}
          onChange={handleCheck}
          className="h-5 w-5 accent-amber-200"
        />
        {isEditing ? (
          <input
            type="text"
            className="ring-1 ring-gray-700 rounded-md p-1"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        ) : (
          <p
            className={[
              'text-xl text-center',
              completed && 'line-through',
            ].join(' ')}
          >
            {title}
          </p>
        )}
      </div>
      {isEditing ? (
        <div className="flex gap-4 items-center">
          <button className="btn bg-green-600" onClick={handleConfirm}>
            confirm
          </button>
          <button className="btn bg-red-600" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <button className="btn bg-green-600" onClick={handleToggleEdit}>
            Edit
          </button>
          <button className="btn bg-red-600" onClick={handleDel}>
            Del
          </button>
        </div>
      )}
    </li>
  )
}
export default TodoItem
