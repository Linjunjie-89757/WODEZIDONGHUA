# AutoTestHub Frontend 2.0

Vue3 + TypeScript + Vite + Pinia + Vue Router + Arco Design Vue + Feature-Sliced Lite.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Backend

The new frontend calls the existing backend through:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

During local development, Vite proxies `/api` requests to `http://localhost:8080`.

## Architecture

```text
src/
  app/       app bootstrap, providers, router, store
  pages/     route-level page composition
  widgets/   page regions and business panels
  features/  business actions and workflows
  entities/  domain models and API access
  shared/    UI kit, styles, API client, utilities
```
