import { Category, Todo } from '../types/todo'

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-work', name: 'Work & Projects', color: '#6366f1' },
  { id: 'cat-personal', name: 'Personal', color: '#3b82f6' },
  { id: 'cat-design', name: 'Design & UI/UX', color: '#ec4899' },
  { id: 'cat-dev', name: 'Engineering', color: '#10b981' },
  { id: 'cat-reading', name: 'Reading & Growth', color: '#f59e0b' },
]

const today = new Date().toISOString().split('T')[0]
const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split('T')[0]

export const INITIAL_TODOS: Todo[] = [
  {
    id: 'todo-1',
    title: 'Review production pull requests & architecture design',
    description: 'Check CI/CD pipelines, ensure zero hydration issues, and review database migration scripts.',
    completed: false,
    priority: 'high',
    categoryId: 'cat-work',
    dueDate: today,
    pinned: true,
    subtasks: [
      { id: 'sub-1', title: 'Audit authentication middleware', completed: true },
      { id: 'sub-2', title: 'Verify unit test coverage > 85%', completed: false },
      { id: 'sub-3', title: 'Merge staging release branch', completed: false },
    ],
    order: 0,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'todo-2',
    title: 'Craft sleek micro-interactions and keyboard shortcut engine',
    description: 'Add smooth state transitions, Cmd+K search quick-palette, and tactile check animations.',
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    priority: 'high',
    categoryId: 'cat-design',
    dueDate: today,
    pinned: false,
    subtasks: [
      { id: 'sub-4', title: 'Design SVG tick animation', completed: true },
      { id: 'sub-5', title: 'Implement soundless haptic feedback style', completed: true },
    ],
    order: 1,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'todo-3',
    title: 'Refactor state persistence with reactive LocalStorage hook',
    description: 'Ensure cross-tab synchronization and schema migration safety.',
    completed: false,
    priority: 'medium',
    categoryId: 'cat-dev',
    dueDate: tomorrowDate,
    pinned: false,
    subtasks: [],
    order: 2,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'todo-4',
    title: 'Read chapter 4 of "Designing Data-Intensive Applications"',
    description: 'Focus on encoding formats, protobuf schema evolution, and RPC semantics.',
    completed: false,
    priority: 'low',
    categoryId: 'cat-reading',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    pinned: false,
    subtasks: [],
    order: 3,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
]
