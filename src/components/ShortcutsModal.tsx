import React from 'react'
import { X, Keyboard } from 'lucide-react'

interface ShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const shortcuts = [
    { key: 'N', desc: 'Create a new task' },
    { key: '⌘ + K  or  /', desc: 'Search tasks instantly' },
    { key: 'D', desc: 'Toggle Dark / Light mode' },
    { key: '?', desc: 'Show keyboard shortcuts helper' },
    { key: 'Esc', desc: 'Close any active modal or drawer' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-zinc-500" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 divide-y divide-zinc-100 dark:divide-zinc-800">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 text-xs"
            >
              <span className="text-zinc-600 dark:text-zinc-400">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-400">
          Press <kbd className="font-mono font-medium">Esc</kbd> anytime to dismiss
        </div>
      </div>
    </div>
  )
}
