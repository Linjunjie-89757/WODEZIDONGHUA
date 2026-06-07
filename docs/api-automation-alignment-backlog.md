# API Automation Alignment Backlog

Date: 2026-06-07

This file tracks known follow-up work after API Automation page alignment Phase 3L, so later phases do not depend on chat history.

## Current State

- Phase 3A: workbench shell alignment is complete.
- Phase 3B: API definition request editor shell is complete.
- Phase 3C: scenario editor workbench shell is complete.
- Phase 3D: scenario property panel thickening, run result tab, and latest-run history tab are complete.
- Phase 3E: API definition request editor tab thickening is complete.
- Phase 3F: API definition request editor visual precision pass is complete.
- Phase 3G: API definition advanced parameter table and embedded cases tab refinement is complete.
- Phase 3H: request editor batch add and parameter table interaction closure is complete.
- Phase 3I: request parameter table component extraction is complete.
- Phase 3J: request editor detail visual alignment is complete.
- Phase 3K: scenario editor visual detail alignment is complete.
- Phase 3L: overall closure audit is complete.
- Phase 3M: shared response result panel old-project shell alignment is complete.
- Old project reference files are available under `reference/old-auto` for local comparison only.
- `reference/` is intentionally untracked and should not be committed.

## Visual Alignment Backlog

- Pixel-level old project reproduction is not complete.
- Current alignment is structural and workflow-level, not exact spacing/color/component parity.
- The current API Automation module is close at the structure/workflow level:
  - three main workbench tabs are present;
  - API definition request editor has a left rail, request editor, content tabs, and response shell;
  - cases are embedded in the request editor and available in the workbench cases tab;
  - scenario editor has list/editor tabs, step tree, right property panel, run result, and history shells.
- The remaining gap is mostly old-project component parity:
  - response panels now use a shared old-project-like shell, but exact per-context old project tabs such as console/actual request are still not implemented;
  - case management still needs the old `ApiCaseDrawer`-like detail/run-history/change-history drawer experience;
  - scenario list/module rail still has a larger empty-card feel than the old table/tree workbench;
  - dialogs and drawers still need consistent old-project sizing, title bars, footers, and control density;
  - mobile and narrow viewport behavior is smoke-checked for overflow only, not visually tuned.

## Scenario Workbench Backlog

- Scenario creation still uses the existing dialog.
- Scenario editing now uses the workbench, but the editor is still a shell-level alignment.
- Scenario module rail renders, but old-project parity still needs:
  - search/tool row density;
  - current-node selection treatment;
  - smaller row height;
  - less empty vertical card space.
- Right property panel currently covers:
  - scenario name;
  - status;
  - description;
  - environment and variable set;
  - step statistics;
  - latest run result;
  - save;
  - run.
- Right property panel still needs later expansion for:
  - fail-on-error / continue strategy if supported by contract;
  - timeout and execution settings if supported by contract;
  - selected step metadata;
  - selected step quick actions.
- Scenario history is now available in the editor workbench as latest-run step results.
- Scenario run result is now available in the editor workbench through the shared result panel.
- Persistent scenario run-history contract is not implemented because no confirmed backend contract exists in the current new frontend entity layer.

## Step Editor Backlog

- Step editing supports existing basic and advanced controller phases, but visual precision is not final.
- Step hierarchy is now closer to the old project tree density with step order, type color rail, hover actions, and nested indentation, but not yet pixel-level exact.
- Sorting uses up/down buttons; drag sorting is not implemented.
- Advanced controller nested-rule expansion is not implemented.
- Step group visual treatment can be closer to old project.
- Selected-step property editing is not separated into a right-side inspector yet.
- Step config drawers for custom/system/script steps are not yet visually aligned to the old `scenario-step-config-*` drawer shell.

## API Definition Request Editor Backlog

