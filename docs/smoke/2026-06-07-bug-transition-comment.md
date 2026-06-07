# 2026-06-07 Bug Transition And Comment Smoke

## Scope

- New frontend: `D:\CodeProject\AutoTestHub`
- Old backend: `D:\CodeProject\auto\server`
- Frontend URL: `http://localhost:5173`
- Backend base URL: `http://localhost:8080/api`
- Module route: `/bug-management`

This smoke verifies bug status transition and comment creation from the readonly detail drawer. It does not include attachments, assign shortcut, source-based creation, or a standalone bug detail page.

## TDD Evidence

| Step | Status | Notes |
| --- | --- | --- |
| RED smoke | Fail as expected | Initial `node scripts\smoke-bug-transition-comment.mjs` failed because the detail drawer had no `状态流转` action. |
| GREEN smoke | Pass | Final smoke created a bug, transitioned it, added a comment, and verified the refreshed detail drawer. |

## Scenario

| Step | Status | Notes |
| --- | --- | --- |
| Login | Pass | `POST /api/auth/login` returned 200. Initial `GET /api/auth/me` returned 401 before login, which is expected. |
| Create smoke bug | Pass | Created `smoke-bug-flow-20260606185016`; `POST /api/bugs` returned 200. |
| Open detail | Pass | `GET /api/bugs/1009` returned 200. |
| Transition status | Pass | `POST /api/bugs/1009/transition` returned 200 with target status `IN_PROGRESS`. |
| Refresh after transition | Pass | Detail, statistics, and list were reloaded. |
| Add comment | Pass | `POST /api/bugs/1009/comments` returned 200. |
| Refresh after comment | Pass | Detail drawer showed `smoke comment 20260606185016`. |

## Requests Observed

- `GET /api/auth/me`: 401 before login.
- `POST /api/auth/login`: 200.
- `GET /api/workspaces/switchable`: 200.
- `GET /api/bugs/statistics`: 200.
- `GET /api/bugs`: 200.
- `GET /api/users`: 200.
- `POST /api/bugs`: 200.
- `GET /api/bugs/1009`: 200.
- `POST /api/bugs/1009/transition`: 200.
- `POST /api/bugs/1009/comments`: 200.

## Evidence

- Final screenshot: `output/playwright/bug-transition-comment-20260606185016.png`
- Smoke script: `scripts/smoke-bug-transition-comment.mjs`

## Result

Pass. Bug status transition, transition activity display, comment creation, and detail refresh are verified against the old backend.
