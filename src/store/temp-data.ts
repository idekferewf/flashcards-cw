import { CardStatus, type ICard, type IDeck } from "@/types"

export const DecksTD: IDeck[] = [
  {
    id: "1",
    name: "JavaScript Basics",
    description: "Основы JavaScript: переменные, функции, условия",
    createdAt: "2024-01-05T10:15:00Z",
    updatedAt: "2024-01-10T09:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "2",
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
    id: "3",
    name: "Vue Fundamentals",
    description: "Composition API и реактивность",
    createdAt: "2024-01-10T14:45:00Z",
    updatedAt: "2024-01-15T16:10:00Z",
    isArchived: false,
    isFavorite: true,
    tags: [
      { id: 1, label: "vue", color: "success" },
      { id: 2, label: "javascript", color: "warning" }
    ]
  },
  {
    id: "4",
    name: "Nuxt 3",
    description: "SSR, routing, data fetching",
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-18T13:40:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "nuxt", color: "success" }]
  },
  {
    id: "5",
    name: "Frontend Architecture",
    description: "Модульность и масштабирование",
    createdAt: "2024-01-15T12:30:00Z",
    updatedAt: "2024-01-20T17:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "module", color: "error" }]
  },
  {
    id: "6",
    name: "HTML Semantics",
    createdAt: "2024-01-18T08:20:00Z",
    updatedAt: "2024-01-18T08:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "html", color: "neutral" }]
  },
  {
    id: "7",
    name: "CSS Layouts",
    description: "Flexbox и Grid",
    createdAt: "2024-01-20T10:10:00Z",
    updatedAt: "2024-01-22T11:45:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "8",
    name: "Accessibility",
    description: "WCAG и a11y-практики",
    createdAt: "2024-01-22T09:50:00Z",
    updatedAt: "2024-01-25T14:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "9",
    name: "SEO Basics",
    createdAt: "2024-01-25T15:30:00Z",
    updatedAt: "2024-01-25T15:30:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "10",
    name: "State Management",
    description: "Pinia и управление состоянием",
    createdAt: "2024-01-28T11:15:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "11",
    name: "REST APIs",
    description: "Принципы REST и HTTP",
    createdAt: "2024-02-02T09:00:00Z",
    updatedAt: "2024-02-05T12:10:00Z",
    isArchived: true,
    isFavorite: false,
    tags: [{ id: 1, label: "http", color: "info" }]
  },
  {
    id: "12",
    name: "Authentication",
    description: "JWT и OAuth",
    createdAt: "2024-02-04T14:40:00Z",
    updatedAt: "2024-02-07T16:30:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "13",
    name: "Authorization",
    createdAt: "2024-02-06T10:00:00Z",
    updatedAt: "2024-02-06T10:00:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "14",
    name: "Testing Frontend",
    description: "Unit и e2e тесты",
    createdAt: "2024-02-08T13:25:00Z",
    updatedAt: "2024-02-12T09:45:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "15",
    name: "Performance",
    description: "Оптимизация загрузки и рендера",
    createdAt: "2024-02-10T16:00:00Z",
    updatedAt: "2024-02-14T18:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  }
]

