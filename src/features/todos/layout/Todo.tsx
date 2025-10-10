import TodoList from '../components/TodoList'
import AddTodoInput from '../components/AddTodoInput'
import TodoHeader from '../components/TodoHeader'
import { useTodosData } from '../hooks/queryHooks'

const Todo = () => {
  const { todos, isLoading } = useTodosData()

  return (
    <div className="flex flex-col gap-4 p-4 bg-white/80 rounded-2xl max-w-[400px] ring-1 ring-black/5">
      <TodoHeader todos={todos} />
      <AddTodoInput />
      <TodoList todos={todos} isLoading={isLoading} />
    </div>
  )
}
export default Todo
