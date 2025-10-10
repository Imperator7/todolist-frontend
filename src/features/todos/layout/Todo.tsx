import TodoList from '../components/TodoList'
import AddTodoInput from '../components/AddTodoInput'
import TodoHeader from '../components/TodoHeader'
import { useTodosData } from '../hooks/queryHooks'

const Todo = () => {
  const { todos, isLoading } = useTodosData()

  return (
    <div className="flex flex-col mx-auto gap-4 p-4 bg-white/80 rounded-2xl w-full max-w-[800px] ring-1 ring-black/5">
      <TodoHeader todos={todos} />
      <AddTodoInput />
      <TodoList todos={todos} isLoading={isLoading} />
    </div>
  )
}
export default Todo
