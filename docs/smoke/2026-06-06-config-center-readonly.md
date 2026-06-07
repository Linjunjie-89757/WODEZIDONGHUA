# 2026-06-06 Config Center Readonly Smoke

## Scope

- New frontend: `D:\CodeProject\AutoTestHub`
- Old backend: `D:\CodeProject\auto\server`
- Frontend URL: `http://localhost:5173`
- Backend base URL: `http://localhost:8080/api`
- Login account: `superadmin`

## Scenario

| Step | Status | Notes |
| --- | --- | --- |
| Login | Pass | `POST /api/auth/login` returned 200. Initial `GET /api/auth/me` returned 401 before login, which is expected. |
| Load workspace options | Pass | `GET /api/workspaces/switchable` returned 200. |
| Open config center | Pass | Browser reached `/config-center`. |
| Load environments | Pass | `GET /api/settings/envs` returned 200 and rendered 2 environment configs. |
| Load parameter sets | Pass | `GET /api/settings/params` returned 200 and rendered 2 parameter sets. |
| Load database connections | Pass | `GET /api/settings/db-connections` returned 200 and rendered the empty state. |
| Page structure | Pass | Summary metrics and the three readonly sections were visible. |

## Requests Observed

- `GET /api/auth/me`: 401 before login.
- `POST /api/auth/login`: 200.
- `GET /api/workspaces/switchable`: 200.
- `GET /api/settings/envs`: 200.
- `GET /api/settings/params`: 200.
- `GET /api/settings/db-connections`: 200.

## Evidence

- Final screenshot: `output/playwright/config-center-readonly-20260606144620.png`
- Smoke script: `scripts/smoke-config-center-readonly.mjs`

## Result

Pass. Config center readonly overview is verified against the old backend for environments, parameter sets, and database connections.
