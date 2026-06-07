# 2026-06-07 Bug Management Readonly Smoke

## Scope

- New frontend: `D:\CodeProject\AutoTestHub`
- Old backend: `D:\CodeProject\auto\server`
- Frontend URL: `http://localhost:5173`
- Backend base URL: `http://localhost:8080/api`
- Module route: `/bug-management`

This smoke verifies the first readonly migration step for Bug Management. It does not include bug create, update, assign, status transition, comments write, or attachment write flows.

## Scenario

| Step | Status | Notes |
| --- | --- | --- |
| Login | Pass | `POST /api/auth/login` returned 200. Initial `GET /api/auth/me` returned 401 before login, which is expected. |
| Load workspace options | Pass | `GET /api/workspaces/switchable` returned 200. |
| Load bug statistics | Pass | `GET /api/bugs/statistics` returned 200. |
| Load bug list | Pass | `GET /api/bugs` returned 200. |
| Load bug detail | Pass | The script clicked the first row and `GET /api/bugs/1003` returned 200. |
| Render readonly overview | Pass | Page showed `缺陷管理总览` and `缺陷列表`. |
| Horizontal overflow check | Pass | `clientWidth=1440`, `scrollWidth=1440`. |

## Requests Expected

- `GET /api/auth/me`: may return 401 before login.
- `POST /api/auth/login`: 200.
- `GET /api/workspaces/switchable`: 200.
- `GET /api/bugs/statistics`: 200.
- `GET /api/bugs`: 200.
- `GET /api/bugs/{id}`: 200 when the list has at least one bug.

## Requests Observed

- `GET /api/auth/me`: 401 before login.
- `POST /api/auth/login`: 200.
- `GET /api/workspaces/switchable`: 200.
- `GET /api/bugs/statistics`: 200.
- `GET /api/bugs`: 200.
- `GET /api/bugs/1003`: 200.

## Evidence

- Final screenshot: `output/playwright/bug-management-readonly-20260606181535.png`
- Smoke script: `scripts/smoke-bug-management-readonly.mjs`

## Result

Pass. Bug Management readonly statistics, list, and detail loading are verified against the old backend.
