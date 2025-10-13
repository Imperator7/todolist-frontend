import './App.css'
import Todo from './features/todos/layout/Todo'
import { Toaster } from 'sonner'

function App() {
  return (
    <div className="w-full min-h-dvh bg-amber-50 p-4">
      <Todo />
      <Toaster position="bottom-right" richColors closeButton duration={4000} />
    </div>
  )
}

export default App
