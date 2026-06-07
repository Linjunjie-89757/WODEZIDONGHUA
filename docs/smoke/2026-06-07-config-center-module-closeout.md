# 2026-06-07 Config Center Module Closeout

## Scope

- New frontend: `D:\CodeProject\AutoTestHub`
- Old backend: `D:\CodeProject\auto\server`
- Frontend URL: `http://localhost:5173`
- Backend base URL: `http://localhost:8080/api`
- Module route: `/config-center`

This closeout verifies Config Center as the first frontend 2.0 migration sample module. It does not mark the current UI as the final product design.

## Migrated Capabilities

| Area | List | Create | Edit | Enable / Disable | Delete | Extra |
| --- | --- | --- | --- | --- | --- | --- |
| Environment configs | Pass | Pass | Pass | Pass | Pass | - |
| Parameter sets | Pass | Pass | Pass | Pass | Pass | - |
| Database connections | Pass | Pass | Pass | Pass | Pass | Test action triggers backend |

## Contract Sources

- Contract table: `docs/api-contract.md`
- Endpoint keys: `src/shared/api/endpoints.ts`
- Entity API: `src/entities/config-center/api/configCenterApi.ts`
- Backend source: `D:\CodeProject\auto\server\src\main\java\com\company\autoplatform\settings\SettingsController.java`

## Smoke Runs

| Script | Status | Screenshot |
| --- | --- | --- |
| `node scripts\smoke-config-env-crud.mjs` | Pass | `output/playwright/config-env-crud-20260606161750.png` |
| `node scripts\smoke-config-param-crud.mjs` | Pass | `output/playwright/config-param-crud-20260606161804.png` |
| `node scripts\smoke-config-db-crud.mjs` | Pass | `output/playwright/config-db-crud-20260606161817.png` |

Notes:

- Each CRUD smoke created, edited, toggled, deleted, and refreshed list state.
- Smoke data was removed after each run.
- Initial `GET /api/auth/me` returned 401 before login in each run. This is expected.
- Database connection test used an intentionally invalid JDBC URL, so `/api/settings/db-connections/test` returned 400. The closeout verifies that the UI action triggers the backend and the CRUD flow continues.

## Visual And Overflow Check

| Viewport | Status | Screenshot | Horizontal Overflow |
| --- | --- | --- | --- |
| Desktop `1440x960` | Pass | `output/playwright/config-center-module-desktop-20260606161908.png` | No |
| Mobile `390x844` | Pass | `output/playwright/config-center-module-mobile-20260606161908.png` | No |

Script:

- `node scripts\smoke-config-center-visual.mjs`

Observed layout metrics:

- Desktop `clientWidth=1440`, `scrollWidth=1440`
- Mobile `clientWidth=390`, `scrollWidth=390`

## Quality Gates

| Check | Status | Command |
| --- | --- | --- |
| Lint | Pass | `npm.cmd run lint` |
| Build | Pass | `npm.cmd run build` |
| Scattered Chinese string scan | Pass | `Get-ChildItem -Path src -Recurse -File \| Select-String -Pattern '[\u4e00-\u9fff]' ...` |
| Mojibake keyword scan | Pass | Scanned `src`, `docs`, and `scripts` for common mojibake markers. |

Build note:

- Vite still reports the known Arco/index chunk warning over 500 KB. This is not blocking for the module closeout.

## Current Architecture Shape

- `pages/config-center` composes the page.
- `widgets/config-center-overview` owns the module area.
- `features/config-env-*`, `features/config-param-*`, and `features/config-db-*` own business actions.
- `entities/config-center` owns item types, payload helpers, and API methods.
- `shared/i18n/zh-CN.ts` owns user-facing Chinese strings.
- `shared/ui` owns reusable app-level UI wrappers.

## Not Final UI

The current Config Center view is a migration and verification surface. The final product page should later evolve toward:

- category navigation or tabs;
- table/list search and filtering;
- pagination and structured toolbar actions;
- drawer-based create/edit flows for larger forms;
- better database test result display;
- structured parameter editing instead of plain JSON only;
- denser operational layout after more modules are migrated.

## Result

Pass. Config Center is closed out as the first complete frontend 2.0 sample module: API contract, Feature-Sliced Lite boundaries, centralized Chinese UI text, CRUD features, smoke evidence, screenshot evidence, overflow check, lint, and build are all recorded.
