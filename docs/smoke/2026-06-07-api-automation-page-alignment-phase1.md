# API Automation Page Alignment Phase 1

Date: 2026-06-07

## Scope

This record covers the first page-experience alignment pass for AutoTestHub API Automation.

Included:

- Layout density.
- Scenario step editor interaction density.
- Run result panel hierarchy.
- Definition, case, and scenario list visual density.
- Screenshot comparison record.

Not included:

- New business features.
- API contract changes.
- Global visual redesign.
- Old frontend replacement.
- AI generation.

## Audit

Current AutoTestHub before screenshot:

```text
output/playwright/api-scenario-if-loop-20260607075437.png
```

Observed issues:

- Main API Automation surface used several separated cards with generous spacing.
- Definition, case, and scenario lists behaved visually like repeated cards instead of dense workbench rows.
- Scenario step editor controls were functionally complete but visually loose, especially for nested steps.
- Run result panel had correct data but weak hierarchy between summary, step rows, and raw payloads.

Old project source read:

- Direct old project file read from `D:\CodeProject\auto` timed out under the current permission flow.
- This phase therefore uses existing contract records, smoke evidence, and the established old-project workbench direction rather than copying old implementation code.

## Changes

Workbench density:

- Converted the API Automation summary metrics into one compact bordered summary strip.
- Reduced API Automation card body padding and section gaps.
- Kept the current Feature-Sliced composition and data flow intact.

List density:

- Changed API definition rows to compact two-column workbench rows.
- Changed API case and API scenario lists to lightweight table-like rows with header labels.
- Made case and scenario rows clickable while preserving action button behavior through click stop propagation.

Step editor:

- Added a compact toolbar surface.
- Reduced button and control heights inside the editor.
- Added clearer nested-step indentation with a primary-colored left guide.
- Added subtle depth background changes for nested rows.

Run result panel:

- Converted status, duration, and final result into a compact summary strip.
- Changed assertion, processor, and step result lists into dense bordered rows.
- Highlighted controller run messages such as `Condition matched`, `Executed`, and `Loop count: N`.

## After Screenshots

Primary after screenshot:

```text
output/playwright/api-scenario-if-loop-20260607081817.png
```

Full Phase 5-7 after screenshot:

```text
output/playwright/api-automation-phase5-7-20260607081848.png
```

## Smoke

Commands:

```powershell
npm.cmd run smoke:api-if-loop
node scripts\smoke-api-automation-phase5-7.mjs
```

Results:

- `smoke:api-if-loop`: pass.
- `smoke-api-automation-phase5-7.mjs`: pass after fixing row click behavior.

Debug note:

- The first Phase 5-7 run failed because the new table-like scenario row made `row.click()` land outside the previous name button target. The root cause was row interaction semantics, not API behavior. The fix made the whole row open detail while action controls stop propagation.

## Risks

- Direct old frontend source comparison was not available in this run because the read permission request timed out.
- This phase improves density and hierarchy but does not attempt pixel parity with the old frontend.
- Existing Vite chunk-size warning remains outside this page-experience scope.
