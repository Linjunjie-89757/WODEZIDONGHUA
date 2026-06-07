# 2026-06-07 Case Center Readonly Smoke

## Scope

- New frontend: `D:\CodeProject\AutoTestHub`
- Old backend: `D:\CodeProject\auto\server`
- Frontend URL: `http://localhost:5173`
- Backend base URL: `http://localhost:8080/api`
- Module route: `/case-center`

This smoke verifies the first readonly migration step for Case Center. It does not include case CRUD, directory actions, execution, review, attachments, or AI generation flows.

## Scenario

| Step | Status | Notes |
| --- | --- | --- |
| Login | Pass | `POST /api/auth/login` returned 200. Initial `GET /api/auth/me` returned 401 before login, which is expected. |
| Load workspace options | Pass | `GET /api/workspaces/switchable` returned 200. |
| Load case directories | Pass | `GET /api/cases/directories` returned 200. |
| Load case list | Pass | `GET /api/cases?pageNo=1&pageSize=20` returned 200. |
| Render readonly overview | Pass | Page showed `用例中心总览`, `目录结构`, and `用例列表`. |
| Horizontal overflow check | Pass | `clientWidth=1440`, `scrollWidth=1440`. |

## Requests Observed

- `GET /api/auth/me`: 401 before login.
- `POST /api/auth/login`: 200.
- `GET /api/workspaces/switchable`: 200.
- `GET /api/cases/directories`: 200.
- `GET /api/cases?pageNo=1&pageSize=20`: 200.

## Evidence

- Final screenshot: `output/playwright/case-center-readonly-20260606164546.png`
- Smoke script: `scripts/smoke-case-center-readonly.mjs`

## Result

Pass. Case Center readonly list and directory loading are verified against the old backend.
