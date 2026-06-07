# API Automation Page Alignment Phase 3I Smoke

Date: 2026-06-07

## Scope

- Extracted the repeated request parameter table UI into `ApiRequestParamTable.vue`.
- Reused the component for headers, Params, and Body Form in `ApiAutomationShell.vue`.
- Kept behavior, backend contract, test IDs, and smoke coverage unchanged.
- Did not modify `reference/old-auto`.
- Did not add curl import, AI generation, binary/file upload, or new backend assumptions.

## Implementation Notes

- `ApiRequestParamTable.vue` owns:
  - table tool strip;
  - batch-add trigger;
  - enable all / disable all / clear empty actions;
  - key/value/type/required/length/encode/description row rendering;
  - row add and delete actions.
- `ApiAutomationShell.vue` still owns:
  - API definition detail form state;
  - batch add drawer state;
  - batch input parsing;
  - save/debug orchestration.

## Smoke Coverage

Script: `node scripts\smoke-api-automation-phase1-3.mjs`

Covered by unchanged 3H regression flow:

- headers batch add;
- params batch add;
- body form batch add;
- `key=value`, `key: value`, and `key` parsing;
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

- `output/playwright/api-automation-phase3b-20260607122511.png`
- `output/playwright/api-automation-phase3h-editor-20260607122511.png`

## Known Residual Risks

- The shared table component is still local to the API automation shell widget; that is intentional for Phase 3I because no other module consumes it yet.
- Body binary/file upload remains intentionally out of scope.
- Curl import and AI generation remain intentionally out of scope.
- Existing Vue warning `toRefs() expects a reactive object but received a plain one` still appears during smoke; it predates this phase.
- Initial unauthenticated `GET /api/auth/me` returns `401` before login during smoke; this is expected.
