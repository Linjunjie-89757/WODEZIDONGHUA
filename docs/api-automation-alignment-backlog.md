# API Automation Alignment Backlog

Date: 2026-06-07

This file tracks known follow-up work after API Automation page alignment Phase 3C, so later phases do not depend on chat history.

## Current State

- Phase 3A: workbench shell alignment is complete.
- Phase 3B: API definition request editor shell is complete.
- Phase 3C: scenario editor workbench shell is complete.
- Phase 3D: scenario property panel thickening, run result tab, and latest-run history tab are complete.
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

- Request editor content tabs are shell-level only for several areas.
- Existing definition edit dialog still owns full edit behavior.
- Command-row save action does not perform full inline save.
- Curl import is not implemented.
- AI generation is not implemented.
- Request headers/body/params/auth/pre/post/tests/settings/cases need later in-place editor thickening.

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
   - Add in-place headers/body/params/auth editor behavior where it can reuse existing contract safely.
   - Keep old edit dialog as fallback until inline save is fully verified.

3. Phase 3F: visual precision pass.
   - Compare against `reference/old-auto`.
   - Tune density, spacing, list rows, dialogs, drawers, and command bars.
   - Keep the clean Feature-Sliced Lite structure while aligning the old project's tuned visual feel.

4. Build optimization phase.
   - Split vendor chunks or manual chunks.
   - Keep this separate from page alignment work.

## Guardrails

- Do not modify `D:\CodeProject\auto`.
- Do not commit `reference/old-auto`.
- Keep Chinese UI text in `src/shared/i18n/zh-CN.ts`.
- Keep Arco feedback routed through `shared/lib/feedback`.
- Keep Feature-Sliced Lite boundaries.
- Do not add new backend contract assumptions during visual alignment phases.
