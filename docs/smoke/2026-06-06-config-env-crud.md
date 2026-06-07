# 2026-06-06 Config Environment CRUD Smoke

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
| Create environment | Pass | Created `smoke-env-20260606151404`; `POST /api/settings/envs` returned 200. |
| Refresh after create | Pass | Config overview refreshed and the created environment appeared. |
| Edit environment | Pass | Renamed to `smoke-env-20260606151404-edited`; `PUT /api/settings/envs/3` returned 200. |
| Disable environment | Pass | `PUT /api/settings/envs/3/status` returned 200. |
| Enable environment | Pass | `PUT /api/settings/envs/3/status` returned 200. |
| Delete environment | Pass | `DELETE /api/settings/envs/3` returned 200. |
| Refresh after delete | Pass | Test environment was no longer visible. |

## Requests Observed

- `GET /api/auth/me`: 401 before login.
- `POST /api/auth/login`: 200.
- `GET /api/workspaces/switchable`: 200.
- `GET /api/settings/envs`: 200.
- `GET /api/settings/params`: 200.
- `GET /api/settings/db-connections`: 200.
- `POST /api/settings/envs`: 200.
- `PUT /api/settings/envs/3`: 200.
- `PUT /api/settings/envs/3/status`: 200.
- `DELETE /api/settings/envs/3`: 200.

## Issue Found And Fixed During Smoke

- In the `ALL` workspace view, the backend requires write requests to include a concrete `workspaceCode`.
- Added `writableWorkspaceCode` to the workspace store and used it for environment create/update operations.
- Delete and status operations now use the environment row's own `workspaceCode`.

## Evidence

- Final screenshot: `output/playwright/config-env-crud-20260606151404.png`
- Smoke script: `scripts/smoke-config-env-crud.mjs`
- Final state: only real environment configs remained; smoke test data was removed.

## Result

Pass. Config environment create, edit, enable/disable, delete, and list refresh are verified against the old backend.