export const CardsTD: ICard[] = [
  {
    id: "1",
    deckId: "1",
    front: "Что такое переменная в JavaScript?",
    back: "Именованная область памяти для хранения данных, объявляется через var, let или const",
    tags: [
      { id: 1, label: "javascript", color: "info" },
      { id: 2, label: "basics", color: "neutral" }
    ],
    createdAt: "2024-01-06T11:20:00Z"
  },
  {
    id: "2",
    deckId: "1",
    front: "Чем let отличается от var?",
    back: "let имеет блочную область видимости, не всплывает (hoisting) с инициализацией undefined",
    createdAt: "2024-01-06T14:30:00Z"
  },
  {
    id: "3",
    deckId: "1",
    front: "Как объявить функцию в JavaScript?",
    back: "function имя() {}, const имя = function() {}, const имя = () => {}",
    createdAt: "2024-01-07T09:15:00Z"
  },
  {
    id: "4",
    deckId: "1",
    front: "Что такое hoisting (всплытие)?",
    back: "Механизм, при котором объявления переменных и функций перемещаются вверх своей области видимости",
    createdAt: "2024-01-07T16:45:00Z"
  },
  {
    id: "5",
    deckId: "1",
    front: "Что такое замыкание (closure)?",
    back: "Функция, которая запоминает свое лексическое окружение даже после выполнения внешней функции",
    tags: [
      { id: 1, label: "javascript", color: "info" },
      { id: 3, label: "closure", color: "warning" }
    ],
    createdAt: "2024-01-08T10:00:00Z"
  },
  {
    id: "6",
    deckId: "2",
    front: "Какие примитивные типы есть в TypeScript?",
    back: "string, number, boolean, null, undefined, symbol, bigint",
    createdAt: "2024-01-08T12:00:00Z"
  },
  {
    id: "7",
    deckId: "2",
    front: "Что такое interface в TypeScript?",
    back: "Способ описания структуры объекта, его свойств и методов",
    tags: [
      { id: 4, label: "typescript", color: "info" },
      { id: 5, label: "interface", color: "success" }
    ],
    createdAt: "2024-01-08T14:20:00Z"
  },
  {
    id: "8",
    deckId: "2",
    front: "Для чего используются дженерики (generics)?",
    back: "Для создания компонентов, работающих с разными типами, сохраняя типобезопасность",
    createdAt: "2024-01-09T11:30:00Z"
  },
  {
    id: "9",
    deckId: "2",
    front: "Чем type отличается от interface?",
    back: "interface можно расширять (extends) и имплементировать, type допускает union/intersection типов",
    createdAt: "2024-01-09T15:45:00Z"
  },
  {
    id: "10",
    deckId: "2",
    front: "Что такое Utility Types?",
    back: "Встроенные обертки для преобразования типов: Partial, Required, Pick, Omit и др.",
    tags: [
      { id: 4, label: "typescript", color: "info" },
      { id: 6, label: "utility", color: "neutral" }
    ],
    createdAt: "2024-01-10T09:30:00Z"
  },
  {
    id: "11",
    deckId: "3",
    front: "Что такое Composition API во Vue 3?",
    back: "Новый синтаксис для логической организации кода с помощью функций setup() и реактивных ref/computed",
    createdAt: "2024-01-11T13:10:00Z"
  },
  {
    id: "12",
    deckId: "3",
    front: "Как создать реактивную переменную в Composition API?",
    back: "Использовать ref() для примитивов и объектов, reactive() для объектов",
    createdAt: "2024-01-11T16:30:00Z"
  },
  {
    id: "13",
    deckId: "3",
    front: "Что такое computed свойство?",
    back: "Реактивное вычисляемое значение, которое кэшируется до изменения зависимостей",
    tags: [
      { id: 7, label: "vue", color: "success" },
      { id: 8, label: "reactivity", color: "info" }
    ],
    createdAt: "2024-01-12T10:45:00Z"
  },
  {
    id: "14",
    deckId: "3",
    front: "Как работает watch во Vue?",
    back: "Отслеживает изменения реактивных данных и выполняет callback при их изменении",
    createdAt: "2024-01-12T14:20:00Z"
  },
  {
    id: "15",
    deckId: "4",
    front: "Какие преимущества у Nuxt 3?",
    back: "Автоматический импорт, композиции, улучшенный рендеринг, поддержка Vue 3",
    createdAt: "2024-01-13T09:45:00Z"
  },
  {
    id: "16",
    deckId: "4",
    front: "Как работает SSR в Nuxt?",
    back: "Сервер рендерит HTML при первом запросе, затем клиент гидратирует приложение",
    createdAt: "2024-01-13T14:15:00Z"
  },
  {
    id: "17",
    deckId: "4",
    front: "Что такое Nuxt Layers?",
    back: "Механизм для создания переиспользуемых слоев с конфигурацией, компонентами и логикой",
    tags: [
      { id: 9, label: "nuxt", color: "success" },
      { id: 10, label: "architecture", color: "warning" }
    ],
    createdAt: "2024-01-14T11:00:00Z"
  },
  {
    id: "18",
    deckId: "5",
    front: "Что такое модульная архитектура?",
    back: "Разделение кода на независимые модули с четкими границами ответственности",
    createdAt: "2024-01-16T10:20:00Z"
  },
  {
    id: "19",
    deckId: "5",
    front: "Какие принципы SOLID применимы к фронтенду?",
    back: "Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion",
    tags: [
      { id: 11, label: "architecture", color: "error" },
      { id: 12, label: "solid", color: "info" }
    ],
    createdAt: "2024-01-16T14:45:00Z"
  },
  {
    id: "20",
    deckId: "5",
    front: "Что такое паттерн 'Композиция над наследованием'?",
    back: "Предпочтение композиции объектов через включение, а не наследования классов",
    createdAt: "2024-01-17T09:30:00Z"
  },
  {
    id: "21",
    deckId: "6",
    front: "Какие HTML-теги относятся к семантическим?",
    back: "header, nav, main, article, section, aside, footer, figure, time и др.",
    createdAt: "2024-01-19T11:00:00Z"
  },
  {
    id: "22",
    deckId: "6",
    front: "Для чего нужен тег <main>?",
    back: "Основное содержимое документа, уникальное для каждой страницы",
    tags: [
      { id: 13, label: "html", color: "neutral" },
      { id: 14, label: "semantics", color: "info" }
    ],
    createdAt: "2024-01-19T15:20:00Z"
  },
  {
    id: "23",
    deckId: "7",
    front: "В чем разница между Flexbox и Grid?",
    back: "Flexbox — одномерное выравнивание, Grid — двумерная сетка",
    createdAt: "2024-01-21T12:30:00Z"
  },
  {
    id: "24",
    deckId: "7",
    status: CardStatus.review,
    front: "Как центрировать элемент по вертикали и горизонтали в Flexbox?",
    back: "display: flex; justify-content: center; align-items: center;",
    createdAt: "2024-01-21T16:45:00Z"
  },
  {
    id: "25",
    deckId: "7",
    front: "Что такое CSS Grid области (grid-areas)?",
    status: CardStatus.relearning,
    back: "Именованные области в Grid-контейнере для позиционирования элементов",
    tags: [
      { id: 15, label: "css", color: "info" },
      { id: 16, label: "grid", color: "success" }
    ],
    createdAt: "2024-01-22T10:10:00Z"
  },
  {
    id: "26",
    deckId: "8",
    front: "Что такое WCAG?",
    back: "Web Content Accessibility Guidelines — рекомендации по доступности веб-контента",
    createdAt: "2024-01-23T10:45:00Z"
  },
  {
    id: "27",
    deckId: "8",
    front: "Для чего нужен атрибут aria-label?",
    back: "Для предоставления текстовой метки элементу, когда видимой подписи недостаточно",
    createdAt: "2024-01-23T14:30:00Z"
  },
  {
    id: "28",
    deckId: "8",
    front: "Какие уровни соответствия есть в WCAG?",
    back: "A (минимальный), AA (рекомендуемый), AAA (максимальный)",
    tags: [
      { id: 17, label: "accessibility", color: "warning" },
      { id: 18, label: "wcag", color: "info" }
    ],
    createdAt: "2024-01-24T09:15:00Z"
  },
  {
    id: "29",
    deckId: "9",
    front: "Что такое метатег description?",
    back: "HTML-тег, содержащий краткое описание страницы для поисковых систем",
    createdAt: "2024-01-26T14:20:00Z"
  },
  {
    id: "30",
    deckId: "9",
    front: "Как работает canonical URL?",
    back: "Указывает поисковым системам предпочтительную версию страницы при дублировании контента",
    createdAt: "2024-01-26T17:40:00Z"
  },
  {
    id: "31",
    deckId: "10",
    front: "Какие преимущества у Pinia перед Vuex?",
    back: "Типизация TypeScript, композиции, модульность, DevTools поддержка",
    createdAt: "2024-01-29T13:10:00Z"
  },
  {
    id: "32",
    deckId: "10",
    front: "Как создать store в Pinia?",
    back: "Использовать defineStore() с id и объектом/функцией конфигурации",
    tags: [
      { id: 19, label: "pinia", color: "success" },
      { id: 20, label: "state", color: "info" }
    ],
    createdAt: "2024-01-29T16:45:00Z"
  },
  {
    id: "33",
    deckId: "10",
    front: "Что такое actions в Pinia?",
    back: "Методы для инкапсуляции бизнес-логики и изменения состояния",
    createdAt: "2024-01-30T10:30:00Z"
  },
  {
    id: "34",
    deckId: "11",
    front: "Какие методы HTTP используются в REST?",
    back: "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
    createdAt: "2024-02-03T11:30:00Z"
  },
  {
    id: "35",
    deckId: "11",
    front: "Что такое статус-коды 2xx?",
    back: "Успешные запросы: 200 OK, 201 Created, 204 No Content",
    createdAt: "2024-02-03T15:20:00Z"
  },
  {
    id: "36",
    deckId: "12",
    front: "Из каких частей состоит JWT токен?",
    back: "Header (алгоритм), Payload (данные), Signature (подпись)",
    createdAt: "2024-02-05T15:40:00Z"
  },
  {
    id: "37",
    deckId: "12",
    front: "В чем отличие Access Token от Refresh Token?",
    back: "Access Token короткоживущий для запросов, Refresh Token долгоживущий для получения новых Access Token",
    tags: [
      { id: 21, label: "jwt", color: "warning" },
      { id: 22, label: "auth", color: "error" }
    ],
    createdAt: "2024-02-06T09:15:00Z"
  },
  {
    id: "38",
    deckId: "13",
    front: "Чем авторизация отличается от аутентификации?",
    back: "Аутентификация — проверка личности, авторизация — проверка прав доступа",
    createdAt: "2024-02-06T14:00:00Z"
  },
  {
    id: "39",
    deckId: "13",
    front: "Что такое RBAC?",
    back: "Role-Based Access Control — управление доступом на основе ролей",
    createdAt: "2024-02-07T11:45:00Z"
  },
  {
    id: "40",
    deckId: "14",
    front: "Какие бывают виды тестирования фронтенда?",
    back: "Unit-тесты, интеграционные, e2e, snapshot, визуальное",
    createdAt: "2024-02-09T10:15:00Z"
  },
  {
    id: "41",
    deckId: "14",
    front: "Что такое TDD?",
    back: "Test-Driven Development — разработка через тестирование: сначала тест, потом код",
    createdAt: "2024-02-09T16:30:00Z"
  },
  {
    id: "42",
    deckId: "14",
    front: "Чем Jest отличается от Vitest?",
    back: "Vitest быстрее, нативен для Vite, имеет лучшую поддержку ES модулей",
    tags: [
      { id: 23, label: "testing", color: "neutral" },
      { id: 24, label: "jest", color: "warning" }
    ],
    createdAt: "2024-02-10T13:20:00Z"
  },
  {
    id: "43",
    deckId: "14",
    front: "Что такое Mock в тестировании?",
    back: "Имитация реальных объектов или функций для изоляции тестируемого кода",
    createdAt: "2024-02-10T17:45:00Z"
  },
  {
    id: "44",
    deckId: "15",
    front: "Как измерить производительность сайта?",
    back: "Lighthouse, WebPageTest, Chrome DevTools Performance tab",
    createdAt: "2024-02-11T12:45:00Z"
  },
  {
    id: "45",
    deckId: "15",
    front: "Что такое First Contentful Paint (FCP)?",
    back: "Метрика, измеряющая время от начала загрузки до отображения первого контента",
    createdAt: "2024-02-11T17:20:00Z"
  },
  {
    id: "46",
    deckId: "15",
    front: "Как оптимизировать загрузку изображений?",
    back: "Использовать современные форматы (WebP), lazy loading, ресайз, CDN",
    createdAt: "2024-02-12T10:00:00Z"
  },
  {
    id: "47",
    deckId: "15",
    front: "Что такое tree shaking?",
    back: "Удаление неиспользуемого кода при сборке для уменьшения размера бандла",
    tags: [
      { id: 25, label: "performance", color: "error" },
      { id: 26, label: "optimization", color: "success" }
    ],
    createdAt: "2024-02-12T14:30:00Z"
  },
  {
    id: "48",
    deckId: "15",
    front: "Как работает code splitting?",
    back: "Разделение кода на чанки, которые загружаются по мере необходимости",
    createdAt: "2024-02-13T09:15:00Z"
  },
  {
    id: "49",
    deckId: "3",
    front: "Что такое Teleport во Vue 3?",
    back: "Компонент для рендеринга содержимого в другом месте DOM",
    createdAt: "2024-01-13T11:20:00Z"
  },
  {
    id: "50",
    deckId: "2",
    front: "Что такое декораторы в TypeScript?",
    back: "Специальный синтаксис для добавления метаданных и изменения поведения классов, методов и свойств",
    tags: [
      { id: 4, label: "typescript", color: "info" },
      { id: 27, label: "decorators", color: "warning" }
    ],
    createdAt: "2024-01-11T09:00:00Z"
  }
]

