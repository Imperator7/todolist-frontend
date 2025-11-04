import { vi, beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import AddTodoInput from './AddTodoInput'

const createMock = vi.fn()

vi.mock('../hooks/queryHooks', () => ({
  useTodosActions: () => ({ create: createMock }),
}))

describe('Test AddTodoInput component', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    render(<AddTodoInput />)
  })

  it('has correct placeholder', () => {
    expect(
      screen.getByPlaceholderText(/Add new task here/i)
    ).toBeInTheDocument()
  })

  it('updates value and counter when typing', async () => {
    const input = screen.getByPlaceholderText(/Add new task here/i)

    await user.type(input, 'hello')
    expect(input).toHaveValue('hello')

    expect(screen.getByText('05')).toBeInTheDocument()
    expect(screen.getByText('|20')).toBeInTheDocument()
  })

  it('idle state: counter has white color', () => {
    const counter = screen.getByTestId('char-counter')
    expect(counter).not.toHaveClass('text-amber-400', 'text-red-400')
  })

  it('focused & empty: counter has yellow color', async () => {
    const input = screen.getByPlaceholderText(/Add new task here/i)
    await user.click(input)
    expect(screen.getByText('00')).toHaveClass('text-amber-400')
  })
  it('focused & length > 20: counter has red color with 31 characters', async () => {
    const input = screen.getByPlaceholderText(/Add new task here/i)
    await user.click(input)
    await user.paste('a'.repeat(31))

    const counter = screen.getByText('31')
    expect(counter).toHaveClass('text-red-400')
    expect(input).toHaveClass('ring-2', 'ring-red-600')
  })
  it('Escape blurs the input', async () => {
    const input = screen.getByPlaceholderText(/Add new task here/i)
    await user.click(input)
    expect(input).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(input).not.toHaveFocus()
  })
  it('can Enter to submits the input and resets value', async () => {
    createMock.mockResolvedValueOnce(undefined)

    const input = screen.getByPlaceholderText(/add new task here/i)

    await user.click(input)
    await user.paste('finish the job')
    await user.keyboard('{Enter}')

    expect(createMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledWith('finish the job')

    expect(input).toHaveValue('')
    expect(screen.getByTestId('char-counter')).toHaveTextContent('00')
  })
  it('can Click + button to submit the input and reset value', async () => {
    createMock.mockResolvedValueOnce(undefined)

    const input = screen.getByPlaceholderText(/add new task here/i)
    const submitBtn = screen.getByRole('button', { name: /submit add to do/i })

    await user.click(input)
    await user.paste('finish the job')
    await user.click(submitBtn)

    expect(createMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledWith('finish the job')

    expect(input).toHaveValue('')
    expect(screen.getByTestId('char-counter')).toHaveTextContent('00')
  })
})
