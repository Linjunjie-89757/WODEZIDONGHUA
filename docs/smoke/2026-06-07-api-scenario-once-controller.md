# API Scenario Once-only Controller Smoke

Date: 2026-06-07

## Scope

This smoke record covers API Automation advanced controller Phase A3 in AutoTestHub frontend 2.0.

Implemented scope:

- Add once-only controller entry in the scenario step editor.
- Create once-only controller steps.
- Edit once-only controller step name.
- Add basic child steps under the controller: referenced API, referenced case, and custom request are available in UI.
- Smoke verifies custom request child add, edit, sort, delete, save, hydrate, and reopen.
- Run scenario and display the once-only controller synthetic result in the shared API run result panel.

Not included:

- Condition controller.
- Loop controller.
- Script controller changes.
- Drag sorting.
- AI generation.
- Backend contract changes.

## Contract

Verified contract source:

- `docs/api-automation-advanced-controllers-contract.md`
- Old backend `ApiAutomationService.executeOnceOnlyControllerStep`
- Old frontend `ApiAutomationWorkspace.vue`

Persisted step contract:

```text
stepType: ONCE_ONLY_CONTROLLER
fields: id, stepName, enabled, children
```

The controller does not require request config, resource id, assertions, pre processors, or post processors.

Runtime behavior:

- Backend uses `step.id` as the once-only key.
- If `id` is blank, backend falls back to `stepName`, then a generated key.
- First encounter in a scenario run returns a synthetic controller result with message `Executed`.
- Later encounters with the same key in the same run return `Skipped` and do not execute children.

Smoke coverage note:

- This smoke covers the first-run `Executed` path through the controller result row.
- Stable duplicate-key `Skipped` behavior is documented from backend contract but is not forced in smoke, because building a duplicate controller key through normal UI would be an artificial test-only path.

## Smoke

Command:

```powershell
npm.cmd run smoke:api-once
```

Latest result:

```text
status: pass
scenario: smoke-once-scenario-20260607071019
once step: smoke-once-step-20260607071019
child step: smoke-once-child-20260607071019
```

Screenshot:

```text
output/playwright/api-scenario-once-20260607071019.png
```

Covered checks:

- Login and API Automation page load.
- Cleanup of stale `smoke-once-scenario-*` test data.
- Once-only controller add button exists.
- Save payload uses backend step type `ONCE_ONLY_CONTROLLER`.
- Save payload does not contain frontend-only or invented types: `GROUP`, `ONCE_CONTROLLER`, `ONCE_ONLY`.
- Once-only controller persists exactly one custom request child after deleting the extra child.
- Edit dialog hydrates once-only controller and children.
- Child custom request path edits persist after save and reopen.
- Once-only controller top-level sorting controls work.
- Scenario run completes.
- Shared run result panel displays the once-only controller step row.
- Screenshot is captured.
- Page has no horizontal overflow.
- Created smoke scenario is deleted by API cleanup.

## Risks

- The backend run response type currently exposes controller synthetic rows, but the frontend result model does not surface the controller message field directly. The result panel verifies the controller row by step name.
- `Skipped` behavior depends on stable duplicate once-only keys inside one scenario run. Normal UI does not intentionally create duplicate ids.
