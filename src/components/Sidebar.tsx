import React from 'react'
import {
  CheckCircle2,
  Calendar,
  Inbox,
  Clock,
  AlertCircle,
  Plus,
  Moon,
  Sun,
  Keyboard,
  BarChart3,
  X,
  Sparkles,
} from 'lucide-react'
import { useTodo } from '../context/TodoContext'
import { useTheme } from '../context/ThemeContext'
import { ActiveView } from '../types/todo'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onOpenNewTask: () => void
  onOpenCategoryModal: () => void
  onOpenShortcuts: () => void
  onOpenStats: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onOpenNewTask,
  onOpenCategoryModal,
  onOpenShortcuts,
  onOpenStats,
}) => {
  const {
    activeView,
    setActiveView,
    categories,
    selectedCategory,
    setSelectedCategory,
    todos,
    stats,
  } = useTodo()

  const { isDark, toggleTheme } = useTheme()

  const todayStr = new Date().toISOString().split('T')[0]

  const navItems: { id: ActiveView; label: string; icon: React.ElementType; count: number }[] = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: Inbox,
      count: todos.filter(t => !t.completed).length,
    },
    {
      id: 'today',
      label: 'Today',
      icon: Calendar,
      count: todos.filter(t => !t.completed && t.dueDate === todayStr).length,
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: Clock,
      count: todos.filter(t => !t.completed && !!t.dueDate && t.dueDate > todayStr).length,
    },
    {
      id: 'high-priority',
      label: 'High Priority',
      icon: AlertCircle,
      count: todos.filter(t => !t.completed && t.priority === 'high').length,
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle2,
      count: todos.filter(t => t.completed).length,
    },
  ]

  const handleSelectNav = (viewId: ActiveView) => {
    setActiveView(viewId)
    setSelectedCategory(null)
    onClose()
  }

  const handleSelectCategory = (catId: string) => {
    setActiveView('category')
    setSelectedCategory(catId)
    onClose()
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 shadow-sm">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                  Kora
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  Pro
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-normal">
                Focus & Flow
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button */}
        <div className="p-3">
          <button
            onClick={onOpenNewTask}
            className="w-full h-9 px-3 flex items-center justify-between rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-xs font-medium transition-all shadow-sm focus-ring group"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
              New Task
            </span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 dark:bg-zinc-200 text-zinc-300 dark:text-zinc-700">
              N
            </kbd>
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* Main Views */}
          <div className="space-y-0.5">
            <span className="px-2.5 text-[11px] font-semibold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
              Views
            </span>
            <nav className="mt-1 space-y-0.5" aria-label="Views">
              {navItems.map(item => {
                const Icon = item.icon
                const isActive = activeView === item.id && !selectedCategory
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectNav(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? 'text-zinc-900 dark:text-zinc-100'
                            : 'text-zinc-400 dark:text-zinc-500'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.count > 0 && (
                      <span
                        className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold'
                            : 'text-zinc-400 dark:text-zinc-500'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Categories / Projects */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2.5">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
                Categories
              </span>
              <button
                onClick={onOpenCategoryModal}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Add Category"
                aria-label="Add Category"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <nav className="space-y-0.5" aria-label="Categories">
              {categories.map(cat => {
                const isActive = activeView === 'category' && selectedCategory === cat.id
                const count = todos.filter(
                  t => !t.completed && t.categoryId === cat.id
                ).length

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="truncate">{cat.name}</span>
                    </div>
                    {count > 0 && (
                      <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Analytics / Velocity Teaser */}
          <div className="px-2">
            <div
              onClick={onOpenStats}
              role="button"
              tabIndex={0}
              className="p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
                  Productivity
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {stats.completionRate}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                <span>{stats.completed} done</span>
                <span>{stats.pending} pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title={isDark ? 'Switch to Light mode (D)' : 'Switch to Dark mode (D)'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenShortcuts}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Keyboard Shortcuts (?)"
              aria-label="Keyboard Shortcuts"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenStats}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Insights
          </button>
        </div>
      </aside>
    </>
  )
}
