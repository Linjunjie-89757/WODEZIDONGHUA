# API Automation Page Alignment Phase 3A

Date: 2026-06-07

## Scope

This record covers Phase 3A workbench shell alignment based on `docs/api-automation-old-project-alignment-audit.md`.

Included:

- Converted the API Automation module from a stacked-card layout into a tabbed workbench shell.
- Added first-class workbench tabs for definitions, cases, and scenarios.
- Moved environment and variable-set selection into a compact run-context toolbar.
- Kept definitions, cases, scenarios, debug, run result, CRUD, and run behavior on existing API contracts.
- Updated key smoke scripts to switch workbench tabs before case and scenario operations.

Not included:

- Execution, reports, or settings tabs.
- Curl import.
- AI generation.
- New API contracts.
- Scenario editor workspace replacement.
- Pixel-perfect old frontend reproduction.

## Old Project Reference

This phase uses the copied read-only reference files:

```text
reference/old-auto/ApiAutomationWorkspace.vue
reference/old-auto/api.ts
reference/old-auto/knowledge-graph.json
```

Key old-project patterns adopted in this phase:

- A single API Automation workbench frame instead of unrelated stacked cards.
- Top-level workbench tabs as the primary module switcher.
- Compact toolbar-level run context.
- Definition rail plus editor/debug surface inside the definitions tab.

## Verification

Commands:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run smoke:api-if-loop
node scripts\smoke-api-automation-phase5-7.mjs
```

Results:

- `npm.cmd run typecheck`: pass.
- `npm.cmd run lint`: pass after excluding read-only `reference/` files from ESLint.
- `npm.cmd run build`: pass. Existing Vite chunk-size warning remains.
- `npm.cmd run smoke:api-if-loop`: pass.
- `node scripts\smoke-api-automation-phase5-7.mjs`: pass.
- Mojibake scan: pass after removing the literal scan-pattern example from this document.
- Scattered Chinese scan outside `src/shared/i18n/zh-CN.ts`: pass.
- Feature-Sliced boundary scan for shared/entities/features/widgets/pages: pass.

## Screenshots

```text
output/playwright/api-scenario-if-loop-20260607090927.png
output/playwright/api-automation-phase5-7-20260607090946.png
```

## Risks

- This phase changes structure, not deep editor behavior. Request editor tabs and scenario editor tabs remain future phases.
- Case and scenario widgets are now tab-mounted, so tests and users must switch tabs to operate those areas.
- Existing Vite chunk-size warning remains outside this scope.
