# API Automation Page Alignment Phase 3J Smoke

Date: 2026-06-07

## Scope

- Refined request editor parameter table visuals after Phase 3I extraction.
- Compared against `reference/old-auto/ApiAutomationWorkspace.vue`.
- Only changed `D:\CodeProject\AutoTestHub`.
- Did not modify or commit `reference/old-auto`.
- Did not add or change backend contracts.
- Did not add curl import, AI generation, binary/file upload, or new parameter-table behavior.

## Old Project Signals Used

- Parameter rows target a compact workbench density around 44px row height.
- Header, Query, and Body Form tables use more stable fixed columns than the earlier flexible shell.
- Inputs are visually quieter inside rows, with stronger treatment on hover/focus.
- Batch add drawer uses a wider shell around 560px and a large textarea around 360px.
- Batch add helper text is placed in a bordered muted hint area.

## Implemented

- Tuned `ApiRequestParamTable.vue`:
  - tighter grid gap;
  - stable column widths for Header, Query, and Body Form;
  - row height closer to old project density;
  - centered enable column;
  - quieter row inputs/selects;
  - lower-emphasis table tool strip;
  - smaller required marker and length controls.
- Tuned `ApiAutomationShell.vue` batch drawer:
  - 560px width;
  - muted hint block;
  - larger textarea with 360px minimum height.

## Smoke Coverage

Script: `node scripts\smoke-api-automation-phase1-3.mjs`

Covered:

- headers batch add;
- params batch add;
- body form batch add;
- enable all;
- disable all;
- clear empty rows;
- body type switching;
- cases tab embedding;
- debug send;
- response panel display;
- screenshot capture;
- horizontal overflow check;
- test data cleanup.

Latest verified screenshots:

- `output/playwright/api-automation-phase3b-20260607123342.png`
- `output/playwright/api-automation-phase3h-editor-20260607123342.png`

## Known Residual Risks

- This is still not pixel-level old project reproduction.
- Drag sorting handles from the old project are not implemented for request parameters.
- Batch add advanced standard mode from the old project is not implemented; Phase 3H intentionally supports only `key=value`, `key: value`, and `key`.
- Existing Vue warning `toRefs() expects a reactive object but received a plain one` still appears during smoke; it predates this phase.
- Initial unauthenticated `GET /api/auth/me` returns `401` before login during smoke; this is expected.
