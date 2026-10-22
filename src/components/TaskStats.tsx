import React from 'react'
import {
  X,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
} from 'lucide-react'
import { useTodo } from '../context/TodoContext'

interface TaskStatsProps {
  isOpen: boolean
  onClose: () => void
}

export const TaskStats: React.FC<TaskStatsProps> = ({ isOpen, onClose }) => {
  const { stats } = useTodo()

  if (!isOpen) return null

  // Calculate highest count for scaling the mini bar chart
  const maxDayCount = Math.max(
    ...stats.dailyBreakdown.map(d => Math.max(d.completed, d.created, 1))
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Productivity & Analytics
              </h2>
              <p className="text-xs text-zinc-400">
                Weekly velocity and task completion metrics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span className="text-[11px] font-medium">Completion</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {stats.completionRate}%
              </div>
              <span className="text-[10px] text-zinc-400">
                {stats.completed} of {stats.total} total
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span className="text-[11px] font-medium">Active</span>
                <Clock className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {stats.pending}
              </div>
              <span className="text-[10px] text-zinc-400">Pending tasks</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span className="text-[11px] font-medium">Due Today</span>
                <Flame className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {stats.dueToday}
              </div>
              <span className="text-[10px] text-zinc-400">Requires focus</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span className="text-[11px] font-medium">Overdue</span>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
                {stats.overdue}
              </div>
              <span className="text-[10px] text-zinc-400">Past deadline</span>
            </div>
          </div>

          {/* Progress Bar & Rate */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Overall Progress
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {stats.completionRate}%
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 ease-out"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {stats.completed} tasks accomplished
              </span>
              <span>{stats.pending} remaining</span>
            </div>
          </div>

          {/* Weekly Activity Breakdown (Last 7 Days) */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                  Last 7 Days Activity
                </h4>
                <p className="text-[11px] text-zinc-400">
                  {stats.completedThisWeek} tasks completed this past week
                </p>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                  <span className="text-zinc-500 dark:text-zinc-400">Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-zinc-300 dark:bg-zinc-600" />
                  <span className="text-zinc-500 dark:text-zinc-400">Created</span>
                </div>
              </div>
            </div>

            {/* Daily Bar Chart */}
            <div className="grid grid-cols-7 gap-2 items-end h-28 pt-4">
              {stats.dailyBreakdown.map(item => {
                const compHeight = Math.max(8, Math.round((item.completed / maxDayCount) * 70))
                const createHeight = Math.max(8, Math.round((item.created / maxDayCount) * 70))

                return (
                  <div key={item.date} className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="flex items-end gap-1 w-full justify-center">
                      {/* Completed Bar */}
                      <div
                        className="w-2.5 rounded-t bg-emerald-500 transition-all duration-300"
                        style={{ height: `${item.completed > 0 ? compHeight : 4}px` }}
                        title={`${item.completed} completed on ${item.day}`}
                      />
                      {/* Created Bar */}
                      <div
                        className="w-2.5 rounded-t bg-zinc-300 dark:bg-zinc-600 transition-all duration-300"
                        style={{ height: `${item.created > 0 ? createHeight : 4}px` }}
                        title={`${item.created} created on ${item.day}`}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-zinc-400">
                      {item.day}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
          <span>Kora Productivity Analytics</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
