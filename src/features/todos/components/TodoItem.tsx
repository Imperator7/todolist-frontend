import { useEffect, useState } from 'react'
import type { Todo } from '../schemas/todo'
import { useTodosActions } from '../hooks/queryHooks'
import { CiEdit } from 'react-icons/ci'
import { RiDeleteBinFill, RiCheckFill, RiCloseFill } from 'react-icons/ri'

type TodoItemProps = Todo

const ICON_SIZE = 20

const TodoItem = ({ id, title, completed }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [inputTitle, setInputTitle] = useState<string>(title)

  const TodosService = useTodosActions()

  const handleConfirm = async () => {
    TodosService.editTitle(id, inputTitle)
    setIsEditing(!isEditing)
    setInputTitle(title)
  }

  const handleCancel = () => {
    setInputTitle(title)
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

  useEffect(() => {
    if (title) setInputTitle(title)
  }, [title])

  return (
    <li className="flex gap-4 justify-between w-full ">
      <div className="flex gap-2 items-center max-w-50 md:max-w-150">
        <input
          type="checkbox"
          name="completed"
          checked={completed}
          onChange={handleCheck}
          className=" accent-amber-200 caret-transparent"
        />
        {isEditing ? (
          <input
            type="text"
            className="ring-1 ring-gray-700 rounded-md p-1"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
          />
        ) : (
          <p
            className={[
              'text-xl text-center break-words w-full',
              completed && 'line-through',
            ].join(' ')}
          >
            {title}
          </p>
        )}
      </div>
      {isEditing ? (
        <div className="flex gap-1 md:gap-4 items-center">
          <button className="btn bg-green-600" onClick={handleConfirm}>
            <RiCheckFill size={ICON_SIZE} />
          </button>
          <button className="btn bg-red-600" onClick={handleCancel}>
            <RiCloseFill size={ICON_SIZE} />
          </button>
        </div>
      ) : (
        <div className="flex gap-1 md:gap-4 items-center">
          <button className="btn bg-blue-600" onClick={handleToggleEdit}>
            <CiEdit size={ICON_SIZE} />
          </button>
          <button className="btn bg-red-600" onClick={handleDel}>
            <RiDeleteBinFill size={ICON_SIZE} />
          </button>
        </div>
      )}
    </li>
  )
}
export default TodoItem
