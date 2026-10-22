import React, { useRef } from 'react'
import {
  Menu,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Trash2,
  X,
} from 'lucide-react'
import { useTodo } from '../context/TodoContext'
import { Priority, SortBy } from '../types/todo'

interface HeaderProps {
  onToggleSidebar: () => void
  onOpenStats: () => void
  isCompact: boolean
  onToggleCompact: () => void
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isCompact,
  onToggleCompact,
}) => {
  const {
    activeView,
    selectedCategory,
    categories,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    clearCompleted,
    todos,
  } = useTodo()

  const searchInputRef = useRef<HTMLInputElement>(null)

  const getViewTitle = () => {
    switch (activeView) {
      case 'today':
        return 'Today'
      case 'upcoming':
        return 'Upcoming'
      case 'completed':
        return 'Completed'
      case 'high-priority':
        return 'High Priority'
      case 'category': {
        const cat = categories.find(c => c.id === selectedCategory)
        return cat ? cat.name : 'Category'
      }
      default:
        return 'All Tasks'
    }
  }

  const completedCount = todos.filter(t => t.completed).length

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-zinc-50/80 dark:bg-zinc-950/80 border-b border-zinc-200/80 dark:border-zinc-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Mobile hamburger & View title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg lg:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              {getViewTitle()}
              {activeView === 'category' && selectedCategory && (
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{
                    backgroundColor:
                      categories.find(c => c.id === selectedCategory)?.color || '#6366f1',
                  }}
                />
              )}
            </h1>
          </div>
        </div>

        {/* Right: Search, Filter, Sort & View controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64 sm:flex-initial">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full h-8 pl-9 pr-8 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus-ring shadow-sm"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                ⌘K
              </kbd>
            )}
          </div>

          {/* Priority filter */}
          <div className="relative">
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value as Priority | 'all')}
              className="h-8 pl-2.5 pr-7 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus-ring shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <SlidersHorizontal className="w-3 h-3 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortBy)}
              className="h-8 pl-2.5 pr-7 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus-ring shadow-sm appearance-none cursor-pointer"
            >
              <option value="order">Manual (Drag)</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="createdAt">Date Created</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort direction toggle */}
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm transition-colors"
            title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <span className="text-[10px] font-mono font-semibold">
              {sortDirection === 'asc' ? 'ASC' : 'DESC'}
            </span>
          </button>

          {/* Compact View toggle */}
          <button
            onClick={onToggleCompact}
            className={`h-8 px-2.5 flex items-center gap-1.5 rounded-lg border text-xs font-medium transition-colors shadow-sm ${
              isCompact
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
            title="Toggle dense view"
          >
            <span className="text-xs">Compact</span>
          </button>

          {/* Clear Completed action button */}
          {activeView === 'completed' && completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="h-8 px-2.5 flex items-center gap-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All ({completedCount})
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
