# API Automation Page Alignment Phase 3C

Date: 2026-06-07

## Scope

This record covers Phase 3C scenario editor workbench alignment for the API Automation scenario tab.

Included:

- Added a scenario workbench shell with a list tab and an editor tab.
- Moved scenario editing from modal-first interaction toward an in-page editor workspace.
- Added a steps editing area that reuses the existing `ApiScenarioStepEditor`.
- Added a right-side scenario property panel for name, status, description, save, and run actions.
- Kept scenario creation in the existing dialog to avoid widening the contract in this phase.
- Kept readonly detail and run result in the existing drawer.
- Updated smoke coverage for editor tab opening, property panel, step editing, save, reopen, run result, screenshot, and horizontal overflow.
- Updated IF/LOOP controller smoke navigation to use the new list/editor tab workflow.

Not included:

- Pixel-perfect old frontend reproduction.
- Drag sorting.
- New backend APIs.
- Advanced controller expansion.
- Inline scenario creation inside the workbench.
- Moving run history from the detail drawer into the editor tab.
- Full property panel settings such as fail-on-error strategy.

## Old Project Reference

Reference source used:

```text
reference/old-auto/ApiAutomationWorkspace.vue
reference/old-auto/api.ts
reference/old-auto/knowledge-graph.json
```

Key old-project structure referenced:

- Workbench-style tab shell for API automation areas.
- Scenario list and editor mode separation.
- Central step editing area.
- Side property panel pattern for selected scenario metadata and commands.

## Verification

Commands:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run smoke:api-if-loop
node scripts\smoke-api-automation-phase1-3.mjs
node scripts\smoke-api-automation-phase5-7.mjs
```

Results:

- `npm.cmd run typecheck`: pass.
- `npm.cmd run lint`: pass.
- `npm.cmd run build`: pass. Existing Vite chunk-size warning remains.
- `npm.cmd run smoke:api-if-loop`: pass.
- `node scripts\smoke-api-automation-phase1-3.mjs`: pass.
- `node scripts\smoke-api-automation-phase5-7.mjs`: pass.
- Mojibake scan: pass.
- Scattered Chinese scan outside `src/shared/i18n/zh-CN.ts`: pass.
- Feature-Sliced boundary scan for shared/entities/features: pass.

## Smoke Notes

- The Phase 5-7 smoke now scopes scenario step assertions to the visible `api-scenario-editor-workspace`.
- This avoids false failures from hidden Arco tab pane DOM while still verifying the active editor state.
- The smoke covers editing a custom request path, moving steps, deleting a nested API step, saving, reopening, and verifying persisted step data.
- The IF/LOOP smoke now explicitly returns to the scenario list tab after editor hydration checks before opening detail drawers or running scenarios.

## Screenshots

```text
output/playwright/api-scenario-if-loop-20260607095028.png
output/playwright/api-scenario-if-loop-20260607095255.png
output/playwright/api-automation-phase3b-20260607095310.png
output/playwright/api-automation-phase5-7-20260607095500.png
```

## Risks

- The editor workbench is a structural alignment phase; scenario creation still uses the existing dialog.
- The right property panel currently owns scenario metadata and commands, while detailed scenario settings remain planned for later alignment.
- Run history remains in the detail drawer until a future scenario history alignment phase.
