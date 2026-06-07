# API Automation Page Alignment Phase 3N Smoke

Date: 2026-06-07

Phase 3N aligns API case management and the case detail drawer with the old project case drawer and case table reference under `reference/old-auto`.

Implemented visual refinements:

- API case list now has a denser table-workbench shell with stable row height, compact header, action area, and pagination summary.
- API case detail drawer now has an old-project-like header summary with title, definition subtitle, method tag, and path summary.
- Drawer view tabs now separate detail, run history, and change history.
- Detail tab keeps the case metadata and reuses the Phase 3M `ApiRunResultPanel` for latest run results and empty result state.
- Run history tab now has a list/detail structure.
- Run history detail uses the confirmed existing history detail contract and adapts it into the shared `ApiRunResultPanel`.
- Change history now renders as a compact timeline-like list.

Old project references checked:

- `reference/old-auto/ApiAutomationWorkspace.vue` `ApiCaseDrawer`
- `reference/old-auto/ApiAutomationWorkspace.vue` `case-drawer-view-tabs`
- `reference/old-auto/ApiAutomationWorkspace.vue` `case-drawer-history-panel`
- `reference/old-auto/ApiAutomationWorkspace.vue` `case-drawer-history-list-shell`
- `reference/old-auto/ApiAutomationWorkspace.vue` `case-list-table-wrap`
- `reference/old-auto/ApiAutomationWorkspace.vue` `case-list-pagination`

Smoke coverage:

- Cases tab and embedded cases editor render the dense case list shell.
- Case list pagination summary is visible.
- Case drawer opens from a case row.
- Case drawer detail, run history, and change history tabs are visible.
- Case run result continues to render through the shared run result panel.
- Run history list and run history detail render.
- Run history detail result panel renders.
- Change history surface renders.
- Existing screenshots and horizontal overflow checks remain covered by the API automation smoke scripts.

Expected screenshot paths:

- `output/playwright/api-automation-phase3b-<stamp>.png`
- `output/playwright/api-automation-phase3h-editor-<stamp>.png`
- `output/playwright/api-automation-phase3k-scenario-<stamp>.png`
- `output/playwright/api-automation-phase5-7-<stamp>.png`

Out of scope:

- No backend contract changes.
- No case CRUD or run response data structure changes.
- No AI generation.
- No global drawer/dialog redesign.
- No scenario rail/list work.

Known residual gaps:

- Old project case drawer has richer request editor tabs inside the drawer. This phase keeps the new frontend's existing case edit dialog path and focuses the detail drawer on read/run/history parity.
- Old project visual comparison is still screenshot/manual, not automated pixel diff.
- Exact old project table column settings and dropdown-more action menu are deferred.
