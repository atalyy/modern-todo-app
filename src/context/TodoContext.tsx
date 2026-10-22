import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'
import confetti from 'canvas-confetti'
import {
  Todo,
  Category,
  Priority,
  ActiveView,
  SortBy,
  SortDirection,
  TodoStats,
  Toast,
} from '../types/todo'
import { INITIAL_CATEGORIES, INITIAL_TODOS } from '../utils/initialData'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface TodoContextType {
  todos: Todo[]
  categories: Category[]
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void
  selectedCategory: string | null
  setSelectedCategory: (id: string | null) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterPriority: Priority | 'all'
  setFilterPriority: (priority: Priority | 'all') => void
  sortBy: SortBy
  setSortBy: (sort: SortBy) => void
  sortDirection: SortDirection
  setSortDirection: (dir: SortDirection) => void
  toasts: Toast[]
  stats: TodoStats
  filteredTodos: Todo[]

  // Task actions
  addTodo: (data: {
    title: string
    description?: string
    priority?: Priority
    categoryId?: string
    dueDate?: string
  }) => Todo
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  toggleTodo: (id: string) => void
  togglePin: (id: string) => void
  reorderTodos: (sourceId: string, targetId: string) => void
  clearCompleted: () => void

  // Subtask actions
  addSubtask: (todoId: string, title: string) => void
  toggleSubtask: (todoId: string, subtaskId: string) => void
  deleteSubtask: (todoId: string, subtaskId: string) => void

  // Category actions
  addCategory: (name: string, color: string) => Category
  deleteCategory: (id: string) => void

  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('kora_todos_v1', INITIAL_TODOS)
  const [categories, setCategories] = useLocalStorage<Category[]>('kora_categories_v1', INITIAL_CATEGORIES)
  const [activeView, setActiveView] = useState<ActiveView>('all')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortBy>('order')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const newToast: Toast = { ...toast, id }
    setToasts(prev => [...prev, newToast])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addTodo = useCallback(
    (data: {
      title: string
      description?: string
      priority?: Priority
      categoryId?: string
      dueDate?: string
    }) => {
      const defaultCatId = categories[0]?.id || 'cat-personal'
      const newTodo: Todo = {
        id: `todo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: data.title.trim(),
        description: data.description?.trim(),
        completed: false,
        priority: data.priority || 'medium',
        categoryId: data.categoryId || defaultCatId,
        dueDate: data.dueDate,
        subtasks: [],
        order: todos.length,
        pinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setTodos(prev => [newTodo, ...prev])
      addToast({
        title: 'Task created',
        description: `"${newTodo.title}" has been added.`,
        type: 'success',
      })
      return newTodo
    },
    [categories, todos.length, setTodos, addToast]
  )

  const updateTodo = useCallback(
    (id: string, updates: Partial<Todo>) => {
      setTodos(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, ...updates, updatedAt: new Date().toISOString() }
            : item
        )
      )
    },
    [setTodos]
  )

  const deleteTodo = useCallback(
    (id: string) => {
      const target = todos.find(t => t.id === id)
      if (!target) return

      setTodos(prev => prev.filter(t => t.id !== id))

      addToast({
        title: 'Task deleted',
        description: `"${target.title}" was removed.`,
        type: 'info',
        undoAction: () => {
          setTodos(prev => [target, ...prev])
          addToast({
            title: 'Task restored',
            description: `"${target.title}" was recovered.`,
            type: 'success',
          })
        },
      })
    },
    [todos, setTodos, addToast]
  )

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos(prev => {
        const target = prev.find(t => t.id === id)
        if (!target) return prev
        const willComplete = !target.completed

        if (willComplete) {
          // Trigger confetti burst
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#22c55e', '#3b82f6', '#ec4899', '#f59e0b'],
              disableForReducedMotion: true,
            })
          } catch {
            // Ignore confetti in unsupported environments
          }
        }

        return prev.map(t =>
          t.id === id
            ? {
                ...t,
                completed: willComplete,
                completedAt: willComplete ? new Date().toISOString() : undefined,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      })
    },
    [setTodos]
  )

  const togglePin = useCallback(
    (id: string) => {
      setTodos(prev =>
        prev.map(t =>
          t.id === id ? { ...t, pinned: !t.pinned, updatedAt: new Date().toISOString() } : t
        )
      )
    },
    [setTodos]
  )

  const reorderTodos = useCallback(
    (sourceId: string, targetId: string) => {
      setTodos(prev => {
        const sourceIndex = prev.findIndex(t => t.id === sourceId)
        const targetIndex = prev.findIndex(t => t.id === targetId)
        if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
          return prev
        }

        const updated = [...prev]
        const [moved] = updated.splice(sourceIndex, 1)
        updated.splice(targetIndex, 0, moved)

        return updated.map((item, idx) => ({ ...item, order: idx }))
      })
    },
    [setTodos]
  )

  const clearCompleted = useCallback(() => {
    const completedCount = todos.filter(t => t.completed).length
    if (completedCount === 0) return

    setTodos(prev => prev.filter(t => !t.completed))
    addToast({
      title: 'Completed tasks cleared',
      description: `Removed ${completedCount} completed task${completedCount > 1 ? 's' : ''}.`,
      type: 'info',
    })
  }, [todos, setTodos, addToast])

  const addSubtask = useCallback(
    (todoId: string, title: string) => {
      if (!title.trim()) return
      const newSubtask = {
        id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: title.trim(),
        completed: false,
      }
      setTodos(prev =>
        prev.map(t =>
          t.id === todoId
            ? { ...t, subtasks: [...t.subtasks, newSubtask], updatedAt: new Date().toISOString() }
            : t
        )
      )
    },
    [setTodos]
  )

  const toggleSubtask = useCallback(
    (todoId: string, subtaskId: string) => {
      setTodos(prev =>
        prev.map(t =>
          t.id === todoId
            ? {
                ...t,
                subtasks: t.subtasks.map(s =>
                  s.id === subtaskId ? { ...s, completed: !s.completed } : s
                ),
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      )
    },
    [setTodos]
  )

  const deleteSubtask = useCallback(
    (todoId: string, subtaskId: string) => {
      setTodos(prev =>
        prev.map(t =>
          t.id === todoId
            ? {
                ...t,
                subtasks: t.subtasks.filter(s => s.id !== subtaskId),
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      )
    },
    [setTodos]
  )

  const addCategory = useCallback(
    (name: string, color: string) => {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        color,
      }
      setCategories(prev => [...prev, newCat])
      addToast({
        title: 'Category created',
        description: `"${newCat.name}" is now available.`,
        type: 'success',
      })
      return newCat
    },
    [setCategories, addToast]
  )

  const deleteCategory = useCallback(
    (id: string) => {
      setCategories(prev => prev.filter(c => c.id !== id))
      if (selectedCategory === id) {
        setSelectedCategory(null)
      }
      addToast({
        title: 'Category deleted',
        type: 'info',
      })
    },
    [selectedCategory, setCategories, addToast]
  )

  // Compute Statistics
  const stats = useMemo<TodoStats>(() => {
    const total = todos.length
    const completed = todos.filter(t => t.completed).length
    const pending = total - completed
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)

    const todayStr = new Date().toISOString().split('T')[0]
    const dueToday = todos.filter(t => !t.completed && t.dueDate === todayStr).length
    const overdue = todos.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr).length

    // Last 7 days breakdown
    const now = new Date()
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dailyBreakdown = []
    let completedThisWeek = 0

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayName = days[d.getDay()]

      const completedCount = todos.filter(t => {
        if (!t.completedAt) return false
        return t.completedAt.split('T')[0] === dateStr
      }).length

      const createdCount = todos.filter(t => {
        return t.createdAt.split('T')[0] === dateStr
      }).length

      completedThisWeek += completedCount
      dailyBreakdown.push({
        day: dayName,
        date: dateStr,
        completed: completedCount,
        created: createdCount,
      })
    }

    return {
      total,
      completed,
      pending,
      completionRate,
      dueToday,
      overdue,
      completedThisWeek,
      dailyBreakdown,
    }
  }, [todos])

  // Filtered and Sorted todos
  const filteredTodos = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]

    return todos
      .filter(todo => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchTitle = todo.title.toLowerCase().includes(q)
          const matchDesc = todo.description?.toLowerCase().includes(q)
          const matchSubtask = todo.subtasks.some(s => s.title.toLowerCase().includes(q))
          if (!matchTitle && !matchDesc && !matchSubtask) return false
        }

        // Priority filter
        if (filterPriority !== 'all' && todo.priority !== filterPriority) {
          return false
        }

        // Active View
        if (activeView === 'today') {
          return todo.dueDate === todayStr
        }
        if (activeView === 'upcoming') {
          return !!todo.dueDate && todo.dueDate > todayStr
        }
        if (activeView === 'completed') {
          return todo.completed
        }
        if (activeView === 'high-priority') {
          return todo.priority === 'high'
        }
        if (activeView === 'category') {
          return selectedCategory ? todo.categoryId === selectedCategory : true
        }

        return true
      })
      .sort((a, b) => {
        // Pinned tasks stay at top unless sorting completed
        if (activeView !== 'completed') {
          if (a.pinned && !b.pinned) return -1
          if (!a.pinned && b.pinned) return 1
        }

        let result = 0
        if (sortBy === 'order') {
          result = a.order - b.order
        } else if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          result = a.dueDate.localeCompare(b.dueDate)
        } else if (sortBy === 'priority') {
          const priorityWeights: Record<Priority, number> = { high: 3, medium: 2, low: 1 }
          result = priorityWeights[b.priority] - priorityWeights[a.priority]
        } else if (sortBy === 'alphabetical') {
          result = a.title.localeCompare(b.title)
        } else if (sortBy === 'createdAt') {
          result = b.createdAt.localeCompare(a.createdAt)
        }

        return sortDirection === 'asc' ? result : -result
      })
  }, [todos, searchQuery, filterPriority, activeView, selectedCategory, sortBy, sortDirection])

  return (
    <TodoContext.Provider
      value={{
        todos,
        categories,
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        filterPriority,
        setFilterPriority,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        toasts,
        stats,
        filteredTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        togglePin,
        reorderTodos,
        clearCompleted,
        addSubtask,
        toggleSubtask,
        deleteSubtask,
        addCategory,
        deleteCategory,
        addToast,
        removeToast,
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export const useTodo = () => {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider')
  }
  return context
}
