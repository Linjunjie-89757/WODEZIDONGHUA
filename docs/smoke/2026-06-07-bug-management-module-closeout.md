# 2026-06-07 Bug Management Module Closeout

## Scope

- New frontend: `D:\CodeProject\AutoTestHub`
- Old backend: `D:\CodeProject\auto\server`
- Frontend URL: `http://localhost:5173`
- Backend base URL: `http://localhost:8080/api`
- Module route: `/bug-management`

This closeout verifies Bug Management as the third frontend 2.0 migration sample module after Config Center and Case Center.

Out of scope for this closeout:

- bug delete, because `BugController.java` does not expose a delete endpoint;
- assign shortcut, because edit already covers assignee changes and transition covers lifecycle;
- source-based creation from case or report;
- standalone bug detail route;
- final product UI polish.

## Migrated Capabilities

| Area | List / Read | Create | Edit | Transition | Comment | Attachment |
| --- | --- | --- | --- | --- | --- | --- |
| Bug statistics | Pass | - | - | - | - | - |
| Bug list | Pass | - | - | - | - | - |
| Bug detail | Pass | - | - | - | - | - |
| Bug body | Pass | Pass | Pass | - | - | - |
| Bug lifecycle | Pass | - | - | Pass | - | - |
| Bug comments | Pass | - | - | - | Pass | - |
| Bug attachments | Pass | - | - | - | - | Upload / Download / Delete |

## Contract Sources

- Contract table: `docs/api-contract.md`
- Endpoint keys: `src/shared/api/endpoints.ts`
- Entity API: `src/entities/bug/api/bugApi.ts`
- Backend source: `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\bug\BugController.java`
- Request DTOs: `CreateBugRequest.java`, `UpdateBugRequest.java`, `TransitionBugRequest.java`, `CreateBugCommentRequest.java`
- Response DTOs: `BugSummaryResponse.java`, `BugDetailResponse.java`, `BugStatisticsResponse.java`, `BugAttachmentResponse.java`, `BugCommentResponse.java`

## Smoke Runs

| Script | Status | Screenshot |
| --- | --- | --- |
| `node scripts\smoke-bug-management-readonly.mjs` | Pass | `output/playwright/bug-management-readonly-20260606191230.png` |
| `node scripts\smoke-bug-crud.mjs` | Pass | `output/playwright/bug-crud-20260606191230.png` |
| `node scripts\smoke-bug-transition-comment.mjs` | Pass | `output/playwright/bug-transition-comment-20260606191230.png` |
| `node scripts\smoke-bug-attachment.mjs` | Pass | `output/playwright/bug-attachment-20260606191230.png` |

Notes:

- Smoke data is intentionally unique by timestamp because the backend has no bug delete endpoint.
- Initial `GET /api/auth/me` returned 401 before login in each run. This is expected.
- CRUD smoke verifies detail preload before edit.
- Transition/comment smoke verifies lifecycle update and comment creation from the detail drawer.
- Attachment smoke verifies multipart upload, binary download with `fetch`, delete, and detail refresh.

## Visual And Overflow Check

| Viewport | Status | Screenshot | Horizontal Overflow |
| --- | --- | --- | --- |
| Desktop `1440x960` | Pass | `output/playwright/bug-management-module-desktop-20260606191230.png` | No |
| Mobile `390x844` | Pass | `output/playwright/bug-management-module-mobile-20260606191230.png` | No |

Script:

- `node scripts\smoke-bug-management-visual.mjs`

Observed layout metrics:

- Desktop `clientWidth=1440`, `scrollWidth=1440`
- Mobile `clientWidth=390`, `scrollWidth=390`

## Quality Gates

| Check | Status | Command |
| --- | --- | --- |
| Lint | Pass | `npm.cmd run lint` |
| Build | Pass | `npm.cmd run build` |
| Scattered Chinese string scan | Pass | Scanned `src` and only `src/shared/i18n/zh-CN.ts` contains user-facing Chinese text. |
| Mojibake keyword scan | Pass | Scanned `docs` and `src` for common mojibake markers. |

Build note:

- Vite still reports the known Arco/index chunk warning over 500 KB. This is not blocking for the module closeout.

## Current Architecture Shape

- `pages/bug-management` composes the page.
- `widgets/bug-management-readonly` owns the module area and detail drawer.
- `features/bug-create` and `features/bug-edit` own bug body actions.
- `features/bug-transition` owns lifecycle status transition.
- `features/bug-comment-add` owns comment creation.
- `features/bug-attachment-*` own attachment upload, download, and delete.
- `entities/bug` owns item types, payload helpers, and API methods.
- `entities/user` exposes the minimal user list API needed for assignee selection.
- `shared/i18n/zh-CN.ts` owns user-facing Chinese strings.
- `shared/ui` owns reusable app-level UI wrappers.

## Not Final UI

The current Bug Management view is a migration and verification surface. The final product page should later evolve toward:

- filtering by status, priority, assignee, reporter, and tags;
- pagination and sorting;
- a standalone detail route for deep links;
- richer activity timeline layout;
- source-based creation from case and report flows;
- denser operational layout after more modules are migrated;
- attachment preview and file metadata display.

## Result

Pass. Bug Management is closed out as the third complete frontend 2.0 sample module: API contract, Feature-Sliced Lite boundaries, centralized Chinese UI text, readonly list/detail, create/edit, transition, comments, attachments, smoke evidence, screenshot evidence, overflow check, lint, and build are all recorded.
