import { useRef, useState } from 'react'
import { useTodosActions } from '../hooks/queryHooks'
import { IoMdAdd } from 'react-icons/io'

const AddTodoInput = () => {
  const [newTodo, setNewTodo] = useState<string>('')
  const [focused, setFocused] = useState<boolean>(false)
  const [touched, setTouched] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { create } = useTodosActions()

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await create(newTodo)
      setNewTodo('')
      setTouched(false)
    } catch {
      return
    }
  }

  return (
    <form onSubmit={handleAdd} className="flex flex-wrap gap-4 ">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Add new task here"
          onFocus={() => {
            setTouched(true)
            setFocused(true)
          }}
          onBlur={() => setFocused(false)}
          className={[
            'px-2 py-1 ring-1 ring-gray-400 rounded-md',
            touched && newTodo.length > 20 && 'ring-2 ring-red-600',
          ].join(' ')}
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
        <span
          className={[
            'text-[0.7rem] tabular-nums text-gray-500 select-none',
            'absolute right-2 -top-2 bg-white px-0.5',
          ].join(' ')}
        >
          <span
            data-testid="char-counter"
            className={[
              touched && newTodo.length > 20 && 'text-red-400',
              focused && newTodo.length === 0 && 'text-amber-400',
            ].join(' ')}
          >
            {newTodo.length < 10 ? '0' + newTodo.length : newTodo.length}
          </span>
          |20
        </span>
      </div>
      <button
        aria-label="submit add to do"
        className="btn bg-amber-400"
        type="submit"
      >
        <IoMdAdd size={20} />
      </button>
    </form>
  )
}

export default AddTodoInput
