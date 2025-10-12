import TodoItem from './TodoItem'
import { useTodosData } from '../hooks/queryHooks'

const TodoList = () => {
  const { todos, isPending } = useTodosData()

  if (isPending) return <p>Loading.....</p>
  if (todos.length === 0) return <p>No task left</p>

  return (
    <>
      <ul className="flex flex-col gap-2 overflow-y-auto pr-2 max-h-[75vh]">
        {todos.map((todo) => (
          <TodoItem key={todo.id} id={todo.id} />
        ))}
      </ul>
    </>
  )
}
export default TodoList
