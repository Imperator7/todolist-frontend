import type { Todos } from '../schemas/todo'
import TodoItem from './TodoItem'

type TodoListProps = {
  todos: Todos
  isLoading: boolean
}

const TodoList = ({ todos, isLoading }: TodoListProps) => {
  return (
    <>
      {isLoading ? (
        <p>Loading.....</p>
      ) : todos.length === 0 ? (
        <p>No task left</p>
      ) : (
        <ul className="flex flex-col gap-2 overflow-y-auto pr-2 max-h-[75vh]">
          {todos.map((todo) => (
            <TodoItem key={todo.id} {...todo} />
          ))}
        </ul>
      )}
    </>
  )
}
export default TodoList
