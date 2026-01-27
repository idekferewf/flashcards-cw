import type { IDeck } from "@/types"

export const decks: IDeck[] = [
  {
    id: 1,
    name: "JavaScript Basics",
    description: "Основы JavaScript: переменные, функции, условия",
    createdAt: "2024-01-05T10:15:00Z",
    updatedAt: "2024-01-10T09:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: 2,
    name: "TypeScript Core",
    description: "Типы, интерфейсы, дженерики",
    createdAt: "2024-01-07T11:00:00Z",
    updatedAt: "2024-01-12T08:30:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [
      { id: 1, label: "typescript", color: "info" },
      { id: 2, label: "javascript", color: "error" },
      { id: 3, label: "generics", color: "neutral" },
      { id: 4, label: "test", color: "warning" }
    ]
  },
  {
    id: 3,
    name: "Vue Fundamentals",
    description: "Composition API и реактивность",
    createdAt: "2024-01-10T14:45:00Z",
    updatedAt: "2024-01-15T16:10:00Z",
    isArchived: false,
    isFavorite: true,
    tags: [{ id: 1, label: "vue", color: "success" }]
  },
  {
    id: 4,
    name: "Nuxt 3",
    description: "SSR, routing, data fetching",
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-18T13:40:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "nuxt", color: "success" }]
  },
  {
    id: 5,
    name: "Frontend Architecture",
    description: "Модульность и масштабирование",
    createdAt: "2024-01-15T12:30:00Z",
    updatedAt: "2024-01-20T17:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "module", color: "error" }]
  },
  {
    id: 6,
    name: "HTML Semantics",
    createdAt: "2024-01-18T08:20:00Z",
    updatedAt: "2024-01-18T08:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "html", color: "neutral" }]
  },
  {
    id: 7,
    name: "CSS Layouts",
    description: "Flexbox и Grid",
    createdAt: "2024-01-20T10:10:00Z",
    updatedAt: "2024-01-22T11:45:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: 8,
    name: "Accessibility",
    description: "WCAG и a11y-практики",
    createdAt: "2024-01-22T09:50:00Z",
    updatedAt: "2024-01-25T14:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: 9,
    name: "SEO Basics",
    createdAt: "2024-01-25T15:30:00Z",
    updatedAt: "2024-01-25T15:30:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: 10,
    name: "State Management",
    description: "Pinia и управление состоянием",
    createdAt: "2024-01-28T11:15:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: 11,
    name: "REST APIs",
    description: "Принципы REST и HTTP",
    createdAt: "2024-02-02T09:00:00Z",
    updatedAt: "2024-02-05T12:10:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: 12,
    name: "Authentication",
    description: "JWT и OAuth",
    createdAt: "2024-02-04T14:40:00Z",
    updatedAt: "2024-02-07T16:30:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: 13,
    name: "Authorization",
    createdAt: "2024-02-06T10:00:00Z",
    updatedAt: "2024-02-06T10:00:00Z",
    isArchived: true,
    isFavorite: true,
    tags: []
  },
  {
    id: 14,
    name: "Testing Frontend",
    description: "Unit и e2e тесты",
    createdAt: "2024-02-08T13:25:00Z",
    updatedAt: "2024-02-12T09:45:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: 15,
    name: "Performance",
    description: "Оптимизация загрузки и рендера",
    createdAt: "2024-02-10T16:00:00Z",
    updatedAt: "2024-02-14T18:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  }
]
