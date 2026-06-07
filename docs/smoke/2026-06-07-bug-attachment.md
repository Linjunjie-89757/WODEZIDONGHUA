# 2026-06-07 Bug Attachment Smoke

## Scope

- New frontend: `D:\CodeProject\AutoTestHub`
- Old backend: `D:\CodeProject\auto\server`
- Frontend URL: `http://localhost:5173`
- Backend base URL: `http://localhost:8080/api`
- Module route: `/bug-management`

This smoke verifies bug attachment upload, download, delete, and detail refresh from the readonly detail drawer. It does not include source-based bug creation, assign shortcut, or a standalone bug detail page.

## TDD Evidence

| Step | Status | Notes |
| --- | --- | --- |
| RED smoke | Fail as expected | Initial `node scripts\smoke-bug-attachment.mjs` failed because the detail drawer had no `上传附件` action. |
| GREEN smoke | Pass | Final smoke created a bug, uploaded a text attachment, downloaded it, deleted it, and verified detail refresh. |

## Scenario

| Step | Status | Notes |
| --- | --- | --- |
| Login | Pass | `POST /api/auth/login` returned 200. Initial `GET /api/auth/me` returned 401 before login, which is expected. |
| Create smoke bug | Pass | Created `smoke-bug-attachment-20260606190225`; `POST /api/bugs` returned 200. |
| Open detail | Pass | `GET /api/bugs/1012` returned 200. |
| Upload attachment | Pass | `POST /api/bugs/1012/attachments` returned 200 and attachment appeared in the drawer. |
| Download attachment | Pass | `GET /api/bugs/1012/attachments/8/download` returned 200. |
| Delete attachment | Pass | `DELETE /api/bugs/1012/attachments/8` returned 200. |
| Refresh after delete | Pass | Detail, statistics, and list were reloaded, and the attachment row disappeared. |

## Requests Observed

- `GET /api/auth/me`: 401 before login.
- `POST /api/auth/login`: 200.
- `GET /api/workspaces/switchable`: 200.
- `GET /api/bugs/statistics`: 200.
- `GET /api/bugs`: 200.
- `GET /api/users`: 200.
- `POST /api/bugs`: 200.
- `GET /api/bugs/1012`: 200.
- `POST /api/bugs/1012/attachments`: 200.
- `GET /api/bugs/1012/attachments/8/download`: 200.
- `DELETE /api/bugs/1012/attachments/8`: 200.

## Evidence

- Final screenshot: `output/playwright/bug-attachment-20260606190225.png`
- Smoke script: `scripts/smoke-bug-attachment.mjs`

## Result

Pass. Bug attachment upload, binary download, delete, and detail refresh are verified against the old backend.
