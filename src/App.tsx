import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { QuickAddTask } from './components/QuickAddTask'
import { TaskList } from './components/TaskList'
import { TaskModal } from './components/TaskModal'
import { TaskStats } from './components/TaskStats'
import { CategoryModal } from './components/CategoryModal'
import { ShortcutsModal } from './components/ShortcutsModal'
import { ToastContainer } from './components/ToastContainer'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useTheme } from './context/ThemeContext'
import { Todo } from './types/todo'

export function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const [activeEditingTask, setActiveEditingTask] = useState<Todo | null>(null)
  const [isStatsOpen, setIsStatsOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const [focusNewTaskInput, setFocusNewTaskInput] = useState(false)

  const { toggleTheme } = useTheme()

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => {
      const searchInput = document.querySelector('input[placeholder="Search tasks..."]') as HTMLInputElement | null
      searchInput?.focus()
    },
    onNewTask: () => {
      setFocusNewTaskInput(true)
      const input = document.querySelector('input[placeholder*="Add a new task"]') as HTMLInputElement | null
      input?.focus()
    },
    onHelp: () => setIsShortcutsOpen(prev => !prev),
    onToggleTheme: toggleTheme,
    onEscape: () => {
      setActiveEditingTask(null)
      setIsStatsOpen(false)
      setIsCategoryModalOpen(false)
      setIsShortcutsOpen(false)
      setIsSidebarOpen(false)
    },
  })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenNewTask={() => {
          setIsSidebarOpen(false)
          setFocusNewTaskInput(true)
          const input = document.querySelector('input[placeholder*="Add a new task"]') as HTMLInputElement | null
          input?.focus()
        }}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      {/* Main App Workspace */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          onOpenStats={() => setIsStatsOpen(true)}
          isCompact={isCompact}
          onToggleCompact={() => setIsCompact(prev => !prev)}
        />

        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-5">
          {/* Quick Add Bar */}
          <QuickAddTask
            autoFocus={focusNewTaskInput}
            onSubmitted={() => setFocusNewTaskInput(false)}
          />

          {/* Task List */}
          <TaskList
            isCompact={isCompact}
            onEditTask={task => setActiveEditingTask(task)}
            onOpenNewTask={() => {
              const input = document.querySelector('input[placeholder*="Add a new task"]') as HTMLInputElement | null
              input?.focus()
            }}
          />
        </main>
      </div>

      {/* Modals & Overlays */}
      <TaskModal
        isOpen={!!activeEditingTask}
        onClose={() => setActiveEditingTask(null)}
        task={activeEditingTask}
      />

      <TaskStats
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <ToastContainer />
    </div>
  )
}
