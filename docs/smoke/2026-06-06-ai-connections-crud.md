# 2026-06-06 AI Connections CRUD Smoke

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
| Load AI connection list | Pass | `GET /api/cases/ai/providers` returned 200 and rendered real backend data. |
| Clean stale smoke data | Pass | Removed previous `smoke-crud-*` test connection before the final run. |
| Create AI connection | Pass | Created `smoke-crud-20260606141137`; `POST /api/cases/ai/providers` returned 200. |
| Refresh after create | Pass | List refreshed and the created connection appeared. |
| Edit AI connection | Pass | Renamed to `smoke-crud-20260606141137-edited`; `PUT /api/cases/ai/providers/8` returned 200. |
| Refresh after edit | Pass | List refreshed and the edited name appeared. |
| Delete AI connection | Pass | Deleted test connection; `DELETE /api/cases/ai/providers/8` returned 200. |
| Refresh after delete | Pass | List refreshed and the test connection was no longer visible. |

## Requests Observed

- `GET /api/auth/me`: 401 before login.
- `POST /api/auth/login`: 200.
- `GET /api/workspaces/switchable`: 200.
- `GET /api/cases/ai/providers`: 200.
- `DELETE /api/cases/ai/providers/5`: 200, cleanup of stale smoke data.
- `POST /api/cases/ai/providers`: 200.
- `PUT /api/cases/ai/providers/8`: 200.
- `DELETE /api/cases/ai/providers/8`: 200.

## Evidence

- Final screenshot: `output/playwright/ai-connections-crud-20260606141137.png`
- Smoke script: `scripts/smoke-ai-connections-crud.mjs`
- Final state: only the real `deepseek` connection remained; smoke test data was removed.

## Issue Found And Fixed During Smoke

- `AppDialog` did not pass Arco Modal `before-ok` correctly, so create/edit dialogs could close without submitting.
- Fixed `shared/ui/app-dialog/AppDialog.vue` to explicitly pass `on-before-ok`.
- Re-ran lint, build, and browser CRUD smoke after the fix.

## Result

Pass. AI connection create, edit, delete, and list refresh are verified against the old backend.
