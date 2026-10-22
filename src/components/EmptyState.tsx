import React from 'react'
import {
  CheckCircle2,
  Calendar,
  AlertCircle,
  FolderOpen,
  Search,
  Sparkles,
} from 'lucide-react'
import { ActiveView } from '../types/todo'

interface EmptyStateProps {
  view: ActiveView
  isSearching?: boolean
  onAction?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({ view, isSearching, onAction }) => {
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center text-zinc-400 mb-3">
          <Search className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
          No matching tasks found
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mt-1">
          Try searching for a different keyword or clear your filters to see more tasks.
        </p>
      </div>
    )
  }

  const getConfig = () => {
    switch (view) {
      case 'today':
        return {
          icon: Calendar,
          title: 'All clear for today',
          desc: 'You have no tasks scheduled for today. Enjoy your day or plan ahead!',
          actionText: 'Plan a task for today',
        }
      case 'upcoming':
        return {
          icon: Calendar,
          title: 'No upcoming tasks',
          desc: 'Your future schedule is completely open. Add tasks with future deadlines.',
          actionText: 'Schedule a task',
        }
      case 'completed':
        return {
          icon: CheckCircle2,
          title: 'No completed tasks yet',
          desc: 'Finish tasks by clicking their checkbox to track your accomplishments.',
          actionText: undefined,
        }
      case 'high-priority':
        return {
          icon: AlertCircle,
          title: 'No urgent items',
          desc: 'Great job keeping critical tasks under control!',
          actionText: 'Add high-priority task',
        }
      case 'category':
        return {
          icon: FolderOpen,
          title: 'This category is empty',
          desc: 'Assign tasks to this category to organize your projects neatly.',
          actionText: 'Add task here',
        }
      default:
        return {
          icon: Sparkles,
          title: 'Everything is done',
          desc: 'Your workspace is clear. Capture a new thought or enjoy the calm.',
          actionText: 'Create a new task',
        }
    }
  }

  const { icon: Icon, title, desc, actionText } = getConfig()

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/50 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-3.5 shadow-sm">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
        {title}
      </h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mt-1 leading-relaxed">
        {desc}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm focus-ring"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}
