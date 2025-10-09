import type { Todo, Todos } from '../schemas/todo'
import { useState, useEffect } from 'react'
import TodoItem from './TodoItem'
import AddTodoInput from './AddTodoInput'
import { http } from '../../../lib/http'

const TodoList = () => {
  const [todos, setTodos] = useState<Todos>([])

  useEffect(() => {
    ;(async () => {
      const res = await http('/api/todos')
      const body = await res.json()

      setTodos(body.data)
    })()
  }, [])

  const handleCheck = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const handleAddTodo = (title: string) => {
    if (title.trim() === '') return

    const newTask: Todo = {
      id: crypto.randomUUID(),
      title: title,
      completed: false,
    }

    setTodos((prev) => [...prev, newTask])
  }

  const handleEditTitle = (id: string, title: string) => {
    console.log(title)
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, title: title } : todo))
    )
  }

  const handleDel = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-white/80 rounded-2xl max-w-[400px] ring-1 ring-black/5">
      <h1 className="font-bold">
        <span>Task List</span>
        <span
          className={[
            'text-gray-500',

            todos.length === 0 && 'text-transparent',
          ].join(' ')}
        >
          : {todos.length} tasks
        </span>
      </h1>
      <AddTodoInput handleAddTodo={handleAddTodo} />
      {todos.length === 0 ? (
        <p>No task left</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              {...todo}
              handleCheck={handleCheck}
              handleEditTitle={handleEditTitle}
              handleDel={handleDel}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
export default TodoList
