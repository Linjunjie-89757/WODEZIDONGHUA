# Frontend 2.0 Architecture

## Stack

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Arco Design Vue
- Feature-Sliced Lite

## Dependency Direction

```text
app -> pages -> widgets -> features -> entities -> shared
```

- `shared` cannot import business modules.
- `entities` cannot import `features`, `widgets`, or `pages`.
- `features` cannot import `widgets` or `pages`.
- `widgets` can compose `features`, `entities`, and `shared`.
- `pages` compose page sections and avoid complex business logic.
- `processes` are reserved for multi-step flows, such as AI generation and API execution.

## Module Rules

- Every module exposes an `index.ts`.
- Prefer `shared/ui` over direct per-page Arco styling.
- Prefer `shared/styles/tokens.css` for visual constants.
- Page scoped CSS should only handle local layout.
- Avoid large page files; move actions to `features`, business models to `entities`, and page regions to `widgets`.

## Backend

Use the existing backend without changing it:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

Local Vite development proxies `/api` to `http://localhost:8080`.