export const HeavyDecksTD: IDeck[] = [
  {
    id: "1",
    name: "JavaScript Basics",
    description: "Основы JavaScript: переменные, функции, условия",
    createdAt: "2024-01-05T10:15:00Z",
    updatedAt: "2024-01-10T09:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "2",
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
    id: "3",
    name: "Vue Fundamentals",
    description: "Composition API и реактивность",
    createdAt: "2024-01-10T14:45:00Z",
    updatedAt: "2024-01-15T16:10:00Z",
    isArchived: false,
    isFavorite: true,
    tags: [{ id: 1, label: "vue", color: "success" }]
  },
  {
    id: "4",
    name: "Nuxt 3",
    description: "SSR, routing, data fetching",
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-18T13:40:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "nuxt", color: "success" }]
  },
  {
    id: "5",
    name: "Frontend Architecture",
    description: "Модульность и масштабирование",
    createdAt: "2024-01-15T12:30:00Z",
    updatedAt: "2024-01-20T17:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "module", color: "error" }]
  },
  {
    id: "6",
    name: "HTML Semantics",
    createdAt: "2024-01-18T08:20:00Z",
    updatedAt: "2024-01-18T08:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "html", color: "neutral" }]
  },
  {
    id: "7",
    name: "CSS Layouts",
    description: "Flexbox и Grid",
    createdAt: "2024-01-20T10:10:00Z",
    updatedAt: "2024-01-22T11:45:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "8",
    name: "Accessibility",
    description: "WCAG и a11y-практики",
    createdAt: "2024-01-22T09:50:00Z",
    updatedAt: "2024-01-25T14:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "9",
    name: "SEO Basics",
    createdAt: "2024-01-25T15:30:00Z",
    updatedAt: "2024-01-25T15:30:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "10",
    name: "State Management",
    description: "Pinia и управление состоянием",
    createdAt: "2024-01-28T11:15:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "11",
    name: "REST APIs",
    description: "Принципы REST и HTTP",
    createdAt: "2024-02-02T09:00:00Z",
    updatedAt: "2024-02-05T12:10:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "12",
    name: "Authentication",
    description: "JWT и OAuth",
    createdAt: "2024-02-04T14:40:00Z",
    updatedAt: "2024-02-07T16:30:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "13",
    name: "Authorization",
    createdAt: "2024-02-06T10:00:00Z",
    updatedAt: "2024-02-06T10:00:00Z",
    isArchived: true,
    isFavorite: true,
    tags: []
  },
  {
    id: "14",
    name: "Testing Frontend",
    description: "Unit и e2e тесты",
    createdAt: "2024-02-08T13:25:00Z",
    updatedAt: "2024-02-12T09:45:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "15",
    name: "Performance",
    description: "Оптимизация загрузки и рендера",
    createdAt: "2024-02-10T16:00:00Z",
    updatedAt: "2024-02-14T18:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "1",
    name: "JavaScript Basics",
    description: "Основы JavaScript: переменные, функции, условия",
    createdAt: "2024-01-05T10:15:00Z",
    updatedAt: "2024-01-10T09:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "2",
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
    id: "3",
    name: "Vue Fundamentals",
    description: "Composition API и реактивность",
    createdAt: "2024-01-10T14:45:00Z",
    updatedAt: "2024-01-15T16:10:00Z",
    isArchived: false,
    isFavorite: true,
    tags: [{ id: 1, label: "vue", color: "success" }]
  },
  {
    id: "4",
    name: "Nuxt 3",
    description: "SSR, routing, data fetching",
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-18T13:40:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "nuxt", color: "success" }]
  },
  {
    id: "5",
    name: "Frontend Architecture",
    description: "Модульность и масштабирование",
    createdAt: "2024-01-15T12:30:00Z",
    updatedAt: "2024-01-20T17:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "module", color: "error" }]
  },
  {
    id: "6",
    name: "HTML Semantics",
    createdAt: "2024-01-18T08:20:00Z",
    updatedAt: "2024-01-18T08:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "html", color: "neutral" }]
  },
  {
    id: "7",
    name: "CSS Layouts",
    description: "Flexbox и Grid",
    createdAt: "2024-01-20T10:10:00Z",
    updatedAt: "2024-01-22T11:45:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "8",
    name: "Accessibility",
    description: "WCAG и a11y-практики",
    createdAt: "2024-01-22T09:50:00Z",
    updatedAt: "2024-01-25T14:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "9",
    name: "SEO Basics",
    createdAt: "2024-01-25T15:30:00Z",
    updatedAt: "2024-01-25T15:30:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "10",
    name: "State Management",
    description: "Pinia и управление состоянием",
    createdAt: "2024-01-28T11:15:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "11",
    name: "REST APIs",
    description: "Принципы REST и HTTP",
    createdAt: "2024-02-02T09:00:00Z",
    updatedAt: "2024-02-05T12:10:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "12",
    name: "Authentication",
    description: "JWT и OAuth",
    createdAt: "2024-02-04T14:40:00Z",
    updatedAt: "2024-02-07T16:30:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "13",
    name: "Authorization",
    createdAt: "2024-02-06T10:00:00Z",
    updatedAt: "2024-02-06T10:00:00Z",
    isArchived: true,
    isFavorite: true,
    tags: []
  },
  {
    id: "14",
    name: "Testing Frontend",
    description: "Unit и e2e тесты",
    createdAt: "2024-02-08T13:25:00Z",
    updatedAt: "2024-02-12T09:45:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "15",
    name: "Performance",
    description: "Оптимизация загрузки и рендера",
    createdAt: "2024-02-10T16:00:00Z",
    updatedAt: "2024-02-14T18:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "1",
    name: "JavaScript Basics",
    description: "Основы JavaScript: переменные, функции, условия",
    createdAt: "2024-01-05T10:15:00Z",
    updatedAt: "2024-01-10T09:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "2",
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
    id: "3",
    name: "Vue Fundamentals",
    description: "Composition API и реактивность",
    createdAt: "2024-01-10T14:45:00Z",
    updatedAt: "2024-01-15T16:10:00Z",
    isArchived: false,
    isFavorite: true,
    tags: [{ id: 1, label: "vue", color: "success" }]
  },
  {
    id: "4",
    name: "Nuxt 3",
    description: "SSR, routing, data fetching",
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-18T13:40:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "nuxt", color: "success" }]
  },
  {
    id: "5",
    name: "Frontend Architecture",
    description: "Модульность и масштабирование",
    createdAt: "2024-01-15T12:30:00Z",
    updatedAt: "2024-01-20T17:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "module", color: "error" }]
  },
  {
    id: "6",
    name: "HTML Semantics",
    createdAt: "2024-01-18T08:20:00Z",
    updatedAt: "2024-01-18T08:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "html", color: "neutral" }]
  },
  {
    id: "7",
    name: "CSS Layouts",
    description: "Flexbox и Grid",
    createdAt: "2024-01-20T10:10:00Z",
    updatedAt: "2024-01-22T11:45:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "8",
    name: "Accessibility",
    description: "WCAG и a11y-практики",
    createdAt: "2024-01-22T09:50:00Z",
    updatedAt: "2024-01-25T14:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "9",
    name: "SEO Basics",
    createdAt: "2024-01-25T15:30:00Z",
    updatedAt: "2024-01-25T15:30:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "10",
    name: "State Management",
    description: "Pinia и управление состоянием",
    createdAt: "2024-01-28T11:15:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "11",
    name: "REST APIs",
    description: "Принципы REST и HTTP",
    createdAt: "2024-02-02T09:00:00Z",
    updatedAt: "2024-02-05T12:10:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "12",
    name: "Authentication",
    description: "JWT и OAuth",
    createdAt: "2024-02-04T14:40:00Z",
    updatedAt: "2024-02-07T16:30:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "13",
    name: "Authorization",
    createdAt: "2024-02-06T10:00:00Z",
    updatedAt: "2024-02-06T10:00:00Z",
    isArchived: true,
    isFavorite: true,
    tags: []
  },
  {
    id: "14",
    name: "Testing Frontend",
    description: "Unit и e2e тесты",
    createdAt: "2024-02-08T13:25:00Z",
    updatedAt: "2024-02-12T09:45:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "15",
    name: "Performance",
    description: "Оптимизация загрузки и рендера",
    createdAt: "2024-02-10T16:00:00Z",
    updatedAt: "2024-02-14T18:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "1",
    name: "JavaScript Basics",
    description: "Основы JavaScript: переменные, функции, условия",
    createdAt: "2024-01-05T10:15:00Z",
    updatedAt: "2024-01-10T09:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "2",
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
    id: "3",
    name: "Vue Fundamentals",
    description: "Composition API и реактивность",
    createdAt: "2024-01-10T14:45:00Z",
    updatedAt: "2024-01-15T16:10:00Z",
    isArchived: false,
    isFavorite: true,
    tags: [{ id: 1, label: "vue", color: "success" }]
  },
  {
    id: "4",
    name: "Nuxt 3",
    description: "SSR, routing, data fetching",
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-18T13:40:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "nuxt", color: "success" }]
  },
  {
    id: "5",
    name: "Frontend Architecture",
    description: "Модульность и масштабирование",
    createdAt: "2024-01-15T12:30:00Z",
    updatedAt: "2024-01-20T17:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "module", color: "error" }]
  },
  {
    id: "6",
    name: "HTML Semantics",
    createdAt: "2024-01-18T08:20:00Z",
    updatedAt: "2024-01-18T08:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "html", color: "neutral" }]
  },
  {
    id: "7",
    name: "CSS Layouts",
    description: "Flexbox и Grid",
    createdAt: "2024-01-20T10:10:00Z",
    updatedAt: "2024-01-22T11:45:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "8",
    name: "Accessibility",
    description: "WCAG и a11y-практики",
    createdAt: "2024-01-22T09:50:00Z",
    updatedAt: "2024-01-25T14:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "9",
    name: "SEO Basics",
    createdAt: "2024-01-25T15:30:00Z",
    updatedAt: "2024-01-25T15:30:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "10",
    name: "State Management",
    description: "Pinia и управление состоянием",
    createdAt: "2024-01-28T11:15:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "11",
    name: "REST APIs",
    description: "Принципы REST и HTTP",
    createdAt: "2024-02-02T09:00:00Z",
    updatedAt: "2024-02-05T12:10:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "12",
    name: "Authentication",
    description: "JWT и OAuth",
    createdAt: "2024-02-04T14:40:00Z",
    updatedAt: "2024-02-07T16:30:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "13",
    name: "Authorization",
    createdAt: "2024-02-06T10:00:00Z",
    updatedAt: "2024-02-06T10:00:00Z",
    isArchived: true,
    isFavorite: true,
    tags: []
  },
  {
    id: "14",
    name: "Testing Frontend",
    description: "Unit и e2e тесты",
    createdAt: "2024-02-08T13:25:00Z",
    updatedAt: "2024-02-12T09:45:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "15",
    name: "Performance",
    description: "Оптимизация загрузки и рендера",
    createdAt: "2024-02-10T16:00:00Z",
    updatedAt: "2024-02-14T18:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "1",
    name: "JavaScript Basics",
    description: "Основы JavaScript: переменные, функции, условия",
    createdAt: "2024-01-05T10:15:00Z",
    updatedAt: "2024-01-10T09:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "2",
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
    id: "3",
    name: "Vue Fundamentals",
    description: "Composition API и реактивность",
    createdAt: "2024-01-10T14:45:00Z",
    updatedAt: "2024-01-15T16:10:00Z",
    isArchived: false,
    isFavorite: true,
    tags: [{ id: 1, label: "vue", color: "success" }]
  },
  {
    id: "4",
    name: "Nuxt 3",
    description: "SSR, routing, data fetching",
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-18T13:40:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "nuxt", color: "success" }]
  },
  {
    id: "5",
    name: "Frontend Architecture",
    description: "Модульность и масштабирование",
    createdAt: "2024-01-15T12:30:00Z",
    updatedAt: "2024-01-20T17:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "module", color: "error" }]
  },
  {
    id: "6",
    name: "HTML Semantics",
    createdAt: "2024-01-18T08:20:00Z",
    updatedAt: "2024-01-18T08:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "html", color: "neutral" }]
  },
  {
    id: "7",
    name: "CSS Layouts",
    description: "Flexbox и Grid",
    createdAt: "2024-01-20T10:10:00Z",
    updatedAt: "2024-01-22T11:45:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "8",
    name: "Accessibility",
    description: "WCAG и a11y-практики",
    createdAt: "2024-01-22T09:50:00Z",
    updatedAt: "2024-01-25T14:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "9",
    name: "SEO Basics",
    createdAt: "2024-01-25T15:30:00Z",
    updatedAt: "2024-01-25T15:30:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "10",
    name: "State Management",
    description: "Pinia и управление состоянием",
    createdAt: "2024-01-28T11:15:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "11",
    name: "REST APIs",
    description: "Принципы REST и HTTP",
    createdAt: "2024-02-02T09:00:00Z",
    updatedAt: "2024-02-05T12:10:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "12",
    name: "Authentication",
    description: "JWT и OAuth",
    createdAt: "2024-02-04T14:40:00Z",
    updatedAt: "2024-02-07T16:30:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "13",
    name: "Authorization",
    createdAt: "2024-02-06T10:00:00Z",
    updatedAt: "2024-02-06T10:00:00Z",
    isArchived: true,
    isFavorite: true,
    tags: []
  },
  {
    id: "14",
    name: "Testing Frontend",
    description: "Unit и e2e тесты",
    createdAt: "2024-02-08T13:25:00Z",
    updatedAt: "2024-02-12T09:45:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "15",
    name: "Performance",
    description: "Оптимизация загрузки и рендера",
    createdAt: "2024-02-10T16:00:00Z",
    updatedAt: "2024-02-14T18:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "1",
    name: "JavaScript Basics",
    description: "Основы JavaScript: переменные, функции, условия",
    createdAt: "2024-01-05T10:15:00Z",
    updatedAt: "2024-01-10T09:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "2",
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
    id: "3",
    name: "Vue Fundamentals",
    description: "Composition API и реактивность",
    createdAt: "2024-01-10T14:45:00Z",
    updatedAt: "2024-01-15T16:10:00Z",
    isArchived: false,
    isFavorite: true,
    tags: [{ id: 1, label: "vue", color: "success" }]
  },
  {
    id: "4",
    name: "Nuxt 3",
    description: "SSR, routing, data fetching",
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-18T13:40:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "nuxt", color: "success" }]
  },
  {
    id: "5",
    name: "Frontend Architecture",
    description: "Модульность и масштабирование",
    createdAt: "2024-01-15T12:30:00Z",
    updatedAt: "2024-01-20T17:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "module", color: "error" }]
  },
  {
    id: "6",
    name: "HTML Semantics",
    createdAt: "2024-01-18T08:20:00Z",
    updatedAt: "2024-01-18T08:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "html", color: "neutral" }]
  },
  {
    id: "7",
    name: "CSS Layouts",
    description: "Flexbox и Grid",
    createdAt: "2024-01-20T10:10:00Z",
    updatedAt: "2024-01-22T11:45:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "8",
    name: "Accessibility",
    description: "WCAG и a11y-практики",
    createdAt: "2024-01-22T09:50:00Z",
    updatedAt: "2024-01-25T14:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "9",
    name: "SEO Basics",
    createdAt: "2024-01-25T15:30:00Z",
    updatedAt: "2024-01-25T15:30:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "10",
    name: "State Management",
    description: "Pinia и управление состоянием",
    createdAt: "2024-01-28T11:15:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "11",
    name: "REST APIs",
    description: "Принципы REST и HTTP",
    createdAt: "2024-02-02T09:00:00Z",
    updatedAt: "2024-02-05T12:10:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "12",
    name: "Authentication",
    description: "JWT и OAuth",
    createdAt: "2024-02-04T14:40:00Z",
    updatedAt: "2024-02-07T16:30:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "13",
    name: "Authorization",
    createdAt: "2024-02-06T10:00:00Z",
    updatedAt: "2024-02-06T10:00:00Z",
    isArchived: true,
    isFavorite: true,
    tags: []
  },
  {
    id: "14",
    name: "Testing Frontend",
    description: "Unit и e2e тесты",
    createdAt: "2024-02-08T13:25:00Z",
    updatedAt: "2024-02-12T09:45:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "15",
    name: "Performance",
    description: "Оптимизация загрузки и рендера",
    createdAt: "2024-02-10T16:00:00Z",
    updatedAt: "2024-02-14T18:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "1",
    name: "JavaScript Basics",
    description: "Основы JavaScript: переменные, функции, условия",
    createdAt: "2024-01-05T10:15:00Z",
    updatedAt: "2024-01-10T09:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "2",
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
    id: "3",
    name: "Vue Fundamentals",
    description: "Composition API и реактивность",
    createdAt: "2024-01-10T14:45:00Z",
    updatedAt: "2024-01-15T16:10:00Z",
    isArchived: false,
    isFavorite: true,
    tags: [{ id: 1, label: "vue", color: "success" }]
  },
  {
    id: "4",
    name: "Nuxt 3",
    description: "SSR, routing, data fetching",
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-18T13:40:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "nuxt", color: "success" }]
  },
  {
    id: "5",
    name: "Frontend Architecture",
    description: "Модульность и масштабирование",
    createdAt: "2024-01-15T12:30:00Z",
    updatedAt: "2024-01-20T17:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "module", color: "error" }]
  },
  {
    id: "6",
    name: "HTML Semantics",
    createdAt: "2024-01-18T08:20:00Z",
    updatedAt: "2024-01-18T08:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: [{ id: 1, label: "html", color: "neutral" }]
  },
  {
    id: "7",
    name: "CSS Layouts",
    description: "Flexbox и Grid",
    createdAt: "2024-01-20T10:10:00Z",
    updatedAt: "2024-01-22T11:45:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "8",
    name: "Accessibility",
    description: "WCAG и a11y-практики",
    createdAt: "2024-01-22T09:50:00Z",
    updatedAt: "2024-01-25T14:00:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  },
  {
    id: "9",
    name: "SEO Basics",
    createdAt: "2024-01-25T15:30:00Z",
    updatedAt: "2024-01-25T15:30:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "10",
    name: "State Management",
    description: "Pinia и управление состоянием",
    createdAt: "2024-01-28T11:15:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "11",
    name: "REST APIs",
    description: "Принципы REST и HTTP",
    createdAt: "2024-02-02T09:00:00Z",
    updatedAt: "2024-02-05T12:10:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "12",
    name: "Authentication",
    description: "JWT и OAuth",
    createdAt: "2024-02-04T14:40:00Z",
    updatedAt: "2024-02-07T16:30:00Z",
    isArchived: true,
    isFavorite: false,
    tags: []
  },
  {
    id: "13",
    name: "Authorization",
    createdAt: "2024-02-06T10:00:00Z",
    updatedAt: "2024-02-06T10:00:00Z",
    isArchived: true,
    isFavorite: true,
    tags: []
  },
  {
    id: "14",
    name: "Testing Frontend",
    description: "Unit и e2e тесты",
    createdAt: "2024-02-08T13:25:00Z",
    updatedAt: "2024-02-12T09:45:00Z",
    isArchived: false,
    isFavorite: true,
    tags: []
  },
  {
    id: "15",
    name: "Performance",
    description: "Оптимизация загрузки и рендера",
    createdAt: "2024-02-10T16:00:00Z",
    updatedAt: "2024-02-14T18:20:00Z",
    isArchived: false,
    isFavorite: false,
    tags: []
  }
]