- Request editor content tabs now have basic editable surfaces for headers, params, body, auth, pre, post, tests, and settings.
- Existing definition edit dialog remains as the fallback full edit path.
- Command-row save now performs inline update through the confirmed definition update contract.
- Headers, params, and form body now support advanced table fields for type, required marker, length range, encoding, description, and enablement.
- Headers, params, and form body now support batch add from `key=value`, `key: value`, and `key` input.
- Headers, params, and form body now support all-enable, all-disable, and clear-empty-row tools.
- Body tab supports `none`, `x-www-form-urlencoded`, `json`, `xml`, and `text` shell modes.
- Cases tab now embeds the existing API case management widget inside the request editor with a denser table-like shell.
- Curl import is not implemented.
- AI generation is not implemented.
- Body binary/file upload behavior is not implemented.
- Old-project table column settings are still deferred.
- Embedded cases reuse the existing case management widget and are closer in density, but not yet old-project exact.
- Parameter table rendering is now centralized in `ApiRequestParamTable.vue`.
- Parameter table columns, row density, tool strip, and batch drawer are closer to the old project workbench style.

## Phase 3L Closure Audit Matrix

| Area | Current New Frontend State | Old Project Signal | Gap Type | Suggested Phase |
| --- | --- | --- | --- | --- |
| API definition workbench | Structure is aligned: rail, list, editor tab, command row, request content tabs, response shell. | `ms-like-layout`, `ms-like-sidebar`, `ms-like-main`, `ms-like-tab-strip`, `ms-like-request-row`. | Visual | Phase 3M for response shell, Phase 3O for top IA/list rail polish. |
| Request parameters | Advanced parameter table, batch add, enable/disable, clear empty rows are implemented. | `ms-like-param-table-grid`, drag handle cells, stable 44px-ish row density. | Interaction | Later optional phase for drag handle shell or real drag sorting. |
| Response panel | Shared `ApiRunResultPanel` now uses a response shell with header, compact metrics, content panel, tabs, empty state, response, assertions, processors, steps, and raw result. | `ms-like-response-shell` with header, metrics, response tabs, content panel, and richer empty state. | Visual | Phase 3M complete; later optional context tabs only if contract supports them. |
| Cases tab | Existing case management widget is embedded and denser than before. | Old project uses table density plus `ApiCaseDrawer` with detail/run history/change history tabs and response shell. | Visual + Interaction | Phase 3N. |
| Scenario list/module rail | Scenario workbench shell exists; right property panel and step editor are refined. | `scenario-editor-tab-strip`, `ms-scenario-table`, `scenario-module-pane`, `scenario-property-card`. | Visual | Phase 3O. |
| Scenario steps | Step tree is compact with order marker, type rail, hover actions, nested indentation. | `scenario-step-tree`, `scenario-step-node`, hover-only actions, inline edit affordances. | Visual + Interaction | Phase 3O, then optional selected-step inspector phase. |
| Scenario run/history | Latest run result and history shells are in workbench tabs. | Old project has richer response shells for scenario step/system/custom/script result panels. | Visual + Contract | Phase 3M for result shell; persistent history only after confirmed contract. |
| Dialogs/drawers | Batch drawer has been tuned; create/edit dialogs and case/scenario drawers are mixed. | Old project drawer/dialog bodies use fixed title bars, footer rhythm, and dense request sections. | Visual | Later Phase 3P. |
| Narrow viewport | Existing smoke checks document-level horizontal overflow. | Old project has responsive overrides around `ms-like-layout`, sidebar, request row, scenario config body. | Visual | Later responsive audit phase. |

## Phase 3L Recommended Follow-Up Order

1. Phase 3M: response shell parity.
   - Align `ApiRunResultPanel` with the old `ms-like-response-shell` hierarchy.
   - Scope: header, metrics, tabs, empty state, body/content panel density.
   - Do not change run contracts.
   - Complete. See `docs/smoke/2026-06-07-api-automation-page-alignment-phase3m.md`.

2. Phase 3N: case drawer and case management parity.
   - Align API case list/detail/run-history/change-history surfaces with old `ApiCaseDrawer`.
   - Scope: drawer shell, view tabs, history list/detail split, response shell reuse.
   - Only use confirmed existing case contracts.

