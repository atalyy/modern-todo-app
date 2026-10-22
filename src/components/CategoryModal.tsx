import React, { useState } from 'react'
import { X, Plus, Trash2, Tag } from 'lucide-react'
import { useTodo } from '../context/TodoContext'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

const PRESET_COLORS = [
  '#6366f1', // Indigo
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#84cc16', // Lime
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#a855f7', // Purple
  '#71717a', // Zinc
]

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose }) => {
  const { categories, addCategory, deleteCategory, todos } = useTodo()
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])

  if (!isOpen) return null

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    addCategory(name.trim(), selectedColor)
    setName('')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-zinc-500" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Manage Categories
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Create Category Form */}
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1.5">
                New Category Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., Marketing, Health..."
                  className="flex-1 h-9 px-3 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus-ring"
                />
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="h-9 px-3 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Color Swatches */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1.5">
                Label Color
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      selectedColor === color
                        ? 'ring-2 ring-offset-2 ring-zinc-900 dark:ring-zinc-100 dark:ring-offset-zinc-900 scale-110'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </form>

          {/* Existing Categories List */}
          <div>
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 block mb-2">
              Existing ({categories.length})
            </span>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {categories.map(cat => {
                const count = todos.filter(t => t.categoryId === cat.id).length
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/60"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        ({count} task{count === 1 ? '' : 's'})
                      </span>
                    </div>

                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1 text-zinc-400 hover:text-rose-500 rounded transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-100 dark:border-zinc-800 text-right">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
