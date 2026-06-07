# API Automation Page Alignment Phase 3K Smoke

Date: 2026-06-07

## Scope

Phase 3K aligns the scenario editor visual details with the old project reference under `reference/old-auto`.

Implemented visual refinements:

- Scenario editor workbench shell density.
- Scenario detail tab strip density.
- Right property panel inspector layout.
- Scenario step tree row density, step order marker, type color rail, hover actions, and nested indentation.
- Latest-run history table density.
- Read-only scenario detail drawer step tree badges and type color rail.

## Guardrails

- Only `D:\CodeProject\AutoTestHub` was modified.
- `reference/old-auto` was read only and remains untracked.
- No backend contract was added or changed.
- No new controller, drag sorting, curl import, AI generation, or full-site visual rewrite was added.
- Existing scenario CRUD, step editing, controller editing, save, and run flows are preserved.

## Smoke Coverage

Updated `scripts/smoke-api-automation-phase1-3.mjs` to cover:

- Scenario tab opens.
- Scenario management workbench renders.
- Scenario editor workspace opens for a temporary API-created scenario.
- Step editor renders custom request and grouped child step rows.
- Property panel renders basic info, run context, step stats, and actions.
- History tab and run result tab shells render.
- Scenario workbench has no document-level horizontal overflow.
- Phase 3K screenshot is captured.
- Temporary scenario smoke data is cleaned by API.

Expected screenshot path pattern:

- `output/playwright/api-automation-phase3k-scenario-<timestamp>.png`

## Known Limits

- This is visual-detail alignment, not pixel-level old project reproduction.
- Persistent scenario run-history contract is still not implemented in the new frontend entity layer.
- Step sorting remains up/down buttons. Drag sorting is intentionally deferred.
- Selected-step property editing is still inline in the step editor, not split into a dedicated right-side step inspector.
