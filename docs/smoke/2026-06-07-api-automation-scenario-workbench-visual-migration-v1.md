# API Automation Scenario Workbench Visual Migration V1

Date: 2026-06-07

## Scope

- This phase changes strategy from general experience alignment to old-project code-level visual translation.
- Reference source: `reference/old-auto/ApiAutomationWorkspace.vue`.
- Only `D:\CodeProject\AutoTestHub` was modified.
- `reference/old-auto` remains read-only and untracked.
- No backend contract, API payload, store, route, or old project business logic was copied.

## Old Project Structures Translated

- `scenario-workbench` / `ms-scenario-workbench`
- `scenario-module-pane`
- `ms-like-sidebar-tools`
- `ms-like-directory-shell`
- `scenario-directory-title-row`
- `scenario-main-pane`
- `scenario-editor-tab-strip`
- `ms-like-editor-tab`
- `ms-scenario-list-shell`
- `ms-scenario-list-toolbar`
- `ms-scenario-table`
- `scenario-edit-workspace`
- `scenario-edit-main`
- `scenario-detail-tabs`
- `scenario-property-panel`
- `scenario-property-card`
- `scenario-property-header`
- `scenario-property-body`
- `scenario-property-field`
- old-project-like step row density and hover actions in `ApiScenarioStepEditor`

## Before / After Screenshots

- Before baseline: `output/playwright/api-automation-phase3k-scenario-20260607141850.png`
- After V1 scenario workbench: `output/playwright/api-automation-phase3k-scenario-20260607144030.png`
- Phase 5-7 scenario flow verification: `output/playwright/api-automation-phase5-7-20260607144101.png`

## Smoke Coverage

- `scripts/smoke-api-automation-phase1-3.mjs`
  - scenario rail render;
  - old-project-like list toolbar refresh;
  - scenario list filtering;
  - editor tab open;
  - property panel;
  - selected-step inspector;
  - result panel;
  - screenshot and horizontal overflow check.
- `scripts/smoke-api-automation-phase5-7.mjs`
  - scenario create through rail primary action;
  - scenario edit;
  - step selection and inspector;
  - save;
  - run;
  - detail drawer and result verification.

## Remaining Gaps

- This is not full pixel-level reproduction yet.
- Scenario detail drawer still uses the existing drawer flow and is not part of V1 workbench migration.
- The old project has richer inline step controls such as checkbox/switch/run icon/type badge combinations. V1 translates density and shell first; exact control parity remains a later refinement.
- Module rail selection remains visual only and does not introduce module filtering contract.
- Some top-level API Automation page shell outside the scenario workbench is still the new frontend shell.
