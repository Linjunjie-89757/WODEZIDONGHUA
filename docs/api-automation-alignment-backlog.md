# API Automation Alignment Backlog

Date: 2026-06-07

This file tracks known follow-up work after API Automation page alignment Phase 3I, so later phases do not depend on chat history.

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
- Old project reference files are available under `reference/old-auto` for local comparison only.
- `reference/` is intentionally untracked and should not be committed.

## Visual Alignment Backlog

- Pixel-level old project reproduction is not complete.
- Current alignment is structural and workflow-level, not exact spacing/color/component parity.
- Need a later visual precision phase for:
  - top information architecture;
  - API definition request editor density;
  - scenario editor density;
  - drawer and dialog sizing;
  - toolbar button hierarchy;
  - table/list row height;
  - empty/loading/error states;
  - mobile and narrow viewport behavior.

## Scenario Workbench Backlog

- Scenario creation still uses the existing dialog.
- Scenario editing now uses the workbench, but the editor is still a shell-level alignment.
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
- Step hierarchy is functional, but not yet old-project exact.
- Sorting uses up/down buttons; drag sorting is not implemented.
- Advanced controller nested-rule expansion is not implemented.
- Step group visual treatment can be closer to old project.
- Selected-step property editing is not separated into a right-side inspector yet.

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

## Validation And Tooling Backlog

- Build passes, but Vite still reports the existing large chunk warning for `index` bundle.
- Smoke scripts are now adapted for scenario list/editor tabs, but should avoid parallel execution against the same backend data set unless isolated.
- Initial unauthenticated `GET /api/auth/me` returns `401` during smoke before login; this is expected, but logs should continue to make that clear.
- Screenshot comparison is still manual by screenshot paths, not automated pixel diff.
- Old project visual comparison is not automated.

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

7. Build optimization phase.
   - Split vendor chunks or manual chunks.
   - Keep this separate from page alignment work.

## Guardrails

- Do not modify `D:\CodeProject\auto`.
- Do not commit `reference/old-auto`.
- Keep Chinese UI text in `src/shared/i18n/zh-CN.ts`.
- Keep Arco feedback routed through `shared/lib/feedback`.
- Keep Feature-Sliced Lite boundaries.
- Do not add new backend contract assumptions during visual alignment phases.
