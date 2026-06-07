# API Automation Phase 7 Scenarios Smoke

Date: 2026-06-07

## Scope

Phase 7 adds basic scenario orchestration inside the API Automation module.

Covered:

- scenario list
- scenario detail
- scenario create
- scenario edit
- scenario delete
- scenario modules readonly display
- step tree
- reference API definition step
- reference API case step
- custom request step
- basic nested step display
- scenario run
- scenario run result display

Explicitly out of scope:

- AI generation
- advanced scenario controllers
- condition/loop/once-only/script controller extensions
- scenario module CRUD
- scenario report deep drilldown beyond current run result display

## Contract Sources

- `docs/api-contract.md`
- `docs/api-automation-migration-analysis.md`
- backend endpoints under `/api/automation/api/scenarios`
- backend endpoints under `/api/automation/api/scenario-modules`
- existing Phase 0-6 definition, case, request, and run result contracts

## New Frontend Changes

- `src/entities/api-automation/model/types.ts`
  - adds scenario item/detail/module/step/save types.
- `src/entities/api-automation/api/apiAutomationApi.ts`
  - adds scenario list/modules/detail/create/update/delete/run wrappers.
- `src/entities/api-automation/lib/scenarioConfig.ts`
  - maps scenario forms to backend-compatible save payloads.
- `src/features/api-scenario-save`
  - owns scenario create/edit dialog and basic step editor.
- `src/features/api-scenario-delete`
  - owns scenario delete confirmation and API call.
- `src/features/api-scenario-run`
  - owns scenario run action.
- `src/widgets/api-scenario-management`
  - owns scenario modules, list, detail drawer, step tree, and run result display.
- `src/widgets/api-automation-shell/ui/ApiAutomationShell.vue`
  - composes scenario management below API case management.

## Smoke Checklist

- Open `/api-automation`.
- Verify scenario modules load through `GET /automation/api/scenario-modules`.
- Verify scenario list loads through `GET /automation/api/scenarios`.
- Create a scenario with a custom request step.
- Add a referenced API definition step.
- Add a referenced API case step.
- Open scenario detail and verify step tree renders.
- Edit the scenario.
- Run the scenario and verify run result display renders.
- Delete the scenario.
- Capture screenshot.
- Verify no horizontal overflow.

## Execution Notes

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
- Created definition: `smoke-phase57-definition-20260606234905`
- Created case: `smoke-phase57-case-20260606234905`
- Created scenario: `smoke-phase57-scenario-20260606234905`
- Screenshot: `output/playwright/api-automation-phase5-7-20260606234905.png`
- Page errors: none
- Horizontal overflow: none
- Cleanup: pass; script deletes smoke scenarios, cases, and definitions in dependency order.
- Console note: one expected pre-login `GET /api/auth/me` 401 appears before successful login.

Successful API evidence:

- `GET /api/automation/api/scenario-modules` returned 200.
- `GET /api/automation/api/scenarios` returned 200.
- `POST /api/automation/api/scenarios` returned 200 for custom request, referenced API definition, and referenced API case steps.
- `POST /api/automation/api/scenarios/{id}/run` returned 200.
- `GET /api/automation/api/scenarios/{id}` returned 200 and rendered the step tree.

Contract correction from closeout audit:

- Referenced API definition step uses `stepType: "API"`, `resourceId: definitionId`, and `resourceType: "DEFINITION"`.
- Referenced API case step uses `stepType: "API_CASE"`, `resourceId: caseId`, and `resourceType: "CASE"`.
- Custom request step uses `stepType: "CUSTOM_REQUEST"` with `resource` set to the request path.
- Earlier guessed field `resource` for referenced steps was rejected by the backend with `Scenario step resource cannot be blank`; this is now fixed and covered by smoke.

## Verification

Completed in final closeout:

- `npm.cmd run lint`
- `npm.cmd run build`
- source Chinese string scan outside `src/shared/i18n/zh-CN.ts`
- docs/scripts mojibake scan
