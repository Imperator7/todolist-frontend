import TodoList from '../components/TodoList'
import AddTodoInput from '../components/AddTodoInput'
import TodoHeader from '../components/TodoHeader'

const Todo = () => {
  return (
    <div className="flex flex-col mx-auto gap-4 p-4 bg-white/80 rounded-2xl w-full max-w-[800px] ring-1 ring-black/25">
      <TodoHeader />
      <AddTodoInput />
      <TodoList />
    </div>
  )
}
export default Todo
