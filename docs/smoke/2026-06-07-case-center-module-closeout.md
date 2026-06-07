# 2026-06-07 Case Center Module Closeout

## Scope

- New frontend: `D:\CodeProject\AutoTestHub`
- Old backend: `D:\CodeProject\auto\server`
- Frontend URL: `http://localhost:5173`
- Backend base URL: `http://localhost:8080/api`
- Module route: `/case-center`

This closeout verifies Case Center as the second frontend 2.0 migration sample module after Config Center. It covers the basic case asset surface only.

Out of scope for this closeout:

- batch case actions;
- execution result workflow;
- review workflow;
- attachments;
- AI generation flows;
- final product UI polish.

## Migrated Capabilities

| Area | List | Create | Edit / Rename | Move | Delete | Extra |
| --- | --- | --- | --- | --- | --- | --- |
| Case list | Pass | - | - | - | - | Reads first page with directories |
| Case body | Pass | Pass | Pass | - | Pass | Edit loads detail before prefill |
| Case directories | Pass | Pass | Pass | Pass | Pass | Supports root and child directory creation |

## Contract Sources

- Contract table: `docs/api-contract.md`
- Endpoint keys: `src/shared/api/endpoints.ts`
- Entity API: `src/entities/case-center/api/caseCenterApi.ts`
- Backend source: `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\casecenter\CaseController.java`

## Smoke Runs

| Script | Status | Screenshot |
| --- | --- | --- |
| `node scripts\smoke-case-center-readonly.mjs` | Pass | `output/playwright/case-center-readonly-20260606174634.png` |
| `node scripts\smoke-case-crud.mjs` | Pass | `output/playwright/case-crud-20260606174658.png` |
| `node scripts\smoke-case-directory-crud.mjs` | Pass | `output/playwright/case-directory-crud-20260606174722.png` |

Notes:

- Each CRUD smoke created, updated, deleted, and refreshed list or tree state.
- Smoke data was removed after each run.
- Initial `GET /api/auth/me` returned 401 before login in each run. This is expected.
- Case edit smoke verifies `GET /api/cases/{id}` detail preload before update.

## Visual And Overflow Check

| Viewport | Status | Screenshot | Horizontal Overflow |
| --- | --- | --- | --- |
| Desktop `1440x960` | Pass | `output/playwright/case-center-module-desktop-20260606174843.png` | No |
| Mobile `390x844` | Pass | `output/playwright/case-center-module-mobile-20260606174843.png` | No |

Script:

- `node scripts\smoke-case-center-visual.mjs`

Observed layout metrics:

- Desktop `clientWidth=1440`, `scrollWidth=1440`
- Mobile `clientWidth=390`, `scrollWidth=390`

## Quality Gates

| Check | Status | Command |
| --- | --- | --- |
| Lint | Pass | `npm.cmd run lint` |
| Build | Pass | `npm.cmd run build` |
| Scattered Chinese string scan | Pass | Scanned `src` and only `src/shared/i18n/zh-CN.ts` contains user-facing Chinese text. |
| Mojibake keyword scan | Pass | Scanned `src`, `docs`, and `scripts` for common mojibake markers. |

Build note:

- Vite still reports the known Arco/index chunk warning over 500 KB. This is not blocking for the module closeout.

## Current Architecture Shape

- `pages/case-center` composes the page.
- `widgets/case-center-readonly` owns the module area.
- `features/case-create`, `features/case-edit`, and `features/case-delete` own case body actions.
- `features/case-directory-*` own directory actions.
- `entities/case-center` owns item types, payload helpers, directory helpers, and API methods.
- `shared/i18n/zh-CN.ts` owns user-facing Chinese strings.
- `shared/ui` owns reusable app-level UI wrappers.

## Not Final UI

The current Case Center view is a migration and verification surface. The final product page should later evolve toward:

- richer directory navigation and active directory filtering;
- table density controls and search filters;
- pagination;
- drawer-based case create/edit;
- complete detail page;
- batch actions;
- execution, review, attachments, and AI flows;
- more polished operation layout after more modules are migrated.

## Result

Pass. Case Center is closed out as the second complete frontend 2.0 sample module: API contract, Feature-Sliced Lite boundaries, centralized Chinese UI text, readonly list, case CRUD, directory CRUD, smoke evidence, screenshot evidence, overflow check, lint, and build are all recorded.
