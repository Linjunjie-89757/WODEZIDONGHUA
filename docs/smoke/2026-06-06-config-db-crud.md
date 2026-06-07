# 2026-06-06 Config Database Connection CRUD Smoke

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
| Load config center | Pass | `GET /api/settings/envs`, `/params`, and `/db-connections` returned 200. |
| Cleanup stale smoke DB connections | Pass | Removed stale `smoke-db-*` data left by the first failing test run. |
| Create database connection | Pass | Created `smoke-db-20260606160555`; `POST /api/settings/db-connections` returned 200. |
| Refresh after create | Pass | Config overview refreshed and the created database connection appeared. |
| Edit database connection | Pass | Renamed to `smoke-db-20260606160555-edited`; `PUT /api/settings/db-connections/2` returned 200. |
| Test database connection action | Pass | `POST /api/settings/db-connections/test` was triggered. It returned 400 because the smoke uses an intentionally invalid JDBC URL. |
| Disable database connection | Pass | `PUT /api/settings/db-connections/2/status` returned 200. |
| Enable database connection | Pass | `PUT /api/settings/db-connections/2/status` returned 200. |
| Delete database connection | Pass | `DELETE /api/settings/db-connections/2` returned 200. |
| Refresh after delete | Pass | Test database connection was no longer visible. |

## Requests Observed

- `GET /api/auth/me`: 401 before login.
- `POST /api/auth/login`: 200.
- `GET /api/workspaces/switchable`: 200.
- `GET /api/settings/envs`: 200.
- `GET /api/settings/params`: 200.
- `GET /api/settings/db-connections`: 200.
- `DELETE /api/settings/db-connections/1`: 200 cleanup from first failing smoke.
- `POST /api/settings/db-connections`: 200.
- `PUT /api/settings/db-connections/2`: 200.
- `POST /api/settings/db-connections/test`: 400 with intentionally invalid JDBC smoke payload.
- `PUT /api/settings/db-connections/2/status`: 200.
- `DELETE /api/settings/db-connections/2`: 200.

## Evidence

- Final screenshot: `output/playwright/config-db-crud-20260606160555.png`
- Smoke script: `scripts/smoke-config-db-crud.mjs`
- Final state: smoke test data was removed.

## Result

Pass. Config database connection create, edit, test action, enable/disable, delete, and list refresh are verified against the old backend. The test action currently records invalid-connection behavior rather than requiring a real database connection.
