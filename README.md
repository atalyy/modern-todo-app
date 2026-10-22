# Kora — Modern & Minimalist Task Management

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6e9f18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A modern, lightning-fast, and keyboard-centric task management application inspired by Linear, Notion, and Todoist. Built with React 18, TypeScript, Tailwind CSS, and local-first persistence.

---

## ✨ Features

- **⚡ Fast & Fluid Workflow**
  - Instant inline task capture with priority, category, and deadline presets.
  - Native Drag-and-Drop task reordering with persistent order state.
  - Subtasks & checklists for managing multi-step workflows.

- **🎯 Smart Organization & Filters**
  - **Custom Categories**: Color-coded category tags (Work, Personal, Design, Engineering, etc.) with custom color pickers.
  - **Priority Levels**: Low, Medium, and High priority flags with clear visual hierarchy.
  - **Smart Views**: *All Tasks*, *Today*, *Upcoming*, *High Priority*, and *Completed*.
  - **Search & Sort**: Real-time fuzzy query filtering, priority sorting, due-date sorting, and alphabetical ordering.

- **📊 Velocity & Progress Analytics**
  - Dynamic completion rate progress bar.
  - 7-day velocity chart tracking created vs. completed tasks.
  - Overview cards displaying total, active, due today, and overdue metrics.

- **🎨 Premium UI / UX**
  - Clean, restrained typography using Inter and balanced spacing without gaudy gradients.
  - Full Dark Mode and Light Mode with system theme support and zero flicker.
  - Micro-interactions: haptic-style completion checkmarks, celebration confetti on task completion, and tactile focus states.
  - Compact & Standard view density toggle.

- **⌨️ Keyboard First Navigation**
  - `N`: Create new task
  - `⌘ + K` or `/`: Instant search palette
  - `D`: Toggle dark / light theme
  - `?`: Open keyboard shortcuts cheat sheet
  - `Esc`: Dismiss modals and drawers

- **💾 Local-First Persistence & Safety**
  - Automatic synchronization with browser `localStorage`.
  - Non-destructive actions: instant "Undo" toast notifications when deleting tasks.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | Declarative component architecture & modern hooks |
| **TypeScript** | Strict compile-time type safety across domain models |
| **Vite** | Blazing-fast development server & optimized production rollup bundle |
| **Tailwind CSS** | Utility-first styling with dark mode variant support |
| **Lucide Icons** | Crisp, consistent SVG iconography |
| **Vitest & React Testing Library** | Unit testing and critical flow verification |
| **Canvas Confetti** | Subtle celebratory micro-interactions |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `18.x` or higher
- npm `9.x` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/atalyy/modern-todo-app.git
   cd modern-todo-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts Vite local development server with HMR |
| `npm run build` | Runs TypeScript compilation (`tsc -b`) and Vite production bundle |
| `npm run test` | Executes unit test suite using Vitest |
| `npm run lint` | Runs ESLint analysis across all source files |
| `npm run preview` | Locally serves the optimized production build (`dist/`) |

---

## 📁 Project Architecture

```
modern-todo-app/
├── index.html               # Main HTML entry with Google Inter font
├── package.json             # Scripts & dependency definitions
├── tsconfig.json            # Strict TypeScript configuration
├── vite.config.ts           # Vite bundler & Vitest test config
├── tailwind.config.js       # Custom design tokens, dark mode, animations
├── src/
│   ├── __tests__/           # Vitest integration & unit tests
│   │   └── todo.test.tsx
│   ├── components/          # Modular UI components
│   │   ├── CategoryModal.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Header.tsx
│   │   ├── QuickAddTask.tsx
│   │   ├── ShortcutsModal.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskModal.tsx
│   │   ├── TaskStats.tsx
│   │   └── ToastContainer.tsx
│   ├── context/             # Context state management
│   │   ├── ThemeContext.tsx
│   │   └── TodoContext.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useKeyboardShortcuts.ts
│   │   └── useLocalStorage.ts
│   ├── types/               # Type declarations & domain interfaces
│   │   └── todo.ts
│   ├── utils/               # Initial state seed & helper algorithms
│   │   └── initialData.ts
│   ├── setupTests.ts        # Testing setup and DOM mocks
│   ├── index.css            # Tailwind directives & custom scrollbars
│   ├── App.tsx              # Application layout root
│   └── main.tsx             # React DOM bootstrapping
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
