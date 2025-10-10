import type { Todos } from '../schemas/todo'

type TodoHeaderProps = {
  todos: Todos
}

const TodoHeader = ({ todos }: TodoHeaderProps) => {
  return (
    <h1 className="font-bold">
      <span>Task List</span>
      <span className={['text-gray-500', 'text-transparent'].join(' ')}>
        : {todos.length} tasks
      </span>
    </h1>
  )
}
export default TodoHeader
