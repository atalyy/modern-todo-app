import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { App } from '../App'
import { ThemeProvider } from '../context/ThemeContext'
import { TodoProvider } from '../context/TodoContext'

const renderApp = () => {
  return render(
    <ThemeProvider>
      <TodoProvider>
        <App />
      </TodoProvider>
    </ThemeProvider>
  )
}

describe('Kora Modern Todo Application', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders application branding and initial views', () => {
    renderApp()
    expect(screen.getByText('Kora')).toBeInTheDocument()
    expect(screen.getAllByText('All Tasks').length).toBeGreaterThan(0)
  })

  it('allows creating a new task', async () => {
    renderApp()
    const input = screen.getByPlaceholderText(/Add a new task/i)

    fireEvent.change(input, { target: { value: 'Write unit tests for application' } })
    fireEvent.submit(input.closest('form')!)

    expect(screen.getByText('Write unit tests for application')).toBeInTheDocument()
  })

  it('toggles task completion status', async () => {
    renderApp()
    const input = screen.getByPlaceholderText(/Add a new task/i)
    fireEvent.change(input, { target: { value: 'Test completion toggle' } })
    fireEvent.submit(input.closest('form')!)

    const taskTitle = screen.getByText('Test completion toggle')
    expect(taskTitle).toBeInTheDocument()

    const card = taskTitle.closest('.group')!
    const checkbox = within(card as HTMLElement).getByRole('button', {
      name: /Mark task as complete/i,
    })
    expect(checkbox).toBeInTheDocument()

    fireEvent.click(checkbox)

    // After clicking, the task should now be completed
    const updatedCard = screen.getByText('Test completion toggle').closest('.group')!
    const completedCheckbox = within(updatedCard as HTMLElement).getByRole('button', {
      name: /Mark task as incomplete/i,
    })
    expect(completedCheckbox).toBeInTheDocument()
  })

  it('filters tasks based on search query', async () => {
    renderApp()
    const searchInput = screen.getByPlaceholderText(/Search tasks/i)

    fireEvent.change(searchInput, { target: { value: 'Non-existent task search term 12345' } })
    expect(screen.getByText('No matching tasks found')).toBeInTheDocument()

    fireEvent.change(searchInput, { target: { value: '' } })
    expect(screen.queryByText('No matching tasks found')).not.toBeInTheDocument()
  })
})
