# API Automation Phase 6 Cases Smoke

Date: 2026-06-07

## Scope

Phase 6 adds API case management inside the API Automation module.

Covered:

- case list filtered by the selected API definition
- case detail drawer
- case create
- case edit
- case delete
- case run
- run history list
- change history list
- run result display

Explicitly out of scope:

- scenario orchestration
- AI generation
- advanced case import/export
- batch case operations

## Contract Sources

- `docs/api-contract.md`
- `docs/api-automation-migration-analysis.md`
- backend endpoints under `/api/automation/api/cases`
- existing Phase 0-4 request config and run result contracts

## New Frontend Changes

- `src/entities/api-automation/model/types.ts`
  - adds API case item/detail/save/history types.
- `src/entities/api-automation/api/apiAutomationApi.ts`
  - adds case list/detail/create/update/delete/run/history/change-history wrappers.
- `src/entities/api-automation/lib/caseConfig.ts`
  - maps case forms to backend-compatible save payloads.
- `src/features/api-case-save`
  - owns case create/edit dialog and save action.
- `src/features/api-case-delete`
  - owns case delete confirmation and API call.
- `src/features/api-case-run`
  - owns case run action.
- `src/widgets/api-case-management`
  - owns case list, detail drawer, run history, change history, and run result display.
- `src/widgets/api-automation-shell/ui/ApiAutomationShell.vue`
  - composes case management below definition debug.

## Smoke Checklist

- Open `/api-automation`.
- Select an API definition.
- Verify case list loads through `GET /automation/api/cases?definitionId=`.
- Create a case for the selected definition.
- Open case detail drawer.
- Edit the case.
- Run the case and verify run result display renders.
- Verify run history and change history sections render.
- Delete the case.
- Capture screenshot.
- Verify no horizontal overflow.

## Verification

Browser smoke script:

```text
scripts/smoke-api-automation-phase5-7.mjs
```

Executed command:

```powershell
$env:SMOKE_BASE_URL='http://localhost:5173'; node scripts\smoke-api-automation-phase5-7.mjs
```

Result:

- Status: pass
- Created case: `smoke-phase57-case-20260606234905`
- Screenshot: `output/playwright/api-automation-phase5-7-20260606234905.png`
- Page errors: none
- Horizontal overflow: none
- Cleanup: pass; script deletes smoke scenarios, cases, and definitions in dependency order.
- Console note: one expected pre-login `GET /api/auth/me` 401 appears before successful login.

Successful API evidence:

- `GET /api/automation/api/cases` returned 200.
- `GET /api/automation/api/cases?definitionId=24` returned 200.
- `POST /api/automation/api/cases` returned 200.
- `POST /api/automation/api/cases/14/run` returned 200.

Completed in final closeout:

- `npm.cmd run lint`
- `npm.cmd run build`
- source Chinese string scan outside `src/shared/i18n/zh-CN.ts`
- docs/scripts mojibake scan
