import React, { useState, useRef, useEffect } from 'react'
import {
  Plus,
  Calendar,
  Tag,
  CornerDownLeft,
} from 'lucide-react'
import { useTodo } from '../context/TodoContext'
import { Priority } from '../types/todo'

interface QuickAddTaskProps {
  autoFocus?: boolean
  onSubmitted?: () => void
}

export const QuickAddTask: React.FC<QuickAddTaskProps> = ({ autoFocus, onSubmitted }) => {
  const { addTodo, categories, selectedCategory } = useTodo()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [categoryId, setCategoryId] = useState<string>(
    selectedCategory || categories[0]?.id || ''
  )
  const [dueDate, setDueDate] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectedCategory) {
      setCategoryId(selectedCategory)
    }
  }, [selectedCategory])

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    addTodo({
      title,
      priority,
      categoryId: categoryId || categories[0]?.id,
      dueDate: dueDate || undefined,
    })

    setTitle('')
    setDueDate('')
    setPriority('medium')
    setIsExpanded(false)
    onSubmitted?.()
  }

  const setQuickDate = (type: 'today' | 'tomorrow' | 'clear') => {
    if (type === 'clear') {
      setDueDate('')
      return
    }
    const d = new Date()
    if (type === 'tomorrow') {
      d.setDate(d.getDate() + 1)
    }
    setDueDate(d.toISOString().split('T')[0])
  }

  const priorityColors: Record<Priority, { label: string; bg: string; text: string }> = {
    low: { label: 'Low', bg: 'bg-blue-500/10 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400' },
    medium: { label: 'Medium', bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400' },
    high: { label: 'High', bg: 'bg-rose-500/10 dark:bg-rose-500/20', text: 'text-rose-600 dark:text-rose-400' },
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-xl border transition-all duration-200 bg-white dark:bg-zinc-900 ${
        isExpanded
          ? 'border-zinc-300 dark:border-zinc-700 shadow-md ring-1 ring-zinc-200 dark:ring-zinc-800'
          : 'border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm'
      }`}
    >
      <div className="p-2 sm:p-2.5 flex items-center gap-2">
        <div className="text-zinc-400 pl-1">
          <Plus className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="Add a new task... (press Enter to save)"
          className="flex-1 bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
        />

        {title.trim() && (
          <button
            type="submit"
            className="px-2.5 py-1 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-1 shadow-sm"
          >
            <span>Add</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Expanded Meta Bar */}
      {isExpanded && (
        <div className="px-3 pb-2.5 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-wrap items-center justify-between gap-2 text-xs animate-slide-down">
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Selector */}
            <div className="flex items-center gap-1">
              {(['low', 'medium', 'high'] as Priority[]).map(p => {
                const config = priorityColors[p]
                const isSelected = priority === p
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                      isSelected
                        ? `${config.bg} ${config.text} ring-1 ring-inset ring-current`
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {config.label}
                  </button>
                )
              })}
            </div>

            <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />

            {/* Category Selector */}
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="bg-transparent text-xs text-zinc-600 dark:text-zinc-300 focus:outline-none cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id} className="dark:bg-zinc-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />

            {/* Due Date Presets */}
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-400 mr-0.5" />
              <button
                type="button"
                onClick={() => setQuickDate('today')}
                className="px-1.5 py-0.5 text-[11px] rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setQuickDate('tomorrow')}
                className="px-1.5 py-0.5 text-[11px] rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Tomorrow
              </button>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="text-[11px] bg-transparent text-zinc-600 dark:text-zinc-300 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  )
}
