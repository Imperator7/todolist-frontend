import { useTodoLength } from '../hooks/useTodoLength'

const TodoHeader = () => {
  const { data: todosLength = 0 } = useTodoLength()

  const label = todosLength === 1 ? 'task' : 'tasks'

  return (
    <h1 className="font-bold">
      <span>Task List</span>
      <span
        data-testid="todo-counter"
        className={[
          'text-gray-500 caret-transparent',
          todosLength === 0 && 'hidden',
        ].join(' ')}
      >
        : {todosLength} {label}
      </span>
    </h1>
  )
}
export default TodoHeader
