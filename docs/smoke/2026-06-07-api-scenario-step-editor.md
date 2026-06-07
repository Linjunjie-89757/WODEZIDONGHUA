# API Scenario Step Editor Smoke

Date: 2026-06-07

## Scope

This smoke record covers the scenario editor thickening pass.

Covered:

- reference API definition step selection and edit preload.
- reference API case step selection and edit preload.
- custom request method/path edit preload.
- top-level step move up and move down.
- step delete.
- basic nested step editing through a UI step group.
- save, reopen, and verify edited values.
- scenario run after editing and shared run result panel display.

Explicitly out of scope:

- advanced scenario controllers.
- condition, loop, wait, script, once-only controller behavior.
- AI generation.
- backend or old frontend changes.

## Frontend Changes

- `src/features/api-scenario-save/ui/ApiScenarioStepEditor.vue`
  - adds recursive step editing inside the scenario save feature.
  - supports API definition, API case, custom request, and basic step group UI.
  - supports edit, delete, move up, move down, and nested child additions.
- `src/features/api-scenario-save/ui/ApiScenarioDialog.vue`
  - delegates step editing to the recursive editor.
- `src/entities/api-automation/lib/scenarioConfig.ts`
  - adds basic scenario step factories.
  - normalizes scenario steps recursively before save and after detail preload.
- `src/widgets/api-scenario-management/ui/ApiScenarioManagement.vue`
  - adds stable `api-scenario-retry` selector for smoke.
- `scripts/smoke-api-automation-phase5-7.mjs`
  - verifies create, edit preload, custom request edit, move, delete, nested child step, save/reopen, run result, screenshot, and overflow.

## Contract Note

The backend currently rejects `stepType: "GROUP"` with:

```text
Unsupported scenario step type: GROUP
```

So the frontend step group is a UI grouping affordance, not a backend step type. It is saved as a backend-supported `CUSTOM_REQUEST` container with `children`, and the editor recognizes it on reopen by group metadata such as the generated `group-` id/name plus child steps. Advanced controller step types remain out of scope for this pass.

## Smoke Execution

Browser smoke script:

```text
scripts/smoke-api-automation-phase5-7.mjs
```

Executed command:

```powershell
$env:SMOKE_BASE_URL='http://localhost:5173'; node scripts\smoke-api-automation-phase5-7.mjs
```

Result:

- Status: pass.
- Created definition: `smoke-phase57-definition-20260607050833`.
- Created case: `smoke-phase57-case-20260607050833`.
- Created scenario: `smoke-phase57-scenario-20260607050833`.
- Screenshot: `output/playwright/api-automation-phase5-7-20260607050833.png`.
- Page errors: none.
- Horizontal overflow: none.
- Cleanup: pass; script deletes smoke scenarios, cases, and definitions in dependency order.
- Console note: one expected pre-login `GET /api/auth/me` 401 appears before successful login.

Successful API evidence:

- `POST /api/automation/api/scenarios` returned 200 for a scenario with top-level custom/API/API case steps and a nested step group.
- `GET /api/automation/api/scenarios/{id}` returned 200 and preloaded edited steps.
- `PUT /api/automation/api/scenarios/{id}` returned 200 after custom request edit, move, and nested child delete.
- `POST /api/automation/api/scenarios/{id}/run` returned 200.

## Verification

Completed:

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `scripts/smoke-api-automation-phase5-7.mjs`
- source Chinese string scan outside `src/shared/i18n/zh-CN.ts`
- docs/scripts/src replacement-character scan
- Feature-Sliced boundary scan for `features -> widgets` and `entities -> features/widgets/pages`

Known build warning:

- Vite reports the existing Arco-driven `index` chunk above 500 kB. This is not a functional blocker for this pass.
