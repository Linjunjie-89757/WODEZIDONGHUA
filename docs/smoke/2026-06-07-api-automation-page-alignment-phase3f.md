# API Automation Page Alignment Phase 3F

Date: 2026-06-07

## Scope

Phase 3F performs a focused old-project visual precision pass for the API definition request editor.

Implemented:

- headers tab now uses a compact multi-row key/value table;
- params tab now uses a compact multi-row key/value table;
- body tab now has basic body mode chips for `raw`, `x-www-form-urlencoded`, and `none`;
- form body mode supports multi-row key/value editing;
- cases tab now embeds the existing API case management widget inside the request editor;
- response panel is hidden while the cases tab is active, matching the old project request editor behavior;
- request editor table rows, chip controls, and embedded cases area were tightened to a denser workbench feel;
- smoke now checks detail-state horizontal overflow before taking the request editor screenshot.

Not implemented:

- curl import;
- AI generation;
- old-project batch add;
- advanced query/body metadata such as param type, length range, encoding, and required marker;
- table column settings;
- pixel-level old project reproduction.

## Contract Notes

- No backend API contract was added.
- The definition form model now preserves `queryParams`, `headers`, `bodyType`, and `bodyFormItems` arrays.
- Existing single-field dialog compatibility fields remain in place.
- Inline save continues to use the existing definition update contract.

## Smoke Coverage

Updated script:

- `scripts/smoke-api-automation-phase1-3.mjs`

Covered:

- multi-row headers add/edit UI;
- multi-row params add/edit UI;
- body mode switching;
- form body row edit UI;
- cases tab embedded API case management;
- debug send after returning to request body tab;
- response panel display;
- assertion result display;
- request editor screenshot;
- detail-state and final horizontal overflow checks;
- cleanup test data.

Latest screenshot paths are emitted by the smoke script:

- full page: `output/playwright/api-automation-phase3b-<stamp>.png`
- request editor detail: `output/playwright/api-automation-phase3f-editor-<stamp>.png`

## Risks

- This is still structural/visual alignment, not pixel-level reproduction.
- Headers, params, and form body support key/value/description only; old-project advanced columns are deferred.
- Embedded cases reuse the existing case management widget, so it is not yet an old-project exact case table.
- Smoke still logs the expected unauthenticated `GET /api/auth/me` 401 before login.
- Runtime Vue `toRefs()` warnings are still observed during smoke, with no page errors.
