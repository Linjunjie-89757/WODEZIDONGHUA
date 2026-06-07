# API Automation Page Alignment Phase 3O Smoke

Date: 2026-06-07

## Scope

- Phase 3O focuses on scenario rail/list/step inspector precision alignment.
- Only `D:\CodeProject\AutoTestHub` was changed.
- `reference/old-auto` was used as read-only old-project reference and remains untracked.
- No backend contract was added or changed.
- No drag sorting, new controller, AI generation, global drawer/dialog refactor, or narrow-screen special implementation was added.

## Old Project Signals

- Scenario rail reference: `scenario-module-pane`, `ms-like-sidebar-tools`, `ms-like-directory-shell`, `scenario-module-tree`, `ms-like-directory-node`.
- Scenario list reference: `ms-scenario-list-shell`, `ms-scenario-list-toolbar`, `ms-scenario-table`, compact table header and 48px rows.
- Step tree reference: `scenario-step-tree`, `scenario-step-node`, type badge, nested indentation, hover-only actions.
- Inspector reference: old scenario right-side property shell and selected-step area patterns from the scenario editor workbench.

## Implemented

- Scenario module rail now has:
  - compact create/search tool row;
  - directory title with total count;
  - all-scenarios row;
  - dense module rows with counts and full-path hint;
  - selected visual state.
- Scenario list now has:
  - compact toolbar search;
  - ID column;
  - denser rows;
  - status badge;
  - module hint under scenario name;
  - unchanged run/edit/delete behavior.
- Step editor now has:
  - clickable selected-step state;
  - selected row highlight;
  - child step click isolation so nested selection does not bounce to parent.
- Right property panel now has:
  - read-only selected-step inspector;
  - name, type, enabled state, resource reference, and request summary.

## Smoke Coverage

- `scripts/smoke-api-automation-phase1-3.mjs`
  - scenario rail render;
  - scenario rail search;
  - scenario list search;
  - scenario editor open;
  - step row selection;
  - selected-step inspector render;
  - scenario run result panel shell;
  - screenshot and horizontal overflow check.
- `scripts/smoke-api-automation-phase5-7.mjs`
  - scenario editor still opens;
  - selected-step inspector remains available during advanced scenario step smoke;
  - existing scenario CRUD/step edit/run coverage remains intact.

## Screenshot Paths

- `output/playwright/api-automation-phase3k-scenario-<timestamp>.png`
- `output/playwright/api-automation-phase5-7-<timestamp>.png`

## Remaining Gaps

- This is still structural and visual precision alignment, not pixel-level old-project reproduction.
- Module rail rows are local visual rows; selecting modules does not apply a backend filter because no new contract was introduced.
- Selected-step inspector is read-only. Editing selected-step properties from the inspector remains a later phase.
- Drag sorting and old-project exact tree action menus remain deferred.
