import React from 'react'
import {
  Calendar,
  Check,
  Pin,
  GripVertical,
  Edit2,
  Trash2,
  CheckSquare,
} from 'lucide-react'
import { Todo } from '../types/todo'
import { useTodo } from '../context/TodoContext'

interface TaskCardProps {
  todo: Todo
  isCompact?: boolean
  onEdit: (todo: Todo) => void
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, id: string) => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>, id: string) => void
  onDrop?: (e: React.DragEvent<HTMLDivElement>, id: string) => void
  isDragging?: boolean
}

export const TaskCard: React.FC<TaskCardProps> = ({
  todo,
  isCompact = false,
  onEdit,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging = false,
}) => {
  const { toggleTodo, togglePin, deleteTodo, categories } = useTodo()

  const category = categories.find(c => c.id === todo.categoryId)

  // Due date status formatting
  const getDueDateInfo = () => {
    if (!todo.dueDate) return null
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

    if (todo.dueDate < today && !todo.completed) {
      return { label: 'Overdue', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50' }
    }
    if (todo.dueDate === today) {
      return { label: 'Today', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50' }
    }
    if (todo.dueDate === tomorrow) {
      return { label: 'Tomorrow', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50' }
    }

    const d = new Date(todo.dueDate)
    const formatted = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    return { label: formatted, color: 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700' }
  }

  const dueDateInfo = getDueDateInfo()

  const priorityBadge = {
    high: { label: 'High', dot: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
    medium: { label: 'Med', dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
    low: { label: 'Low', dot: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
  }[todo.priority]

  const completedSubtasks = todo.subtasks.filter(s => s.completed).length
  const totalSubtasks = todo.subtasks.length

  return (
    <div
      draggable
      onDragStart={e => onDragStart?.(e, todo.id)}
      onDragOver={e => onDragOver?.(e, todo.id)}
      onDrop={e => onDrop?.(e, todo.id)}
      className={`group relative rounded-xl border transition-all duration-150 ${
        isDragging
          ? 'opacity-40 border-dashed border-emerald-500 scale-[0.99]'
          : 'opacity-100 hover:shadow-sm'
      } ${
        todo.completed
          ? 'bg-zinc-50/60 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60'
          : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
      } ${isCompact ? 'p-2 sm:p-2.5' : 'p-3 sm:p-3.5'}`}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div
          className="mt-0.5 text-zinc-300 dark:text-zinc-600 cursor-grab active:cursor-grabbing hover:text-zinc-500 dark:hover:text-zinc-400 hidden sm:block shrink-0 transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Custom Animated Checkbox */}
        <button
          onClick={() => toggleTodo(todo.id)}
          className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all duration-200 ${
            todo.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/20'
              : 'border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-400 bg-white dark:bg-zinc-800'
          }`}
          aria-label={todo.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
        >
          {todo.completed && <Check className="w-3 h-3 stroke-[3] animate-scale-in" />}
        </button>

        {/* Content Area */}
        <div className="flex-1 min-w-0" onClick={() => onEdit(todo)}>
          <div className="flex items-center gap-2 cursor-pointer">
            <span
              className={`text-xs sm:text-sm font-medium tracking-tight truncate transition-colors ${
                todo.completed
                  ? 'line-through text-zinc-400 dark:text-zinc-500'
                  : 'text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {todo.title}
            </span>

            {todo.pinned && (
              <span title="Pinned to top">
                <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
              </span>
            )}
          </div>

          {/* Description (shown in standard view) */}
          {!isCompact && todo.description && (
            <p
              className={`mt-1 text-xs line-clamp-2 leading-relaxed cursor-pointer ${
                todo.completed
                  ? 'text-zinc-400/80 dark:text-zinc-600'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {todo.description}
            </p>
          )}

          {/* Metadata Badges */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
            {/* Category Pill */}
            {category && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium border border-zinc-200/60 dark:border-zinc-700/60">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </span>
            )}

            {/* Priority Pill */}
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium ${priorityBadge.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityBadge.dot}`} />
              {priorityBadge.label}
            </span>

            {/* Due Date Pill */}
            {dueDateInfo && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${dueDateInfo.color}`}
              >
                <Calendar className="w-3 h-3" />
                {dueDateInfo.label}
              </span>
            )}

            {/* Subtasks Progress */}
            {totalSubtasks > 0 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-400 text-[11px]">
                <CheckSquare className="w-3 h-3" />
                {completedSubtasks}/{totalSubtasks}
              </span>
            )}
          </div>
        </div>

        {/* Hover / Direct Actions */}
        <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => {
              e.stopPropagation()
              togglePin(todo.id)
            }}
            className={`p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
              todo.pinned ? 'text-amber-500 dark:text-amber-400' : ''
            }`}
            title={todo.pinned ? 'Unpin' : 'Pin to top'}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={e => {
              e.stopPropagation()
              onEdit(todo)
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={e => {
              e.stopPropagation()
              deleteTodo(todo.id)
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
