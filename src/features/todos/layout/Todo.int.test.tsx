import {
  beforeEach,
  describe,
  expect,
  it,
  beforeAll,
  afterEach,
  afterAll,
} from 'vitest'
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Todo from './Todo'
import { TodosProvider } from '../context/todos.provider'
import { makeHandlers } from '../../../mocks/todos.handlers'
import { setupServer } from 'msw/node'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const mockServer = setupServer(
  ...makeHandlers({ delayMs: 50, initialTodos: [] })
)

beforeAll(() => mockServer.listen({ onUnhandledRequest: 'error' }))
afterEach(() =>
  mockServer.resetHandlers(...makeHandlers({ delayMs: 50, initialTodos: [] }))
)
afterAll(() => mockServer.close())

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <TodosProvider>{children}</TodosProvider>
    </QueryClientProvider>
  )
}

describe('Integration test: Todo layout', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    render(<Todo />, {
      wrapper: createWrapper(),
    })
  })

  it('loads and query from react query successfully', async () => {
    const loading = screen.getByText(/loading.../i)
    expect(loading).toBeInTheDocument()

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
  })

  it('success: posts, clears input, shows new item', async () => {
    const input = screen.getByPlaceholderText(/add new task here/i)
    await user.click(input)
    await user.paste('eat ramen')

    const submitBtn = screen.getByRole('button', {
      name: /submit add to do/i,
    })

    await user.click(submitBtn)

    await waitFor(() => {
      expect(input).toHaveValue('')
    })

    expect(await screen.queryByText(/eat ramen/i)).toBeInTheDocument()
    expect(screen.getByTestId('char-counter')).toHaveTextContent('00')
  })

  it('able to submit with {Enter}', async () => {
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

    const input = screen.getByPlaceholderText(/add new task here/i)
    const todoCount = screen.getByTestId('todo-counter')

    await user.click(input)
    await user.paste('go have a walk')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(input).toHaveValue('')
    })

    expect(await screen.queryByText(/go have a walk/i)).toBeInTheDocument()
    expect(screen.getByTestId('char-counter')).toHaveTextContent('00')
    expect(todoCount).toHaveTextContent(': 1 task')
  })

  it('update counter correctly both on the header and char counter', async () => {
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

    const input = screen.getByPlaceholderText(/add new task here/i)
    const charCounter = screen.getByTestId('char-counter')
    const todoCount = screen.getByTestId('todo-counter')

    expect(screen.queryByText(/eat ramen/i)).not.toBeInTheDocument()

    await user.click(input)
    await user.paste('find a dog')

    expect(charCounter).toHaveTextContent('10')

    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(input).toHaveTextContent('')
    })

    expect(screen.getByText(/find a dog/i)).toBeInTheDocument()
    expect(todoCount).toHaveTextContent(': 1 task')
  })

  it('delete tasks successfully', async () => {
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

    const input = screen.getByPlaceholderText(/add new task here/i)
    const submitBtn = screen.getByRole('button', { name: /submit add to do/i })

    const addTodo = async (title: string) => {
      await user.click(input)
      await user.clear(input)
      await user.paste(title)
      await user.click(submitBtn)

      await waitFor(() =>
        expect(screen.getByText(new RegExp(title, 'i'))).toBeInTheDocument()
      )
    }

    await waitFor(() => addTodo('work out'))
    await waitFor(() => addTodo('eat out'))

    const todos = await screen.findAllByRole('listitem')
    expect(todos).toHaveLength(2)

    const todoCounter = screen.getByTestId('todo-counter')
    expect(todoCounter).toHaveTextContent(': 2 tasks')

    let delBtns = await screen.findAllByRole('button', {
      name: /delete-task/i,
    })
    expect(delBtns).toHaveLength(2)
    await user.click(delBtns[0])

    await waitFor(async () => {
      const items = await screen.findAllByRole('listitem')
      expect(items).toHaveLength(1)
      expect(todoCounter).toHaveTextContent(': 1 task')
    })

    delBtns = await screen.findAllByRole('button', {
      name: /delete-task/i,
    })
    expect(delBtns).toHaveLength(1)
    await user.click(delBtns[0])

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)

    await waitFor(() => {
      expect(todoCounter).toHaveTextContent(': 0 task')
      expect(todoCounter).toHaveClass('hidden')
    })

    expect(screen.getByText(/no task left/i)).toBeInTheDocument()
  })

  it('edits a task successfully', async () => {
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

    const input = screen.getByPlaceholderText(/add new task here/i)
    const submitBtn = screen.getByRole('button', { name: /submit add to do/i })

    const addTodo = async (title: string) => {
      await user.click(input)
      await user.clear(input)
      await user.paste(title)
      await user.click(submitBtn)

      await waitFor(() =>
        expect(screen.getByText(new RegExp(title, 'i'))).toBeInTheDocument()
      )
    }

    await waitFor(() => addTodo('finish the job'))
    await waitFor(() => addTodo('send the application'))

    await waitFor(() => {
      expect(screen.getByText(/finish the job/i)).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText(/send the application/i)).toBeInTheDocument()
    })

    const editBtns = screen.getAllByRole('button', { name: /edit-task/i })
    expect(editBtns).toHaveLength(2)

    expect(screen.getByTestId('todo-counter')).toHaveTextContent(': 2 tasks')

    await user.click(editBtns[0])
    const editInput = screen.getByDisplayValue(/finish the job/i)
    expect(editInput).toBeInTheDocument()

    await user.clear(editInput)
    await user.type(editInput, 'polish the work')

    const confirmBtn = screen.getByRole('button', { name: /confirm-edit/i })

    await user.click(confirmBtn)

    expect(screen.queryByText(/finish the job/i)).not.toBeInTheDocument()
    expect(screen.getByText(/polish the work/i)).toBeInTheDocument()
  })
})
