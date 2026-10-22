import { useEffect } from 'react'

interface ShortcutConfig {
  onSearch?: () => void
  onNewTask?: () => void
  onHelp?: () => void
  onToggleTheme?: () => void
  onEscape?: () => void
}

export const useKeyboardShortcuts = ({
  onSearch,
  onNewTask,
  onHelp,
  onToggleTheme,
  onEscape,
}: ShortcutConfig) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input, textarea, or contentEditable element
      const target = e.target as HTMLElement
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      if (e.key === 'Escape') {
        onEscape?.()
        return
      }

      // Cmd+K or Ctrl+K for search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onSearch?.()
        return
      }

      // If user is inside an input, don't trigger single-key shortcuts
      if (isInput) return

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        onNewTask?.()
      } else if (e.key === '/') {
        e.preventDefault()
        onSearch?.()
      } else if (e.key === '?') {
        e.preventDefault()
        onHelp?.()
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        onToggleTheme?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSearch, onNewTask, onHelp, onToggleTheme, onEscape])
}