3. Phase 3O: scenario rail/list/step inspector polish.
   - Align scenario module rail and scenario list table density.
   - Improve step tree inline affordances and evaluate selected-step inspector as a separate UI shell.
   - Do not add drag sorting unless separately scoped.

4. Phase 3P: dialog/drawer consistency pass.
   - Normalize create/edit dialog sizing, drawer title/footer rhythm, and dense form rows across API Automation.
   - Keep this separate from response/case/scenario work.

5. Phase 3Q: narrow viewport visual audit.
   - Go beyond document overflow checks and inspect desktop-narrow/mobile layouts.
   - Decide whether API Automation should be responsive or intentionally desktop-first with controlled horizontal scroll.

## Phase 3K Scenario Editor Alignment Notes

- Scenario workbench editor tab now uses a tighter old-project-like shell:
  - flat editor tab strip;
  - zero-padding main editor area;
  - compact detail tabs;
  - right inspector-style property panel with header, grouped fields, stats, and action footer.
- Scenario step editor now uses:
  - compact 48px rows;
  - left step order marker;
  - colored step-type rail;
  - hover/focus action visibility;
  - tighter nested-step indentation.
- Latest-run history table now uses tighter columns and row height.
- Scenario detail drawer step tree uses matching type badges and color rail so detail/read-only view does not drift away from editor styling.

## Validation And Tooling Backlog

- Build passes, but Vite still reports the existing large chunk warning for `index` bundle.
- Smoke scripts are now adapted for scenario list/editor tabs, but should avoid parallel execution against the same backend data set unless isolated.
- Initial unauthenticated `GET /api/auth/me` returns `401` during smoke before login; this is expected, but logs should continue to make that clear.
- Screenshot comparison is still manual by screenshot paths, not automated pixel diff.
- Old project visual comparison is not automated.
- Phase 3L did not add page implementation. It uses existing latest screenshots:
  - `output/playwright/api-automation-phase3b-20260607125353.png`;
  - `output/playwright/api-automation-phase3h-editor-20260607125353.png`;
  - `output/playwright/api-automation-phase3k-scenario-20260607125353.png`;
  - `output/playwright/api-scenario-if-loop-20260607125534.png`.

## Suggested Next Phases

1. Phase 3D: scenario workbench thickening.
   - Complete. See `docs/smoke/2026-06-07-api-automation-page-alignment-phase3d.md`.

2. Phase 3E: API definition request editor thickening.
   - Complete. See `docs/smoke/2026-06-07-api-automation-page-alignment-phase3e.md`.

3. Phase 3F: visual precision pass.
   - Complete. See `docs/smoke/2026-06-07-api-automation-page-alignment-phase3f.md`.

4. Phase 3G: advanced parameter table and embedded cases tab refinement.
   - Complete. See `docs/smoke/2026-06-07-api-automation-page-alignment-phase3g.md`.

5. Phase 3H: request editor batch add and parameter table interaction closure.
   - Complete. See `docs/smoke/2026-06-07-api-automation-page-alignment-phase3h.md`.

6. Phase 3I: request parameter table component extraction.
   - Complete. See `docs/smoke/2026-06-07-api-automation-page-alignment-phase3i.md`.

7. Phase 3J: request editor detail visual alignment.
   - Complete. See `docs/smoke/2026-06-07-api-automation-page-alignment-phase3j.md`.

8. Phase 3K: scenario editor visual detail alignment.
   - Complete. See `docs/smoke/2026-06-07-api-automation-page-alignment-phase3k.md`.

9. Phase 3L: overall closure audit.
   - Complete. See `docs/smoke/2026-06-07-api-automation-page-alignment-phase3l.md`.

10. Build optimization phase.
   - Split vendor chunks or manual chunks.
   - Keep this separate from page alignment work.

## Guardrails

- Do not modify `D:\CodeProject\auto`.
- Do not commit `reference/old-auto`.
- Keep Chinese UI text in `src/shared/i18n/zh-CN.ts`.
- Keep Arco feedback routed through `shared/lib/feedback`.
- Keep Feature-Sliced Lite boundaries.
- Do not add new backend contract assumptions during visual alignment phases.
