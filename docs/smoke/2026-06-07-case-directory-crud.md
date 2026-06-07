# 2026-06-07 Case Directory CRUD Smoke

## Scope

- New frontend: `D:\CodeProject\AutoTestHub`
- Old backend: `D:\CodeProject\auto\server`
- Frontend URL: `http://localhost:5173`
- Backend base URL: `http://localhost:8080/api`
- Module route: `/case-center`

This smoke verifies Case Center directory management only. It does not include case CRUD, batch actions, execution, review, attachments, or AI generation flows.

## Scenario

| Step | Status | Notes |
| --- | --- | --- |
| Login | Pass | `POST /api/auth/login` returned 200. Initial `GET /api/auth/me` returned 401 before login, which is expected. |
| Load workspace options | Pass | `GET /api/workspaces/switchable` returned 200. |
| Load readonly case center | Pass | `GET /api/cases/directories` and `GET /api/cases?pageNo=1&pageSize=20` returned 200. |
| Cleanup stale smoke directories | Pass | Removed stale `smoke-dir-*` data left by earlier failing test runs. |
| Create root directory | Pass | Created `smoke-dir-20260606174104`; `POST /api/cases/directories` returned 200. |
| Rename directory | Pass | Renamed to `smoke-dir-20260606174104-edited`; `PUT /api/cases/directories/10009` returned 200. |
| Create child directory | Pass | Created `smoke-dir-20260606174104-child`; `POST /api/cases/directories` returned 200. |
| Move directory to root | Pass | `POST /api/cases/directories/10009/move` returned 200. |
| Delete child directory | Pass | `DELETE /api/cases/directories/10010` returned 200. |
| Delete root directory | Pass | `DELETE /api/cases/directories/10009` returned 200. |
| Refresh after delete | Pass | Smoke directories were no longer visible. |

## Requests Observed

- `GET /api/auth/me`: 401 before login.
- `POST /api/auth/login`: 200.
- `GET /api/workspaces/switchable`: 200.
- `GET /api/cases/directories`: 200.
- `GET /api/cases?pageNo=1&pageSize=20`: 200.
- `DELETE /api/cases/directories/10008`: 200 cleanup from first failing directory smoke.
- `DELETE /api/cases/directories/10007`: 200 cleanup from first failing directory smoke.
- `POST /api/cases/directories`: 200.
- `PUT /api/cases/directories/10009`: 200.
- `POST /api/cases/directories/10009/move`: 200.
- `DELETE /api/cases/directories/10010`: 200.
- `DELETE /api/cases/directories/10009`: 200.

## Evidence

- Final screenshot: `output/playwright/case-directory-crud-20260606174104.png`
- Smoke script: `scripts/smoke-case-directory-crud.mjs`
- Final state: smoke test directories were removed.

## Result

Pass. Case directory create, rename, create child, move to root, delete, and tree refresh are verified against the old backend.
