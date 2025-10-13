import { useTodoLength } from '../hooks/useTodoLength'

const TodoHeader = () => {
  const { data: todosLength = 0 } = useTodoLength()

  return (
    <h1 className="font-bold">
      <span>Task List</span>
      <span
        className={[
          'text-gray-500 caret-transparent',
          todosLength === 0 && 'hidden',
        ].join(' ')}
      >
        : {todosLength} tasks
      </span>
    </h1>
  )
}
export default TodoHeader
