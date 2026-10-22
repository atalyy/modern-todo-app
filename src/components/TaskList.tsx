import React, { useState } from 'react'
import { TaskCard } from './TaskCard'
import { EmptyState } from './EmptyState'
import { Todo } from '../types/todo'
import { useTodo } from '../context/TodoContext'

interface TaskListProps {
  isCompact: boolean
  onEditTask: (todo: Todo) => void
  onOpenNewTask: () => void
}

export const TaskList: React.FC<TaskListProps> = ({
  isCompact,
  onEditTask,
  onOpenNewTask,
}) => {
  const { filteredTodos, reorderTodos, activeView, searchQuery } = useTodo()
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const handleDragStart = (_e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggingId(id)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (_e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    if (draggingId && draggingId !== targetId) {
      reorderTodos(draggingId, targetId)
    }
    setDraggingId(null)
  }

  if (filteredTodos.length === 0) {
    return (
      <EmptyState
        view={activeView}
        isSearching={!!searchQuery.trim()}
        onAction={onOpenNewTask}
      />
    )
  }

  const uncompleted = filteredTodos.filter(t => !t.completed)
  const completed = filteredTodos.filter(t => t.completed)

  return (
    <div className="space-y-6">
      {/* Active Tasks */}
      {uncompleted.length > 0 && (
        <div className="space-y-2">
          {activeView === 'all' && completed.length > 0 && (
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                To Do ({uncompleted.length})
              </span>
            </div>
          )}
          <div className="space-y-2">
            {uncompleted.map(todo => (
              <TaskCard
                key={todo.id}
                todo={todo}
                isCompact={isCompact}
                onEdit={onEditTask}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragging={draggingId === todo.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks Section */}
      {completed.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Completed ({completed.length})
            </span>
          </div>
          <div className="space-y-2">
            {completed.map(todo => (
              <TaskCard
                key={todo.id}
                todo={todo}
                isCompact={isCompact}
                onEdit={onEditTask}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragging={draggingId === todo.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
