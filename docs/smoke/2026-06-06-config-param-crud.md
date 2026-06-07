# 2026-06-06 Config Parameter Set CRUD Smoke

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
| Create parameter set | Pass | Created `smoke-param-20260606153442`; `POST /api/settings/params` returned 200. |
| Refresh after create | Pass | Config overview refreshed and the created parameter set appeared. |
| Edit parameter set | Pass | Renamed to `smoke-param-20260606153442-edited`; `PUT /api/settings/params/3` returned 200. |
| Disable parameter set | Pass | `PUT /api/settings/params/3/status` returned 200. |
| Enable parameter set | Pass | `PUT /api/settings/params/3/status` returned 200. |
| Delete parameter set | Pass | `DELETE /api/settings/params/3` returned 200. |
| Refresh after delete | Pass | Test parameter set was no longer visible. |

## Requests Observed

- `GET /api/auth/me`: 401 before login.
- `POST /api/auth/login`: 200.
- `GET /api/workspaces/switchable`: 200.
- `GET /api/settings/envs`: 200.
- `GET /api/settings/params`: 200.
- `GET /api/settings/db-connections`: 200.
- `POST /api/settings/params`: 200.
- `PUT /api/settings/params/3`: 200.
- `PUT /api/settings/params/3/status`: 200.
- `DELETE /api/settings/params/3`: 200.

## Evidence

- Final screenshot: `output/playwright/config-param-crud-20260606153442.png`
- Smoke script: `scripts/smoke-config-param-crud.mjs`
- Final state: only real parameter sets remained; smoke test data was removed.

## Result

Pass. Config parameter set create, edit, enable/disable, delete, and list refresh are verified against the old backend.
