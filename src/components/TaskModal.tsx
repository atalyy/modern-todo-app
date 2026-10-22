import React, { useState, useEffect } from 'react'
import {
  X,
  Calendar,
  Tag,
  CheckCircle2,
  Trash2,
  Pin,
  Plus,
  Check,
} from 'lucide-react'
import { Todo, Priority } from '../types/todo'
import { useTodo } from '../context/TodoContext'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: Todo | null
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  const {
    updateTodo,
    deleteTodo,
    toggleTodo,
    togglePin,
    categories,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  } = useTodo()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [categoryId, setCategoryId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority)
      setCategoryId(task.categoryId)
      setDueDate(task.dueDate || '')
    }
  }, [task])

  if (!isOpen || !task) return null

  const handleTitleBlur = () => {
    if (title.trim() && title !== task.title) {
      updateTodo(task.id, { title: title.trim() })
    }
  }

  const handleDescriptionBlur = () => {
    if (description !== (task.description || '')) {
      updateTodo(task.id, { description: description.trim() })
    }
  }

  const handlePriorityChange = (p: Priority) => {
    setPriority(p)
    updateTodo(task.id, { priority: p })
  }

  const handleCategoryChange = (catId: string) => {
    setCategoryId(catId)
    updateTodo(task.id, { categoryId: catId })
  }

  const handleDueDateChange = (date: string) => {
    setDueDate(date)
    updateTodo(task.id, { dueDate: date || undefined })
  }

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubtaskTitle.trim()) return
    addSubtask(task.id, newSubtaskTitle.trim())
    setNewSubtaskTitle('')
  }

  const handleDelete = () => {
    deleteTodo(task.id)
    onClose()
  }

  const priorityOptions: { id: Priority; label: string; color: string }[] = [
    { id: 'low', label: 'Low', color: 'bg-blue-500' },
    { id: 'medium', label: 'Medium', color: 'bg-amber-500' },
    { id: 'high', label: 'High', color: 'bg-rose-500' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleTodo(task.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                task.completed
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{task.completed ? 'Completed' : 'Mark Complete'}</span>
            </button>

            <button
              onClick={() => togglePin(task.id)}
              className={`p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                task.pinned ? 'text-amber-500 fill-amber-500' : ''
              }`}
              title="Pin task"
            >
              <Pin className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-md text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              placeholder="Task title..."
              className="w-full text-base sm:text-lg font-semibold bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/60">
            {/* Priority */}
            <div>
              <span className="text-zinc-400 dark:text-zinc-500 block mb-1.5 font-medium">
                Priority
              </span>
              <div className="flex items-center gap-1.5">
                {priorityOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handlePriorityChange(opt.id)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                      priority === opt.id
                        ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-700'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${opt.color}`} />
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <span className="text-zinc-400 dark:text-zinc-500 block mb-1.5 font-medium">
                Category
              </span>
              <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700">
                <Tag className="w-3.5 h-3.5 text-zinc-400" />
                <select
                  value={categoryId}
                  onChange={e => handleCategoryChange(e.target.value)}
                  className="bg-transparent text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer w-full"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id} className="dark:bg-zinc-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div className="sm:col-span-2">
              <span className="text-zinc-400 dark:text-zinc-500 block mb-1.5 font-medium">
                Due Date
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-700">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => handleDueDateChange(e.target.value)}
                    className="bg-transparent text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
                  />
                </div>
                {dueDate && (
                  <button
                    onClick={() => handleDueDateChange('')}
                    className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    Clear date
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1.5">
              Description & Notes
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              placeholder="Add details, links, or context for this task..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus-ring resize-none"
            />
          </div>

          {/* Subtasks / Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                Checklist ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
              </span>
            </div>

            <div className="space-y-1.5 mb-3">
              {task.subtasks.map(sub => (
                <div
                  key={sub.id}
                  className="group flex items-center justify-between p-2 rounded-lg bg-zinc-50/70 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/60"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleSubtask(task.id, sub.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        sub.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-zinc-300 dark:border-zinc-700 hover:border-emerald-500'
                      }`}
                    >
                      {sub.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                    <span
                      className={`text-xs truncate ${
                        sub.completed
                          ? 'line-through text-zinc-400 dark:text-zinc-500'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {sub.title}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteSubtask(task.id, sub.id)}
                    className="p-1 text-zinc-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove item"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add subtask inline input */}
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={e => setNewSubtaskTitle(e.target.value)}
                placeholder="Add checklist item..."
                className="flex-1 h-8 px-3 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus-ring"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="h-8 px-3 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
          <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
          <span>Press Esc to close</span>
        </div>
      </div>
    </div>
  )
}
