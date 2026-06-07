# API Automation Page Alignment Phase 3M Smoke

Date: 2026-06-07

Phase 3M aligns the shared API run result panel with the old project response shell reference under `reference/old-auto`.

Implemented visual refinements:

- `ApiRunResultPanel` now renders as a shared response shell with header, compact metrics, content panel, and response tabs.
- Definition debug, case run, scenario workbench run, and scenario drawer run continue to reuse the same shared panel.
- Empty result state now uses the shared response shell placeholder instead of separate per-parent placeholder markup.
- Response metrics now show result, status, duration, and response size in a compact header row.
- Response body, headers, assertion results, processor results, steps, and raw result now sit inside one content panel.
- Scenario step result rows are denser and table-like, with order, status, name/message, and duration columns.

Old project references checked:

- `reference/old-auto/ApiAutomationWorkspace.vue` `ms-like-response-shell`
- `reference/old-auto/ApiAutomationWorkspace.vue` `ms-like-response-header`
- `reference/old-auto/ApiAutomationWorkspace.vue` `ms-like-response-metrics`
- `reference/old-auto/ApiAutomationWorkspace.vue` `ms-like-response-tabs`
- `reference/old-auto/ApiAutomationWorkspace.vue` `ms-like-response-content-panel`
- `reference/old-auto/ApiAutomationWorkspace.vue` `ms-like-response-empty`

Smoke coverage:

- Interface request editor response shell exists.
- Interface debug run renders shared result panel.
- Interface debug response panel renders header, metrics, content panel, status, body, and assertion result tab.
- Scenario workbench run result tab renders the shared result panel header and content panel.
- Phase 5-7 scenario run smoke also checks the scenario run result shared panel header and content panel.
- Screenshots are captured by the existing API automation smoke scripts.
- Horizontal overflow checks remain in the existing smoke scripts.

Expected screenshot paths:

- `output/playwright/api-automation-phase3b-<stamp>.png`
- `output/playwright/api-automation-phase3h-editor-<stamp>.png`
- `output/playwright/api-automation-phase3k-scenario-<stamp>.png`
- `output/playwright/api-automation-phase5-7-<stamp>.png`

Out of scope:

- No backend contract changes.
- No run response data structure changes.
- No new business feature.
- No case drawer parity work.
- No scenario rail/list redesign.
- No pixel-level old project reproduction.

Known residual gaps:

- Old project response shell still has richer per-context sections such as actual request and console tabs. This phase only aligns the shared result panel with the confirmed new frontend result tabs.
- Old project visual comparison is still screenshot/manual, not automated pixel diff.
- Case drawer response parity remains Phase 3N.
