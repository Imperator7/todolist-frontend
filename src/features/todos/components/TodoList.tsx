import TodoItem from './TodoItem'
import AddTodoInput from './AddTodoInput'
import { useTodosData } from '../hooks/queryHooks'

const TodoList = () => {
  const { todos, isLoading } = useTodosData()

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
      <AddTodoInput />
      {isLoading ? (
        <p>Loading.....</p>
      ) : todos.length === 0 ? (
        <p>No task left</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todos.map((todo) => (
            <TodoItem key={todo.id} {...todo} />
          ))}
        </ul>
      )}
    </div>
  )
}
export default TodoList
