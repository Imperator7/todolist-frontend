# 📋 Todo List — Frontend Developer Test

A simple **Todo List** application built with **React + TypeScript + Vite**, using **React Query** for server state management, **Context API** for data/actions, and **MSW** for realistic API mocking.

---

## 🚀 Features

- Fetch & display todos from an API
- Add new todos
- Edit todo titles
- Toggle completion state (done / undone)
- Delete todos
- Proper loading & error states
- Optimistic updates with rollback
- **React (functional) + TypeScript**
- **React Query** for fetching and mutations
- **Context API** for data & actions (no prop drilling)
- **MSW** (Mock Service Worker) simulates backend endpoints

---

## 🛠️ Getting Started

```bash
npm install
npm run dev
# Vite dev server: http://localhost:5173
```

MSW is automatically initialized on startup (no `.env` setup required).

---

## 📦 Tech Stack

- **React + TypeScript** — UI & type safety
- **TanStack Query (React Query)** — Server state management
- **React Context API** — Share data/actions across components
- **MSW (Mock Service Worker)** — Network-level API mocking

---

## 🔌 Mock API Endpoints

### Response Format

- ✅ Success:

  ```json
  { "ok": true, "data": "..." }
  ```

- ❌ Error:
  ```json
  { "ok": false, "error": "message" }
  ```

### Endpoints

**GET** `/api/todos`  
→ `{ "ok": true, "data": { "todos": Todo[] } }`

**POST** `/api/todos`  
Body:

```json
{ "title": "Buy milk" }
```

→ `{ "ok": true, "data": Todo }`

**PATCH** `/api/todos/:id`  
Body: (any subset, at least one)

```json
{ "title": "New title", "completed": true }
```

→ `{ "ok": true, "data": Todo }`

**DELETE** `/api/todos/:id`  
→ `{ "ok": true, "data": { "deletedId": "string" } }`

---

## 🔮 Future Improvements

- Toast notifications for success/error feedback
- Component & E2E tests (React Testing Library + MSW)
