# Visual Reproduction S0/S1 Smoke Record

## Scope

- S0: home page and main layout shell.
- S1: API automation scenario list/editor shell.
- Source of truth: old frontend screenshots captured from `http://localhost:4173`.
- New frontend: `http://localhost:5173`.
- No backend contract changes. No old project changes.

## Screenshot Matrix

| Phase | Target | Before | After |
| --- | --- | --- | --- |
| S0 home shell | `output/playwright/visual-targets/old-s0-dashboard.png` | `output/playwright/visual-targets/new-s0-dashboard-before.png` | `output/playwright/visual-targets/new-s0-dashboard-after.png` |
| S1 scenario shell | `output/playwright/visual-targets/old-s1-scenario-list.png` | `output/playwright/visual-targets/new-s1-scenario-before-live.png` | `output/playwright/visual-targets/new-s1-scenario-after.png` |

## S0 Result

- Reproduced dark 240px sidebar, brand block, old menu ordering, active menu state, bottom user block.
- Reproduced 56px top bar with page title, workspace selector, notification and user block.
- Reproduced workbench empty-state card in the content center.
- Changed root route redirect to `/dashboard` to match old project login landing.

Remaining visual deltas:
- Sidebar icons are CSS approximations, not exact old SVG paths.
- Brand text spacing differs slightly because the new project uses `AutoTestHub` in i18n while the old screenshot shows `Auto Test Hub`.

## S1 Result

- Scenario tab now hides the new-project overview header and metrics toolbar.
- Workbench now starts directly below the app top bar, with old-like rounded white shell.
- Scenario workbench uses old-like module rail, editor tab strip, main step area and right property panel.
- Property action order now matches old screenshot: execute first, save second.
- Horizontal overflow check passed for the captured scenario page.

Remaining visual deltas:
- Step editor internals still use AutoTestHub's existing controller/step model and controls, so it is not a pixel-level clone of the old project step row.
- The old screenshot has a delete-scenario action in the property panel; this phase did not move or duplicate existing delete behavior.
- Some exact icon glyphs, tree expand glyphs and field labels remain approximations.
- Scenario data differs between environments, so row names and counts are not expected to match screenshot text exactly.

## Commands

- `npm.cmd run typecheck`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed. Vite still reports the existing large `index` chunk warning.
- `node scripts/smoke-auth-workspace-ai.mjs`: exited 0. The script still reports its old `pageTitle` probe as `系统设置`, so it is not used as the final S0 visual assertion after the root redirect changed to `/dashboard`.
- `node scripts/smoke-api-automation-phase5-7.mjs`: passed, screenshot `output/playwright/api-automation-phase5-7-20260607153426.png`.
- Scenario screenshot capture checked `documentElement.scrollWidth > clientWidth === false`.
- Mojibake scan: 0 hits after using Unicode codepoint patterns.
- Scattered Chinese scan outside `src/shared/i18n/zh-CN.ts`: 0 hits.
- Feature-Sliced import boundary scan: 0 hits.
- `git diff --check`: passed.

## Next Recommended Phase

Phase S2 should focus on code-level step editor reproduction:

- step row control density;
- old-like add-step row and step type chips;
- right property panel field ordering including delete action placement;
- exact old folder/tree icons if we decide to port SVG assets.
