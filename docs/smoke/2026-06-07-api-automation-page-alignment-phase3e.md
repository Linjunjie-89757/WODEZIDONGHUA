# API Automation Page Alignment Phase 3E

Date: 2026-06-07

## Scope

Phase 3E thickened the API definition request editor inside the existing workbench shell.

Implemented:

- selected definition detail loading into the request editor;
- inline method and path editing in the command row;
- inline save through the confirmed `updateDefinition` contract;
- headers tab with basic key/value editing;
- params tab with basic key/value editing;
- body tab with RAW body editing;
- auth tab using the existing `authConfig` contract with `NONE`, `BASIC`, and `DIGEST`;
- pre/post tabs reusing the existing processor editor;
- tests tab reusing the existing assertion editor;
- settings tab for name, directory, timeout, and description;
- response shell still bound to the shared `ApiRunResultPanel`;
- smoke assertions for each request editor tab and debug run result.

Not implemented:

- curl import;
- AI generation;
- new backend contract;
- full multi-row key/value table editing;
- moving the interface cases page fully into the request editor cases tab;
- pixel-level old-project reproduction.

## Contract Notes

- The request editor uses existing API definition detail and update contracts.
- `authConfig` is now preserved in the definition form model so inline save does not drop backend auth fields.
- Headers and params intentionally remain single-row because the current definition form model only has one key/value pair for each. Multi-row editing belongs to a later Phase 3F or request editor precision pass.

## Smoke Coverage

Updated script:

- `scripts/smoke-api-automation-phase1-3.mjs`

Covered:

- create API definition;
- edit API definition through existing dialog;
- open request editor shell;
- verify headers, params, body, auth, pre, post, tests, and settings tabs expose real editor surfaces;
- send debug request;
- verify response panel and assertion results;
- screenshot;
- horizontal overflow check;
- cleanup test data.

Latest screenshot paths are emitted by the smoke script:

- full page: `output/playwright/api-automation-phase3b-<stamp>.png`
- request editor detail: `output/playwright/api-automation-phase3e-editor-<stamp>.png`

## Risks

- Smoke still logs the expected unauthenticated `GET /api/auth/me` 401 before login.
- Smoke currently records Vue `toRefs()` warnings from runtime component rendering; no page errors were observed. Keep watching this during the next precision pass.
- The current screenshot comparison is manual, not automated pixel diff.
