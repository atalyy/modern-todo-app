import React from 'react'
import { CheckCircle2, AlertCircle, Info, X, RotateCcw } from 'lucide-react'
import { useTodo } from '../context/TodoContext'

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTodo()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            case 'error':
              return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            case 'warning':
              return <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            default:
              return <Info className="w-4 h-4 text-blue-500 shrink-0" />
          }
        }

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg animate-slide-down"
          >
            <div className="mt-0.5">{getIcon()}</div>

            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                {toast.title}
              </h5>
              {toast.description && (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                  {toast.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {toast.undoAction && (
                <button
                  onClick={() => {
                    toast.undoAction?.()
                    removeToast(toast.id)
                  }}
                  className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Undo</span>
                </button>
              )}

              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
