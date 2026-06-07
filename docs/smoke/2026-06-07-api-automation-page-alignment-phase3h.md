# API Automation Page Alignment Phase 3H Smoke

Date: 2026-06-07

## Scope

- Closed request editor batch-add and parameter table interactions.
- Only changed `D:\CodeProject\AutoTestHub`.
- Did not modify or commit `reference/old-auto`.
- Did not add backend contracts, curl import, AI generation, binary/file upload, full-site visual redesign, or pixel-level reproduction.

## Old Project Reference

- `reference/old-auto/ApiAutomationWorkspace.vue` uses a drawer-style batch add flow.
- Old project table headers provide batch add and table-level enablement controls.
- Old project ignores empty lines and keeps typed rows as key/value parameter rows.

## Implemented

- Headers, Params, and Body Form now expose compact table tools:
  - batch add;
  - enable all;
  - disable all;
  - clear empty rows.
- Batch add drawer supports:
  - `key=value`;
  - `key: value`;
  - `key`.
- Added rows reuse the existing `ApiKeyValue` defaults:
  - `enabled: true`;
  - `paramType: string`;
  - `required: false`;
  - `encode: false`;
  - `minLength: null`;
  - `maxLength: null`.
- Chinese UI text is centralized in `src/shared/i18n/zh-CN.ts`.
- Empty batch input warns through `shared/lib/feedback`.

## Smoke Coverage

Script: `node scripts\smoke-api-automation-phase1-3.mjs`

Covered:

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

- `output/playwright/api-automation-phase3b-20260607121406.png`
- `output/playwright/api-automation-phase3h-editor-20260607121406.png`

## Known Residual Risks

- Parameter table implementation is still repeated inside `ApiAutomationShell.vue`; Phase 3I should extract a reusable local component without changing behavior.
- Body binary/file upload remains intentionally out of scope.
- Curl import and AI generation remain intentionally out of scope.
- Existing Vue warning `toRefs() expects a reactive object but received a plain one` still appears during smoke; it predates this phase and did not block smoke.
- Initial unauthenticated `GET /api/auth/me` returns `401` before login during smoke; this is expected.
