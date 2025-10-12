import { useEffect, useRef, useState } from 'react'
import { useTodosActions } from '../hooks/queryHooks'
import { CiEdit } from 'react-icons/ci'
import { RiDeleteBinFill, RiCheckFill, RiCloseFill } from 'react-icons/ri'
import { useTodoById } from '../hooks/useTodoById'

type TodoItemProps = { id: string }
const ICON_SIZE = 20

const TodoItem = ({ id }: TodoItemProps) => {
  const { data: todo, isPending, isError } = useTodoById(id)

  const { editTitle, toggleCompleted, remove } = useTodosActions()

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [inputTitle, setInputTitle] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (todo?.title) setInputTitle(todo?.title)
  }, [todo?.title])

  useEffect(() => {
    if (isEditing) {
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }, [isEditing])

  if (isPending && !todo) return <li>fetching</li>
  if (isError) return <li className="text-red-600">Failed to load this task</li>

  const title = todo?.title
  const completed = todo?.completed

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
            ref={inputRef}
            onChange={(e) => setInputTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleConfirm()
              } else if (e.key === 'Escape') {
                e.preventDefault()
                handleCancel()
              }
            }}
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

  function handleConfirm() {
    if (!title) return
    editTitle(id, inputTitle.trim())
    setInputTitle(title)
    setIsEditing(false)
  }

  function handleCancel() {
    if (!title) return
    setInputTitle(title)
    setIsEditing(false)
  }

  function handleToggleEdit() {
    setIsEditing(true)
  }

  function handleCheck() {
    toggleCompleted(id)
  }

  function handleDel() {
    remove(id)
  }
}

export default TodoItem
